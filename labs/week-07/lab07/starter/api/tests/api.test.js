import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;

before(async () => {
  await loadSeed();
  app = createApp();
});

describe('API Integration Tests', () => {
  test('1. GET /api/requests คืนรายการทั้งหมด พร้อม status 200', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('2. GET /api/requests/:id ที่มีอยู่ คืน status 200', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    assert.equal(res.status, 200);
  });

  test('3. GET /api/requests/:id ที่ไม่มีอยู่ คืน status 404', async () => {
    const res = await request(app).get('/api/requests/REQ-9999');
    assert.equal(res.status, 404);
  });

  test('4. POST /api/requests ข้อมูลถูกต้อง ตอบกลับ 201', async () => {
    const newRequest = {
      requesterName: 'ทดสอบ ระบบ',
      requestType: 'แจ้งซ่อม',
      location: 'ห้อง 101',
      details: 'ทดสอบส่งข้อมูลเพื่อสร้างคำร้อง',
      priority: 'normal'
    };
    const res = await request(app).post('/api/requests').send(newRequest);
    assert.equal(res.status, 201);
  });

  test('5. POST /api/requests ข้อมูลไม่ครบ ตอบกลับ 400', async () => {
    const res = await request(app).post('/api/requests').send({ requesterName: 'ก' });
    assert.equal(res.status, 400);
  });

  test('6. ตอบกลับ CORS Header ที่อนุญาตอย่างถูกต้อง', async () => {
    const res = await request(app).get('/api/requests').set('Origin', 'http://localhost:5173');
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
  });
});
