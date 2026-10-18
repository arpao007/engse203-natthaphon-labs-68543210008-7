import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = path.join(import.meta.dirname, 'campus.db');
const schemaPath = path.join(import.meta.dirname, 'schema.sql');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new DatabaseSync(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);
console.log('✅ สร้าง starter/campus.db สำเร็จเรียบร้อย!');