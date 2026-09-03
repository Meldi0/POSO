-- =================================================================================================
-- SISTEM HELPDESK & MANAJEMEN TIKET TERPADU (POSO v2.0)
-- Database Schema & Master Seed Data
-- Kompatibel dengan: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, phpMyAdmin / XAMPP
-- =================================================================================================

CREATE DATABASE IF NOT EXISTS `poso_helpdesk` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `poso_helpdesk`;

SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------------------------------------------
-- TABEL 1: users (Data Pengguna & Autentikasi RBAC)
-- -------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `password_plain` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('admin', 'operator', 'upt', 'pengguna_umum') NOT NULL DEFAULT 'pengguna_umum',
  `unit_kerja` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------------------
-- TABEL 2: tickets (Master Data Tiket Pengaduan)
-- -------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `ticket_id` VARCHAR(50) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
  `status` ENUM('open', 'in_progress', 'waiting', 'closed') NOT NULL DEFAULT 'open',
  `requester_name` VARCHAR(150) NOT NULL,
  `requester_email` VARCHAR(150) NOT NULL,
  `requester_phone` VARCHAR(30) DEFAULT NULL,
  `assigned_upt` VARCHAR(100) DEFAULT NULL,
  `assigned_operator` VARCHAR(150) DEFAULT NULL,
  `sla_due_at` DATETIME DEFAULT NULL,
  `closed_at` DATETIME DEFAULT NULL,
  `attachments` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ticket_id`),
  KEY `idx_tickets_status` (`status`),
  KEY `idx_tickets_priority` (`priority`),
  KEY `idx_tickets_requester_email` (`requester_email`),
  KEY `idx_tickets_assigned_upt` (`assigned_upt`),
  KEY `idx_tickets_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------------------
-- TABEL 3: threads (Riwayat Diskusi, Chat Pelapor, & Catatan Internal Staf)
-- -------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `threads`;
CREATE TABLE `threads` (
  `thread_id` VARCHAR(50) NOT NULL,
  `ticket_id` VARCHAR(50) NOT NULL,
  `sender_id` VARCHAR(50) NOT NULL,
  `sender_name` VARCHAR(150) NOT NULL,
  `sender_role` VARCHAR(50) NOT NULL DEFAULT 'pengguna_umum',
  `message` TEXT NOT NULL,
  `visibility` ENUM('public', 'internal') NOT NULL DEFAULT 'public',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`thread_id`),
  KEY `idx_threads_ticket_id` (`ticket_id`),
  KEY `idx_threads_visibility` (`visibility`),
  CONSTRAINT `fk_threads_tickets` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------------------
