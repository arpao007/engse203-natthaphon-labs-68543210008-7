-- ═══════════════════════════════════════════════════════════
-- queries.sql — คำสั่งค้นหาตอบโจทย์
-- 🏠 TODO W09-QUERY (CP22) · เขียนอย่างน้อย 8 ข้อ
--
-- เขียนคำสั่งจริงที่รันได้ ไม่ใช่เขียนบรรยาย
-- ทุกข้อต้องทดสอบแล้วว่าได้ผลลัพธ์ถูกต้อง
-- ═══════════════════════════════════════════════════════════

SELECT * FROM requests ORDER BY id;[cite: 2]


SELECT id, location, details FROM requests
WHERE status = 'pending'
ORDER BY id;[cite: 2]


SELECT * FROM requests 
WHERE priority = 'urgent' AND status <> 'completed';[cite: 2]


SELECT * FROM requests WHERE details LIKE '%ไม่ทำงาน%';[cite: 2]


SELECT r.id, u.name AS requesterName, r.status
FROM requests r
JOIN users u ON u.id = r.requester_id;[cite: 2]


SELECT r.id, u.name, u.department, r.details
FROM requests r
JOIN users u ON u.id = r.requester_id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;


SELECT DISTINCT u.name, u.email
FROM users u
JOIN requests r ON u.id = r.requester_id;


SELECT * FROM requests 
ORDER BY created_at DESC 
LIMIT 3;


-- ⭐ Challenge ─────────────────────────────────────────────
SELECT status, COUNT(*) AS total
FROM requests
GROUP BY status
ORDER BY total DESC;

SELECT u.name, u.department, COUNT(r.id) AS total_requests
FROM users u
LEFT JOIN requests r ON r.requester_id = u.id
GROUP BY u.id, u.name, u.department
ORDER BY total_requests DESC;

CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
