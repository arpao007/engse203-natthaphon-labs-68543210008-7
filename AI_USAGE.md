ชื่อ-รหัส: Natthaphon Saewang 685432100008-7

บันทึกทุกครั้งที่ใช้ AI ระหว่างสอบ

| เวลา | งาน (B1/B2/B3/B4) | ถาม AI ว่าอะไร | ใช้คำตอบส่วนไหน | แก้เอง/ตรวจสอบอย่างไร |
|---|---|---|---|---|
| 10:40 | B1 | ช่วยหาสาเหตุ Summary pending แสดงจำนวนผิด | ใช้แนวทางตรวจ filter และ status | แก้ request.status === 'pending' และตรวจผลในหน้า Dashboard |
| 11:09 | B1 | ช่วยหาสาเหตุ Filter สถานะทำงานผิด | ใช้คำแนะนำเรื่องเงื่อนไข === และ !== | แก้ status filter แล้วทดสอบกดแต่ละสถานะ |
| 11:22 | B1 | URL เปลี่ยนแต่ข้อมูลไม่เปลี่ยนเกิดจากอะไร | ใช้คำอธิบาย useEffect dependency | เพิ่ม requestId ใน dependency array และทดสอบ REQ-001 กับ REQ-002 |
| 11:36 | B1 | ลบข้อมูลแล้วไม่หายจากหน้าจอแก้อย่างไร | ใช้แนวทาง setRequests(nextRequests) | ทดสอบกดลบแล้วการ์ดหายทันที |
| 11:55 | B1 | Reset Demo Data แล้วหน้าพังควรเช็คอะไร | ใช้แนวทาง await resetRequests() | ทดสอบ Reset แล้วข้อมูลกลับมา 5 รายการ |
| 12:15 | B2 | เพิ่มช่องค้นหาใน React ด้วย useState อย่างไร | ใช้การสร้าง searchText state และ input | ทดสอบพิมพ์ข้อความในช่องค้นหา |
| 12:34 | B2 | กรองข้อมูลจาก requesterName และ details อย่างไร | ใช้ filter(), includes(), toLowerCase() | ทดสอบค้นหาคำว่า ห้อง และตรวจผลลัพธ์ |
| 12:50 | B3 | เพิ่มปุ่มทำเสร็จและอัปเดตสถานะอย่างไร | ใช้ updateRequestStatus และ callback | ทดสอบกดทำเสร็จแล้วสถานะเปลี่ยน |
| 13:06 | B4 | สร้าง Component PriorityBadge อย่างไร | ใช้แนวทางสร้าง component รับ props | สร้าง PriorityBadge.jsx และทดสอบ urgent/normal |
| 13:17 | B4 | จัดการกรณี priority ไม่ถูกต้องอย่างไร | ใช้แนวคิด edge case และ default UI | เพิ่มข้อความ "ไม่ระบุ" และทดสอบด้วยค่าอื่น |