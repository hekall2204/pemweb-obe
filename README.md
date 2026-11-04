# Proyek Individu Semester

Repository ini berisi kode sumber untuk proyek individu semester yang menerapkan struktur HTML5 semantik dan standar aksesibilitas dasar (WCAG).

## Bukti Kelengkapan Tugas 2
1. **Struktur HTML5:** Menggunakan `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<form>`, dan `<footer>`.
2. **Aksesibilitas:** Menyesuaikan atribut `lang`, hirarki heading, `alt` gambar, dan kelengkapan `<label>`.
3. **Workflow Git:** Dikerjakan pada branch `feature/struktur-home` dengan minimal 3 commit terpisah sebelum di-merge ke `main`.

## Lampiran Bukti (Screenshot)
* Tampilan localhost: `![Localhost](path/to/screenshot-localhost.png)`
* Wireframe / Sitemap awal: `![Wireframe](path/to/wireframe.png)`

{
  "name": "Budi Santoso",
  "email": "budi.santoso@gmail.com"
}

# Dokumentasi API - Proyek Pemweb OBE

Berikut adalah daftar endpoint REST API untuk manajemen data alat:

## 1. GET Collection & By ID
- **Method & Path:** `GET /api/alat.php` atau `GET /api/alat.php?id={id}`
- **Tujuan:** Mengambil daftar seluruh alat (mendukung parameter `search` & `page`) atau mengambil detail alat berdasarkan ID.
- **Response Sukses:** `200 OK` (Format JSON)
- **Response Gagal:** `404 Not Found` (Jika data tidak ditemukan)

## 2. POST (Create)
- **Method & Path:** `POST /api/alat.php`
- **Tujuan:** Menambah data alat baru dengan validasi server-side dan prepared statement.
- **Request Body:** JSON (`nama`, `kategori`, `jumlah`)
- **Response Sukses:** `201 Created`
- **Response Gagal:** `400 Bad Request` (Jika data tidak valid)

## 3. PUT / PATCH (Update)
- **Method & Path:** `PUT /api/alat.php?id={id}`
- **Tujuan:** Memperbarui data alat dengan pemeriksaan eksistensi (*existence check*).
- **Response Sukses:** `200 OK`
- **Response Gagal:** `400 Bad Request` / `404 Not Found`

## 4. DELETE
- **Method & Path:** `DELETE /api/alat.php?id={id}`
- **Tujuan:** Menghapus data alat berdasarkan ID.
- **Response Sukses:** `204 No Content`
- **Response Gagal:** `404 Not Found`