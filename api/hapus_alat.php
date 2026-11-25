<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => ['code' => 401, 'message' => 'Akses ditolak: Silakan login terlebih dahulu']]);
    exit;
}

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => ['code' => 403, 'message' => 'Akses ditolak: Anda tidak memiliki hak akses sebagai admin']]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? [];

if (!in_array($method, ['DELETE', 'POST'], true)) {
    http_response_code(405);
    echo json_encode(['error' => ['code' => 405, 'message' => 'Metode HTTP tidak diizinkan']]);
    exit;
}

$clientToken = $input['csrf_token'] ?? $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (!isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $clientToken)) {
    http_response_code(403);
    echo json_encode(['error' => ['code' => 403, 'message' => 'CSRF token tidak valid atau kadaluarsa']]);
    exit;
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT) ?: filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => ['code' => 400, 'message' => 'ID tidak valid']]);
    exit;
}

try {
    $check = $pdo->prepare('SELECT id FROM alat WHERE id = ?');
    $check->execute([$id]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode(['error' => ['code' => 404, 'message' => 'Data tidak ditemukan']]);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM alat WHERE id = ?');
    $stmt->execute([$id]);

    echo json_encode(['message' => 'Data berhasil dihapus', 'id' => $id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => ['code' => 500, 'message' => 'Terjadi kesalahan pada server']]);
}