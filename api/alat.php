<?php
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // 1. GET by ID (jika ada parameter ?id=...)
            if (isset($_GET['id'])) {
                $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
                $stmt = $pdo->prepare('SELECT * FROM alat WHERE id = ?');
                $stmt->execute([$id]);
                $result = $stmt->fetch();
                
                if (!$result) {
                    http_response_code(404);
                    echo json_encode(['error' => ['code' => 404, 'message' => 'Data tidak ditemukan']]);
                    exit;
                }
                echo json_encode($result);
                exit;
            }

            // 2. GET Collection dengan Pencarian & Pagination (Latihan Modul)
            $search = $_GET['search'] ?? '';
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = 5;
            $offset = ($page - 1) * $limit;

            $stmt = $pdo->prepare("SELECT * FROM alat WHERE nama LIKE :search LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            echo json_encode($stmt->fetchAll());
            break;

        case 'POST':
            // Fitur Create dengan Validasi & Prepared Statement
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            
            $nama = trim((string) ($input['nama'] ?? ''));
            $kategori = trim((string) ($input['kategori'] ?? ''));
            $jumlah = filter_var($input['jumlah'] ?? null, FILTER_VALIDATE_INT);

            if ($nama === '' || $kategori === '' || $jumlah === false || $jumlah < 0) {
                http_response_code(400);
                echo json_encode(['error' => ['code' => 400, 'message' => 'Data alat tidak valid']]);
                exit;
            }

            $stmt = $pdo->prepare('INSERT INTO alat (nama, kategori, jumlah) VALUES (:nama, :kategori, :jumlah)');
            $stmt->execute(compact('nama', 'kategori', 'jumlah'));

            http_response_code(201);
            echo json_encode([
                'id' => (int) $pdo->lastInsertId(),
                'nama' => $nama,
                'kategori' => $kategori,
                'jumlah' => $jumlah
            ]);
            break;

        case 'PUT':
        case 'PATCH':
            // Fitur Update dengan Existence Check
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => ['code' => 400, 'message' => 'ID tidak valid']]);
                exit;
            }

            $check = $pdo->prepare('SELECT id FROM alat WHERE id = ?');
            $check->execute([$id]);
            if (!$check->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => ['code' => 404, 'message' => 'Data tidak ditemukan']]);
                exit;
            }

            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $nama = trim((string) ($input['nama'] ?? ''));
            $kategori = trim((string) ($input['kategori'] ?? ''));
            $jumlah = filter_var($input['jumlah'] ?? null, FILTER_VALIDATE_INT);

            if ($nama === '' || $kategori === '' || $jumlah === false || $jumlah < 0) {
                http_response_code(400);
                echo json_encode(['error' => ['code' => 400, 'message' => 'Data pembaruan tidak valid']]);
                exit;
            }

            $stmt = $pdo->prepare('UPDATE alat SET nama = :nama, kategori = :kategori, jumlah = :jumlah WHERE id = :id');
            $stmt->execute(compact('nama', 'kategori', 'jumlah', 'id'));

            echo json_encode(['message' => 'Data berhasil diperbarui']);
            break;

        case 'DELETE':
            // Fitur Delete dengan Existence Check
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => ['code' => 400, 'message' => 'ID tidak valid']]);
                exit;
            }

            $check = $pdo->prepare('SELECT id FROM alat WHERE id = ?');
            $check->execute([$id]);
            if (!$check->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => ['code' => 404, 'message' => 'Data tidak ditemukan']]);
                exit;
            }

            $stmt = $pdo->prepare('DELETE FROM alat WHERE id = ?');
            $stmt->execute([$id]);

            http_response_code(204); // No Content
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => ['code' => 405, 'message' => 'Metode HTTP tidak diizinkan']]);
            break;
    }
} catch (Exception $e) {
    // Response error generik (500) agar detail internal sistem aman
    http_response_code(500);
    echo json_encode(['error' => ['code' => 500, 'message' => 'Terjadi kesalahan pada server']]);
}