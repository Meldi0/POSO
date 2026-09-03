import express from 'express';
import { authenticate, requireAuth, requireRole } from '../middleware/authMiddleware.js';
import * as authController from '../controllers/authController.js';
import * as ticketController from '../controllers/ticketController.js';
import * as userController from '../controllers/userController.js';
import * as analyticsController from '../controllers/analyticsController.js';
import { pool } from '../config/db.js';

const router = express.Router();

// Apply auth parser middleware to all routes
router.use(authenticate);

// -------------------------------------------------------------------------------------------------
// 1. SYSTEM & HEALTH CHECK
// -------------------------------------------------------------------------------------------------
router.get('/health', async (req, res) => {
  const start = Date.now();
  try {
    const [rows] = await pool.query('SELECT 1 + 2 AS three, DATABASE() AS db');
    res.status(200).json({
      status: 'success',
      message: 'POSO Backend API & Aiven MySQL Active',
      database: rows[0].db,
      latency_ms: Date.now() - start,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed: ' + err.message,
      latency_ms: Date.now() - start
    });
  }
});

// -------------------------------------------------------------------------------------------------
// 2. AUTHENTICATION
// -------------------------------------------------------------------------------------------------
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/me', requireAuth, authController.getProfile);

// -------------------------------------------------------------------------------------------------
// 3. TICKETS & THREADS
// -------------------------------------------------------------------------------------------------
router.get('/tickets', ticketController.getTickets);
router.post('/tickets', ticketController.createTicket);
router.get('/tickets/track/:id', ticketController.trackTicket);
router.get('/tickets/:id', ticketController.getTicketDetail);
router.patch('/tickets/:id/status', requireAuth, ticketController.updateTicketStatus);
router.post('/tickets/:id/threads', ticketController.addThreadMessage);

// -------------------------------------------------------------------------------------------------
// 4. ADMIN USER MANAGEMENT
// -------------------------------------------------------------------------------------------------
router.get('/admin/users', requireAuth, requireRole('admin'), userController.getUsers);
router.post('/admin/users', requireAuth, requireRole('admin'), userController.createUser);
router.patch('/admin/users/:id', requireAuth, requireRole('admin'), userController.updateUserRole);
router.delete('/admin/users/:id', requireAuth, requireRole('admin'), userController.deleteUser);

// -------------------------------------------------------------------------------------------------
// 5. ADMIN CONFIG & AUDIT
// -------------------------------------------------------------------------------------------------
router.get('/admin/audit-logs', requireAuth, requireRole(['admin', 'operator']), analyticsController.getAuditLogs);
router.get('/admin/features', requireAuth, analyticsController.getFeatureFlags);
router.put('/admin/features', requireAuth, requireRole('admin'), analyticsController.updateFeatureFlags);
router.get('/admin/db-status', requireAuth, analyticsController.getDbStatus);

// -------------------------------------------------------------------------------------------------
// 6. ANALYTICS
// -------------------------------------------------------------------------------------------------
router.get('/analytics', analyticsController.getAnalytics);

export default router;
