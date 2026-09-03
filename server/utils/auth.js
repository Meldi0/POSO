import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'poso_jwt_default_secret_key_2026';
const GLOBAL_SALT = 'POSO_SALT_DEFAULT';

export function hashPasswordLegacy(password, salt = 'poso') {
  const combined = password + salt + GLOBAL_SALT;
  const hash = crypto.createHash('sha256').update(combined, 'utf8').digest('hex');
  return `${hash}:${salt}`;
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(inputPassword, storedHash) {
  if (!storedHash || !inputPassword) return false;

  // 1. Check if stored in bcrypt format ($2a$, $2b$, $2y$)
  if (storedHash.startsWith('$2')) {
    try {
      const match = await bcrypt.compare(inputPassword, storedHash);
      if (match) return true;
    } catch (e) {}
  }

  // 2. Check if stored in legacy SHA-256 format (hash:salt)
  if (storedHash.includes(':')) {
    const [hash, salt] = storedHash.split(':');
    const computed = crypto.createHash('sha256').update(inputPassword + salt + GLOBAL_SALT, 'utf8').digest('hex');
    if (computed === hash) return true;
  }

  // 3. Fallback check plain text (for initial development or testing)
  if (storedHash === inputPassword) {
    return true;
  }

  return false;
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
