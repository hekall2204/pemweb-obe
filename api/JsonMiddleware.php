<?php

namespace App\Middleware;

class JsonMiddleware
{
    /**
     * Memastikan request yang masuk menggunakan Content-Type application/json.
     */
    public function handle()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        
        // Middleware dijalankan untuk metode yang mengirimkan payload data
        if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
            $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

            // Jika bukan application/json, tolak request secara dini (HTTP 415)
            if (stripos($contentType, 'application/json') === false) {
                http_response_code(415);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unsupported Media Type: Content-Type harus bernilai application/json'
                ]);
                exit();
            }
        }
    }
}