<?php
// api/index.php
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "status" => "success",
    "message" => "Selamat datang di Backend API Pemweb OBE - Muh. Haikal",
    "endpoints" => [
        "health" => "/pemweb-obe/api/health.php",
        "alats" => "/pemweb-obe/api/alats.php"
    ]
]);