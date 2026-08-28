/**
 * requestService.js — ชั้นเข้าถึงข้อมูล
 *
 * กติกาที่ checker ตรวจจริง:
 *   - fetch() ต้องอยู่ในไฟล์นี้เท่านั้น
 *   - หน้าและ component เรียกเฉพาะฟังก์ชันที่ export จากไฟล์นี้
 *
 * TODO ในไฟล์นี้แบ่งเป็น 2 ระยะ
 *   5A-x  ทำในคาบแรก  (อ่านข้อมูล)
 *   5B-x  ทำในคาบสอง  (เขียนข้อมูล)
 * ทำเฉพาะ TODO ของคาบปัจจุบัน อย่าข้ามไปทำของคาบหน้า
 */

// TODO 5B-1: เปิดใช้บรรทัดล่างนี้เมื่อถึงคาบ 5B
import {
  clearStoredRequests,
  readStoredRequests,
  writeStoredRequests,
} from './requestStorage.js';

const LAB_DELAY_MS = 420;

/* ─────────── ให้มาแล้ว ไม่ต้องแก้ ─────────── */

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * หน่วงเวลาเล็กน้อยเพื่อให้เห็น loading state ชัดเจน
 * ตัวแปร __ENGSE203_SKIP_DELAY__ เป็นสวิตช์ให้ checker ปิดการหน่วงตอนทดสอบ
 * ไม่ใช่ส่วนหนึ่งของงานที่ต้องทำ
 */
async function waitForLabDelay() {
  await delay(globalThis.__ENGSE203_SKIP_DELAY__ ? 0 : LAB_DELAY_MS);
}

/* ─────────── คาบ 5A ─────────── */

/**
 * TODO 5A-1 · อ่านข้อมูลตัวอย่างจากไฟล์ public/data/initialRequests.json
 *
 * สิ่งที่ต้องทำ
 *   1. หา base URL จาก import.meta.env?.BASE_URL โดยมี ?. ด้วย
 *      (ถ้าไม่ใส่ ?. checker จะเรียกฟังก์ชันนี้นอก Vite ไม่ได้)
 *   2. fetch ไปที่ `${baseUrl}data/initialRequests.json`
 *   3. ตรวจ response.ok ก่อนเสมอ ถ้าไม่ ok ให้ throw ข้อความที่ผู้ใช้เข้าใจได้
 *   4. แปลงเป็น JSON แล้วคืนสำเนาด้วย structuredClone()
 *
 * ทำไมต้อง structuredClone: เพื่อให้ผู้เรียกได้ข้อมูลชุดของตัวเอง
 * ถ้าคืนตัวเดิมไปตรง ๆ แล้วมีคนแก้ ข้อมูลต้นทางจะเปลี่ยนตามโดยไม่ตั้งใจ
 */
async function fetchSeedRequests() {
  const baseUrl = import.meta.env?.BASE_URL ?? "/";

  const response = await fetch(
    `${baseUrl}data/initialRequests.json`
  );

  if (!response.ok) {
    throw new Error("ไม่สามารถโหลดข้อมูลคำร้องได้");
  }

  const data = await response.json();

  return structuredClone(data);
}

/**
 * TODO 5A-2 · ทำให้ getRequests() คืนข้อมูลได้
 *
 * ตอนนี้ให้คืนผลจาก fetchSeedRequests() ตรง ๆ
 * (คาบหน้าเราจะเปลี่ยนบรรทัดนี้เพียงบรรทัดเดียว)
 *
 * ส่วน scenario error และ empty เขียนไว้ให้แล้ว ใช้ทดสอบ UI
 */
export async function getRequests(options = {}) {
  await waitForLabDelay();

  if (options.scenario === "error") {
    throw new Error(
      "LAB scenario: จำลองการโหลดข้อมูลไม่สำเร็จ"
    );
  }

  if (options.scenario === "empty") {
    return [];
  }

  return loadNormalRequests(options.onRecovery);
}

/**
 * TODO 5A-3 · หาคำร้องใบเดียวตามรหัส
 *
 * เรียก getRequests() แล้วค้นหาด้วย .find()
 * ถ้าไม่พบ ให้คืน null — ห้าม throw
 * เพราะ "หาไม่เจอ" ไม่ใช่ความผิดพลาดของระบบ
 */
export async function getRequestById(requestId) {
  const requests = await getRequests();

  return (
    requests.find(
      (request) => request.id === requestId
    ) || null
  );
}

/* ─────────── คาบ 5B ─────────── */

async function loadNormalRequests(onRecovery) {
  const stored = readStoredRequests();

  if (stored.status === 'valid') {
    return stored.requests;
  }

  const seed = await fetchSeedRequests();

  if (stored.status === 'invalid') {
    onRecovery?.('ข้อมูลเดิมเสียหาย ระบบกู้คืนข้อมูลตัวอย่างให้อัตโนมัติ');
  }

  writeStoredRequests(seed);

  return seed;
}

/**
 * TODO 5B-4 · เพิ่มคำร้องใหม่
 *
 *   1. ตรวจข้อมูลก่อนใช้งาน — ระวังกรณี field เป็น undefined
 *      อย่าใช้ input.name?.trim().length < 2 เพราะ undefined < 2 ได้ false เงียบ ๆ
 *   2. สร้างรหัสที่ขึ้นต้นด้วย REQ- และไม่ซ้ำกับที่มีอยู่
 *   3. ตัดช่องว่างหัวท้ายทุก field ที่เป็นข้อความ
 *   4. status เริ่มต้นเป็น 'pending' เสมอ
 *   5. persist แล้วคืน object ใหม่
 */
export async function addRequest(requestInput) {
  const requests = await getRequests();

  if (
    !requestInput?.requesterName?.trim() ||
    !requestInput?.requestType?.trim() ||
    !requestInput?.location?.trim() ||
    !requestInput?.details?.trim()
  ) {
    throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  const newRequest = {
    ...requestInput,
    id: `REQ-${Date.now()}`,
    requesterName: requestInput.requesterName.trim(),
    requestType: requestInput.requestType.trim(),
    location: requestInput.location.trim(),
    details: requestInput.details.trim(),
    status: 'pending',
  };

  const updated = [...requests, newRequest];

  writeStoredRequests(updated);

  return newRequest;
}


/**
 * TODO 5B-5 · ลบคำร้องตามรหัส
 * ใช้ .filter() สร้าง array ใหม่ อย่าแก้ array เดิม แล้ว persist
 */
export async function deleteRequest(requestId) {
  const requests = await getRequests();

  const updated = requests.filter(
    (request) => request.id !== requestId
  );

  writeStoredRequests(updated);

  return updated;
}

/**
 * TODO 5B-6 · คืนค่าข้อมูลตัวอย่างเริ่มต้น
 * ล้างคีย์ของ LAB05 แล้วโหลด seed ใหม่ทับ
 */
export async function resetRequests() {
  clearStoredRequests();

  const seed = await fetchSeedRequests();

  writeStoredRequests(seed);

  return seed;
}