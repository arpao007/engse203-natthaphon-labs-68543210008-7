# Campus Service — Full-Stack (Week 11 · starter)
# Campus Service Request System

## ภาพรวม

ระบบจัดการคำร้องบริการภายในมหาวิทยาลัย พัฒนาด้วย React, Express และ SQLite

ผู้ใช้สามารถ

- ดูคำร้อง
- เพิ่มคำร้อง
- เปลี่ยนสถานะคำร้อง
- ลบคำร้อง
- ตรวจสอบสถานะระบบผ่าน Health Check

---

## สถาปัตยกรรม 3 ชั้น

┌─────────┐ HTTP ┌──────────┐ SQL ┌─────────┐
│ React │ ─────► │ Express │ ───► │ SQLite │
└─────────┘ JSON └──────────┘ rows └─────────┘

| ชั้น | หน้าที่ | โฟลเดอร์ |
|--------|----------|----------|
| Frontend | ส่วนติดต่อผู้ใช้ | frontend/ |
| API | Route Controller Service | api/src/ |
| Database | จัดเก็บข้อมูล | api/data/ |

---

## การรันระบบ (Development)

### Terminal 1

cd api
npm install
npm run dev

### Terminal 2

cd frontend
npm install
npm run dev

Frontend
http://localhost:5173

API
http://localhost:3001

---

## การรันระบบ (Production)

cd frontend
npm run build

cd ../api
NODE_ENV=production npm start

เปิด

http://localhost:3001

---

## Environment Variables

| Variable | Default |
|------------|-----------------------|
| NODE_ENV | development |
| PORT | 3001 |
| CORS_ORIGIN | http://localhost:5173 |
| DB_FILE | api/data/campus.db |

---

## การตัดสินใจออกแบบ

- แยก Frontend, API และ Database ออกจากกันเพื่อง่ายต่อการบำรุงรักษา
- เลือก SQLite เพราะข้อมูลมีโครงสร้างชัดเจนและมีความสัมพันธ์ระหว่างตาราง
- ใช้ Environment Variables เพื่อรองรับการ Deploy บน Cloud
- เพิ่ม Health Check เพื่อตรวจสอบสถานะระบบและฐานข้อมูล