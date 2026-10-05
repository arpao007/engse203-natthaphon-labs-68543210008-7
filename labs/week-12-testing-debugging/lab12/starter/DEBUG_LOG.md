# บันทึกการไล่ปัญหา (Debug Log)

🏫 **TODO W12-LOG (CP45 · CP47)** — แต่ละ bug ตอบ 6 ข้อ · เขียนสั้น ๆ แต่ต้องชัด

> BUG #0 ไม่มีผู้ใช้แจ้ง — คุณจะเจอเองตอนเขียน unit test ค่าขอบใน CP45
> BUG #1–#3 มาจาก `BUG_REPORTS.md`

---

## BUG #0 · รายละเอียด 10 ตัวอักษรไม่ผ่าน

- **อาการ:** รายละเอียด 10 ตัวอักษรถูกปฏิเสธ ทั้งที่ควรผ่าน
- **วิธีทำซ้ำ:** ส่งข้อมูลคำร้องที่มี details ยาว 10 ตัวอักษรพอดี
- **เครื่องมือ:** Unit Test
- **สาเหตุ (ไฟล์:บรรทัด):** api/src/validators/requestValidator.js ใช้เงื่อนไข <= MIN_DETAILS
- **วิธีแก้:** เปลี่ยนเงื่อนไขจาก <= เป็น <
- **test ที่กัน:** requestValidator.test.js ทดสอบ "10 ตัวอักษร → ผ่าน"

## BUG #1 · ลบคำร้องแล้วเพิ่มใหม่ ได้ 500

- **อาการ:** ลบ REQ-002 แล้วเพิ่มคำร้องใหม่ ได้ 500
- **วิธีทำซ้ำ:** DELETE /api/requests/REQ-002 แล้ว POST สร้างคำร้องใหม่
- **เครื่องมือ:** Breakpoint
- **สาเหตุ (ไฟล์:บรรทัด):** api/src/services/requestService.js ฟังก์ชัน nextId() ใช้ COUNT(*) ทำให้ id ซ้ำ
- **วิธีแก้:** เปลี่ยนจาก COUNT(*) เป็น MAX(id) + 1
- **test ที่กัน:** requests.api.test.js ทดสอบ "ลบแล้วเพิ่มใหม่ → 201"

## BUG #2 · Dashboard แสดง "กำลังดำเนินการ 0"

- **อาการ:** Dashboard แสดงจำนวนกำลังดำเนินการเป็น 0
- **วิธีทำซ้ำ:** เปิด Dashboard และดู Summary Panel
- **เครื่องมือ:** Network Tab และ Frontend Unit Test
- **สาเหตุ (ไฟล์:บรรทัด):** frontend/src/utils/requestSummary.js ใช้ "in progress" แทน "in-progress"
- **วิธีแก้:** เปลี่ยนค่าให้ตรงกับข้อมูลจาก API
- **test ที่กัน:** requestSummary.test.js ทดสอบ "นับ in-progress ได้ถูกต้อง"

## BUG #3 · เปลี่ยนสถานะคำร้องที่ไม่มีอยู่ ได้ 500

- **อาการ:** PUT คำร้องที่ไม่มีอยู่ในระบบแล้วได้ 500
- **วิธีทำซ้ำ:** PUT /api/requests/REQ-999 พร้อมส่ง status=completed
- **เครื่องมือ:** Stack Trace
- **สาเหตุ (ไฟล์:บรรทัด):** api/src/controllers/requestController.js เรียก updated.id ก่อนตรวจ null
- **วิธีแก้:** ตรวจ !updated ก่อนตอบกลับ
- **test ที่กัน:** requests.api.test.js ทดสอบ "PUT คำร้องที่ไม่มี → 404"