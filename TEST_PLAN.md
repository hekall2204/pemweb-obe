# TEST PLAN

| ID | Kategori | Skenario Uji | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-01 | Authentication | Login valid di `api/login.php` | Status 200 dan dashboard/sesi aktif tampil | Pass — Status `200 OK`, login `viewer` dan `admin` berhasil dengan cookie sesi aktif |
| TC-02 | Authentication | Login dengan password salah | Status 401 dan pesan error generik tampil | Pass — Status `401 Unauthorized`, muncul pesan `"Email atau password salah"` |
| TC-03 | Role (`viewer`) | `viewer` mengirim `POST` ke `api/alat.php` | Status 403 Forbidden (`Akses ditolak`) | Pass — Status `403 Forbidden` (`"Akses ditolak"`), data tidak tersimpan |
| TC-04 | Role (`viewer`) | `viewer` mengirim `DELETE` ke `api/hapus_alat.php` | Status 403 Forbidden (`Akses ditolak`) | Pass — Status `403 Forbidden` (`"Akses ditolak: Anda tidak memiliki hak akses sebagai admin"`) |
| TC-05 | CSRF | `POST` ke `api/alat.php` tanpa CSRF token valid | Status 403 Forbidden dan data tidak tersimpan | Pass — Status `403 Forbidden` (`"CSRF token tidak valid atau kadaluarsa"`), data tidak tersimpan |
| TC-06 | CRUD (Read) | `GET` ke `api/alat.php` dan `api/alat.php?id=1` | Status 200 dan data alat tampil sesuai query | Pass — Status `200 OK`, daftar alat dan detail `id=1` tampil sesuai query |
| TC-07 | CRUD (Create) | `POST` data alat valid dengan CSRF token sah | Data alat baru tersimpan dan tampil pada daftar | Pass — Status `201 Created` (`id: 6`) dengan CSRF token sah, data tersimpan di database |
| TC-08 | Validation | Kirim data alat dengan nama kosong / tidak valid | Status error validasi (422/400) dan pesan jelas | Pass — Status `400 Bad Request`, muncul pesan `"Data alat tidak valid"` |
| TC-09 | CRUD (Delete) | Hapus data alat oleh role berwenang | Data terhapus dari database dan tampilan | Pass — Status `200 OK` (`"Data berhasil dihapus"`), dan `GET ?id=1` menjadi `404 Not Found` |
| TC-10 | XSS / Rendering | Input karakter khusus pada data alat & cek preview | Tampil sebagai plain text (`textContent`), skrip tidak jalan | Pass — Status `201 Created` (`id: 7`), payload XSS tidak mengeksekusi skrip di antarmuka |
| TC-11 | Empty / 404 | `GET` `api/alat.php?id=999999` atau data kosong | Status 404 (`Data tidak ditemukan`) / empty state | Pass — Status `404 Not Found`, muncul pesan `"Data tidak ditemukan"` |
| TC-12 | Error & Responsive | Gagal koneksi DB/API dan cek layar lebar `320px` | Error generik tampil dan layar `320px` tanpa scroll horizontal | Pass — Gagal koneksi DB tampil `500` generik (`"Koneksi basis data gagal"`) dan layar `320px` rapi tanpa scroll horizontal |