<?php
// api/health.php

header("Content-Type: application/json; charset=UTF-8");

// Validasi metode: Endpoint health check hanya mengizinkan GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Method Not Allowed"
    ]);
    exit;
}

http_response_code(200);
echo json_encode([
    "status" => "ok"
]);
?>