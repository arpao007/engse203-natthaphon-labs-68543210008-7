import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '../..');
const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db');
const SCHEMA_FILE = path.join(API_ROOT, 'data', 'schema.sql');

let db;

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

function toAppError(err) {
  const m = err.message ?? '';
  if (m.includes('FOREIGN KEY')) return new AppError('อ้างถึงข้อมูลที่ไม่มีอยู่จริง', 400);
  if (m.includes('CHECK'))       return new AppError('ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด', 400);
  if (m.includes('UNIQUE'))      return new AppError('ข้อมูลนี้มีอยู่แล้วในระบบ', 409);
  if (m.includes('NOT NULL'))    return new AppError('ข้อมูลไม่ครบถ้วน', 400);
  return err;
}

const SELECT_SHAPE = `
  SELECT r.id,
         u.name AS requesterName,
         r.request_type AS requestType,
         r.location,
         r.details,
         r.priority,
         r.status
  FROM requests r
  JOIN users u ON u.id = r.requester_id`;

export async function loadSeed() {
  db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');

  // 1. เช็คว่าตาราง requests มีหรือยัง
  const ready = db.prepare(
    "SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name='requests'"
  ).get().c;

  // 2. ถ้ายังไม่มี ให้สร้างตารางจาก schema.sql ก่อน
  if (!ready && SCHEMA_FILE) {
    db.exec(readFileSync(SCHEMA_FILE, 'utf8'));
  }

  // 3. สร้าง INDEX หลังจากตารางถูกสร้างเรียบร้อยแล้ว [CHAL ⭐]
  db.exec('CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id)');
}

export function findAll({ status } = {}) {
  return status
    ? db.prepare(`${SELECT_SHAPE} WHERE r.status = ? ORDER BY r.id`).all(status)
    : db.prepare(`${SELECT_SHAPE} ORDER BY r.id`).all();
}

export function findById(id) {
  return db.prepare(`${SELECT_SHAPE} WHERE r.id = ?`).get(id) ?? null;
}

function resolveUserId(name) {
  const found = db.prepare('SELECT id FROM users WHERE name = ?').get(name);
  if (found) return found.id;

  const slug = Date.now().toString(36);
  return db.prepare('INSERT INTO users (name, department, email) VALUES (?, ?, ?)')
           .run(name, 'ไม่ระบุ', `user-${slug}@rmutl.ac.th`).lastInsertRowid;
}

function nextId() {
  const row = db.prepare(
    "SELECT id FROM requests WHERE id LIKE 'REQ-%' ORDER BY id DESC LIMIT 1"
  ).get();
  const n = row ? Number(String(row.id).replace('REQ-', '')) + 1 : 1;
  return `REQ-${String(n).padStart(3, '0')}`;
}

export function create(input) {
  const id = nextId();

  db.exec('BEGIN');
  try {
    const requesterId = resolveUserId(input.requesterName.trim());
    db.prepare(
      `INSERT INTO requests (id, requester_id, request_type, location, details, priority)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      requesterId,
      input.requestType,
      input.location.trim(),
      input.details.trim(),
      input.priority ?? 'normal'
    );
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw toAppError(err);
  }

  return findById(id);
}

export function updateStatus(id, status) {
  try {
    const result = db.prepare('UPDATE requests SET status = ? WHERE id = ?')
                     .run(status, id);
    return result.changes ? findById(id) : null;
  } catch (err) {
    throw toAppError(err);
  }
}

export function remove(id) {
  const target = findById(id);
  if (!target) return null;
  db.prepare('DELETE FROM requests WHERE id = ?').run(id);
  return target;
}

export function findAllUsers() {
  return db.prepare('SELECT * FROM users ORDER BY id').all();
}

export function findUserRequests(userId) {
  return db.prepare(`${SELECT_SHAPE} WHERE r.requester_id = ? ORDER BY r.id`).all(userId);
}