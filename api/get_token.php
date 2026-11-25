<?php
require_once __DIR__ . '/auth.php'; // Memuat session dan fungsi auth

header('Content-Type: application/json; charset=utf-8');

// Tampilkan token CSRF yang ada di sesi pengguna saat ini
echo json_encode([
    'csrf_token' => $_SESSION['csrf_token'] ?? 'Token belum digenerate'
]);