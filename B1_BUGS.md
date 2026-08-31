# B1 · บันทึกการแก้บั๊ก (กรอกให้ครบทั้ง 6 จุด)

> แต่ละบั๊กให้เขียน 4 อย่าง: ไฟล์ · บรรทัด · สาเหตุ (ทำไมทำงานผิด) · แก้อย่างไร
> เขียนด้วยคำของตัวเอง — จุดนี้จะถูกถามใน oral

## บั๊กที่ 1 — อาการ: Console เตือนสีเหลืองเรื่องรายการ
- ไฟล์/บรรทัด:requests.map
- สาเหตุ:React ต้องการ key ที่ไม่ซ้ำกันสำหรับแต่ละรายการใน list แต่ RequestCard ไม่มี key
- แก้อย่างไร:เพิ่ม key={request.id} ใน RequestCard ที่สร้างจาก requests.map()

## บั๊กที่ 2 — อาการ: ตัวเลข "รอดำเนินการ" ในแผงสรุปไม่ตรงกับที่เห็น
- ไฟล์/บรรทัด:DashboardPage.jsx (summary)
- สาเหตุ:pending ถูกนับจาก status === 'completed' แทนที่จะนับจาก status === 'pending'
- แก้อย่างไร:เปลี่ยนเงื่อนไขเป็น request.status === 'pending'

## บั๊กที่ 3 — อาการ: กดตัวกรอง "รอดำเนินการ" แล้วได้รายการที่ไม่ใช่
- ไฟล์/บรรทัด:DashboardPage.jsx (filteredRequests)
- สาเหตุ:request.status !== statusFilter ทำให้แสดงรายการที่ไม่ตรงกับสถานะที่เลือก
- แก้อย่างไร:เปลี่ยนเป็น request.status === statusFilter

## บั๊กที่ 4 — อาการ: เปลี่ยน URL จาก REQ-001 เป็น REQ-002 แล้วข้อมูลไม่เปลี่ยน
- ไฟล์/บรรทัด:RequestDetailPage.jsx (useEffect)
- สาเหตุ:useEffect ไม่ได้ติดตามการเปลี่ยนแปลงของ requestId
- แก้อย่างไร:เพิ่ม requestId ใน dependency array ของ useEffect

## บั๊กที่ 5 — อาการ: กด "ลบ" แล้วรายการยังอยู่ ต้องรีเฟรชถึงหาย
- ไฟล์/บรรทัด:DashboardPage.jsx (handleDelete)
- สาเหตุ:setRequests(requests) ซึ่งเป็น state เดิม
- แก้อย่างไร:เปลี่ยนเป็น setRequests(nextRequests) จากข้อมูลที่ service ส่งกลับมา

## บั๊กที่ 6 — อาการ: กด "Reset Demo Data" แล้วหน้าพัง/ว่างเปล่า
- ไฟล์/บรรทัด:DashboardPage.jsx (handleReset)
- สาเหตุ:resetRequests() คืนค่าแบบ asynchronous แต่ถูกส่งเข้า setRequests โดยไม่ await
- แก้อย่างไร:ใช้ await resetRequests() แล้วนำค่าที่ได้มา setRequests()