-- TABEL 4: settings (Konfigurasi Global Sistem & SLA Default)
-- -------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------------------------------
-- TABEL 5: audit_logs (Log Jejak Rekam Aktivitas & Perubahan Status)
-- -------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `log_id` VARCHAR(50) NOT NULL,
  `ticket_id` VARCHAR(50) DEFAULT NULL,
  `actor_name` VARCHAR(150) NOT NULL,
  `actor_role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_audit_logs_ticket_id` (`ticket_id`),
  KEY `idx_audit_logs_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------------------------------------------------
-- MASTER SEED DATA (DATA AWAL SIAP PAKAI)
-- -------------------------------------------------------------------------------------------------
INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `password_plain`, `role`, `unit_kerja`, `phone`, `is_active`) VALUES
('USR-ADMIN-01', 'Administrator POSO', 'admin@poso.local', 'Admin123!', 'Admin123!', 'admin', 'Direktorat TI & Sistem Informasi', '081234567890', 1),
('USR-OP-01', 'Operator Helpdesk Utama', 'operator@poso.local', 'Operator123!', 'Operator123!', 'operator', 'Pusat Layanan Terpadu', '081234567891', 1),
('USR-UPT-TI', 'Staf UPT TI & Jaringan', 'upt.ti@poso.local', 'Poso123!', 'Poso123!', 'upt', 'UPT TI & Jaringan', '081234567892', 1),
('USR-UPT-SARPRAS', 'Staf UPT Sarana & Prasarana', 'upt.sarpras@poso.local', 'Poso123!', 'Poso123!', 'upt', 'UPT Sarana & Prasarana', '081234567893', 1),
('USR-PUBLIC-01', 'Dewi Lestari', 'dewi@gmail.com', 'User123!', 'User123!', 'pengguna_umum', 'Pelapor / Pengguna Umum', '089876543210', 1);

INSERT INTO `settings` (`setting_key`, `setting_value`, `description`) VALUES
('SLA_LOW_HOURS', '72', 'Target penyelesaian tiket prioritas Low (72 Jam)'),
('SLA_MEDIUM_HOURS', '24', 'Target penyelesaian tiket prioritas Medium (24 Jam)'),
('SLA_HIGH_HOURS', '8', 'Target penyelesaian tiket prioritas High (8 Jam)'),
('SLA_URGENT_HOURS', '2', 'Target penyelesaian tiket prioritas Urgent (2 Jam)'),
('APP_NAME', 'POSO Helpdesk System', 'Nama resmi aplikasi helpdesk'),
('ORG_NAME', 'PT Pos Indonesia / Institusi Layanan Terpadu', 'Instansi pengelola layanan');

INSERT INTO `tickets` (
  `ticket_id`, `subject`, `category`, `description`, `priority`, `status`,
  `requester_name`, `requester_email`, `requester_phone`, `assigned_upt`, `assigned_operator`,
  `sla_due_at`, `created_at`, `updated_at`
) VALUES
(
  'TICK-20260902-3947',
  'Kendala Koneksi Wi-Fi & Akses Portal',
  'Jaringan & Internet',
  'Koneksi internet di lantai 3 Gedung Graha mengalami gangguan putus-nyambung sejak pagi hari.',
  'Medium',
  'open',
  'Dewi Lestari',
  'dewi@gmail.com',
  '089876543210',
  'UPT TI & Jaringan',
  'Operator Helpdesk Utama',
  DATE_ADD(NOW(), INTERVAL 22 HOUR),
  NOW(),
  NOW()
),
(
  'TICK-20260901-1002',
  'AC Ruang Rapat 204 Tidak Dingin & Menetes',
  'Sarana & Prasarana',
  'Unit pendingin ruangan di ruang rapat utama lantai 2 meneteskan air dan suhu tidak berubah dingin.',
  'High',
  'in_progress',
  'Budi Santoso',
  'budi.santoso@poso.local',
  '081399887766',
  'UPT Sarana & Prasarana',
  'Operator Helpdesk Utama',
  DATE_ADD(NOW(), INTERVAL 6 HOUR),
  DATE_SUB(NOW(), INTERVAL 2 HOUR),
  NOW()
),
(
  'TICK-20260901-1003',
  'Reset Password Akun SSO Kepegawaian',
  'Layanan Akun & Portal',
  'Akun SSO terkunci setelah 3 kali salah memasukkan password saat mengakses sistem presensi.',
  'Urgent',
  'closed',
  'Siti Nurhaliza',
  'siti.nur@poso.local',
  '085612348765',
  'UPT TI & Jaringan',
  'Operator Helpdesk Utama',
  DATE_SUB(NOW(), INTERVAL 1 HOUR),
  DATE_SUB(NOW(), INTERVAL 4 HOUR),
  NOW()
);

INSERT INTO `threads` (`thread_id`, `ticket_id`, `sender_id`, `sender_name`, `sender_role`, `message`, `visibility`, `created_at`) VALUES
('TH-001', 'TICK-20260902-3947', 'USR-ADMIN-01', 'Administrator POSO', 'admin', 'Halo Dewi, laporan Anda sudah kami terima dan sedang ditindaklanjuti oleh teknisi jaringan.', 'public', NOW()),
('TH-002', 'TICK-20260902-3947', 'USR-PUBLIC-01', 'Dewi Lestari', 'pengguna_umum', 'Siap Pak, terima kasih atas bantuannya!', 'public', DATE_ADD(NOW(), INTERVAL 2 MINUTE)),
('TH-003', 'TICK-20260901-1002', 'USR-OP-01', 'Operator Helpdesk Utama', 'operator', 'Tiket telah didelegasikan ke UPT Sarpras untuk pengecekan freon dan saluran pembuangan.', 'internal', DATE_SUB(NOW(), INTERVAL 1 HOUR));

INSERT INTO `audit_logs` (`log_id`, `ticket_id`, `actor_name`, `actor_role`, `action`, `details`, `created_at`) VALUES
('LOG-001', 'TICK-20260902-3947', 'Dewi Lestari', 'pengguna_umum', 'CREATE_TICKET', 'Tiket baru berhasil diajukan oleh pelapor.', NOW()),
('LOG-002', 'TICK-20260902-3947', 'Operator Helpdesk Utama', 'operator', 'ASSIGN_UPT', 'Tiket didelegasikan ke UPT TI & Jaringan.', NOW());
