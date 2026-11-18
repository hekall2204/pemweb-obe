<?php
// api/auth.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function requireLogin(): void {
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Silakan login']);
        exit;
    }
}

function requireRole(array $roles): void {
    requireLogin();
    
    $userRole = $_SESSION['role'] ?? '';
    if (!in_array($userRole, $roles, true)) {
        http_response_code(403);
        echo json_encode(['error' => 'Akses ditolak']);
        exit;
    }
}