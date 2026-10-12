import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('API Integration Tests (CP33 / CP16)', () => {

  test('1. GET /api/requests คืนค่า 200 และได้รายการข้อมูล', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('2. GET /api/requests คืน requesterName ไม่ใช่ requester_id', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    if (res.body.length > 0) {
      assert.ok('requesterName' in res.body[0]);
      assert.ok(!('requester_id' in res.body[0]));
    }
  });

  test('3. GET /api/requests/:id ดึงข้อมูลรายตัวหรือตอบ 404 เมื่อไม่พบ', async () => {
    const resExist = await request(app).get('/api/requests/REQ-001');
    assert.ok([200, 404].includes(resExist.status));

    const resNotFound = await request(app).get('/api/requests/REQ-999999');
    assert.equal(resNotFound.status, 404);
  });

  test('4. POST /api/requests สร้างข้อมูลสำเร็จ ตอบ 201', async () => {
    const newRequest = {
      requesterName: 'ทดสอบ ระบบ',
      requestType: 'แจ้งซ่อม',
      location: 'ห้อง CP30',
      details: 'ทดสอบระบบการส่งข้อมูล',
      priority: 'normal'
    };
    const res = await request(app).post('/api/requests').send(newRequest);
    assert.equal(res.status, 201);
    assert.equal(res.body.requesterName, 'ทดสอบ ระบบ');
  });

  test('5. POST /api/requests ส่งข้อมูลไม่ครบ ตอบ 400 Validation Error', async () => {
    const invalidRequest = {
      requesterName: 'ทดสอบ'
    };
    const res = await request(app).post('/api/requests').send(invalidRequest);
    assert.equal(res.status, 400);
  });

  test('6. GET /api/requests ป้องกัน SQL Injection ผ่าน ?status=', async () => {
    const evilStatus = encodeURIComponent("x' OR '1'='1");
    const res = await request(app).get(`/api/requests?status=${evilStatus}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0);
  });

});