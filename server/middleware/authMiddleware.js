import { verifyToken } from '../utils/auth.js';
import { pool } from '../config/db.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7).trim() 
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  const decoded = verifyToken(token);
  if (decoded && decoded.user_id) {
    req.user = decoded;
    return next();
  }

  // Fallback: check if token matches user_id or email directly in DB
  try {
    const [rows] = await pool.query(
      'SELECT user_id, name, email, role, upt_unit, is_active FROM users WHERE user_id = ? OR email = ? LIMIT 1',
      [token, token]
    );
    if (rows.length > 0 && rows[0].is_active) {
      req.user = rows[0];
      return next();
    }
  } catch (err) {}

  req.user = null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Autentikasi diperlukan. Silakan masuk terlebih dahulu.'
    });
  }
  next();
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Autentikasi diperlukan.'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        code: 403,
        message: 'Akses ditolak. Anda tidak memiliki wewenang untuk tindakan ini.'
      });
    }

    next();
  };
}
