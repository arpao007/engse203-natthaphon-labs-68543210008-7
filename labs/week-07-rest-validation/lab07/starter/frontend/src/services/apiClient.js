/**
 * ตัวกลางสำหรับคุยกับ API — ที่เดียวที่เรียก fetch()
 * ทุกฟังก์ชันใน requestService จะเรียกผ่านตรงนี้
 */

/**
 * TODO W07-F1 (CP11) · อ่าน base URL จาก environment
 *   import.meta.env.VITE_API_BASE_URL  (มีค่าเริ่มต้นเผื่อไม่มี .env.local)
 *
 * ⚠ ตัวแปรของ Vite ต้องขึ้นต้นด้วย VITE_ เท่านั้น
 *   ถ้าตั้งชื่อว่า API_BASE_URL เฉย ๆ จะได้ undefined
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function parseError(response) {
  try {
    const body = await response.json();
    return body.error ?? `คำขอไม่สำเร็จ (${response.status})`;
  } catch {
    return `คำขอไม่สำเร็จ (${response.status})`;
  }
}

export async function apiFetch(endpoint, options = {}, retries = 3, backoff = 500) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

  if (!response.ok && response.status >= 500 && retries > 0) {
      await sleep(backoff);
      return apiFetch(endpoint, options, retries - 1, backoff * 2);
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์',
        response.status,
        data.details || []
      );
    }

    return data;
  } catch (error) {
    if (retries > 0 && (error.name === 'TypeError' || !(error instanceof ApiError))) {
      await sleep(backoff);
      return apiFetch(endpoint, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export { ApiError };