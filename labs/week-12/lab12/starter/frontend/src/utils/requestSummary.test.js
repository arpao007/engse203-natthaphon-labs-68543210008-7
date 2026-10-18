import { describe, test, expect } from 'vitest';
import { summarizeRequests } from './requestSummary.js';

describe('summarizeRequests', () => {
  test('รายการว่าง → ทุกค่าเป็น 0', () => {
    expect(summarizeRequests([])).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  });

test('นับ in-progress ได้ถูกต้อง', () => {
  const result = summarizeRequests([
    { status: 'in-progress' },
    { status: 'in-progress' },
    { status: 'completed' },
  ]);

  expect(result.inProgress).toBe(2);
  });
});
