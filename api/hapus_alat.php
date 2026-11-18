<?php
session_start();
header('Content-Type: application/json');

// Cek apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Cek apakah role adalah admin (jika viewer, tolak dengan 403)
if (isset($_SESSION['role']) && $_SESSION['role'] === 'viewer') {
    http_response_code(403);
    echo json_encode(["error" => "Akses ditolak: Anda tidak memiliki hak akses sebagai admin"]);
    exit;
}

// Logika utama untuk admin (misal: hapus data)
// ...
?>