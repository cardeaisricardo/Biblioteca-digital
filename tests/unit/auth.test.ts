import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../../src/lib/auth.js';

describe('Auth Lib', () => {
  it('should hash password and verify it', async () => {
    const password = 'password123';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(await comparePassword(password, hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });

  it('should generate and verify JWT token', () => {
    const payload = { id: '123', role: 'USER' };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(payload);
  });
});
