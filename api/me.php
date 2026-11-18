<?php
session_start();
header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(0);

// Cek apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Ambil data user dari database (kecuali password) tanpa menyertakan password hash
// Contoh data hasil query:
$userData = [
    "id" => $_SESSION['user_id'] ?? null,
    "email" => $_SESSION['email'] ?? $_SESSION['user_email'] ?? null, // sesuaikan dengan session yang Anda buat
    "role" => $_SESSION['role'] ?? null
];

http_response_code(200);
echo json_encode($userData);
?>