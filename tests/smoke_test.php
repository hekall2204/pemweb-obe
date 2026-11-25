<?php

$requiredFiles = [
    'index.html',
    'styles.css',
    'js/app.js',
    'api/get_token.php',
];

foreach ($requiredFiles as $file) {
    if (!file_exists($file)) {
        fwrite(STDERR, "Gagal: berkas {$file} tidak ditemukan.\n");
        exit(1);
    }
}

$tokenScript = file_get_contents('api/get_token.php');
if ($tokenScript === false || trim($tokenScript) === '') {
    fwrite(STDERR, "Gagal: api/get_token.php kosong atau tidak terbaca.\n");
    exit(1);
}

echo "Semua test sederhana lolos.\n";
exit(0);