CREATE DATABASE IF NOT EXISTS pemweb_obe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pemweb_obe;

-- 1. Tabel users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'petugas', 'viewer') NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel bengkel_las (Domain K3 Bengkel Las)
CREATE TABLE IF NOT EXISTS bengkel_las (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    nama_bengkel VARCHAR(120) NOT NULL,
    lokasi VARCHAR(150) NOT NULL,
    status_aktif TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bengkel_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Tabel log_deteksi_apd
CREATE TABLE IF NOT EXISTS log_deteksi_apd (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bengkel_id BIGINT UNSIGNED NOT NULL,
    status_apd ENUM('Lengkap', 'Tidak Lengkap') NOT NULL,
    skor_kepercayaan DECIMAL(5,2) NOT NULL,
    url_gambar_bukti VARCHAR(255) DEFAULT NULL,
    waktu_deteksi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_bengkel FOREIGN KEY (bengkel_id) REFERENCES bengkel_las(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indeks untuk optimalisasi pencarian (Latihan Modul 10)
CREATE INDEX idx_log_bengkel_status ON log_deteksi_apd(bengkel_id, status_apd);