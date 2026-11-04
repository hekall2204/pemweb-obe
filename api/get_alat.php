<?php
// api/get_alat.php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Mengambil parameter filter kategori dari URL (query string)
$kategori = isset($_GET['kategori']) ? trim($_GET['kategori']) : '';

try {
    // Menggunakan Prepared Statement untuk mencegah SQL Injection
    if (!empty($kategori) && $kategori !== 'Semua') {
        $query = "SELECT id, nama, kategori, jumlah, kondisi, created_at_updated_at FROM alat WHERE kategori = :kategori ORDER BY id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute([':kategori' => $kategori]);
    } else {
        $query = "SELECT id, nama, kategori, jumlah, kondisi, created_at_updated_at FROM alat ORDER BY id DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
    }

    $result = $stmt->fetchAll();
    $total = count($result);

    if ($total > 0) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Data alat berhasil ditemukan",
            "total" => $total,
            "data" => $result
        ], JSON_PRETTY_PRINT);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Data alat tidak ditemukan",
            "total" => 0,
            "data" => []
        ], JSON_PRETTY_PRINT);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gagal mengambil data: " . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>