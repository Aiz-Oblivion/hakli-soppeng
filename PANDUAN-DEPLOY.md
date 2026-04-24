# Panduan Deploy & Setup HAKLI Soppeng ke Netlify

---

## BAGIAN 1 — Persiapan: Upload ke GitHub

### Langkah 1.1 — Buat Akun GitHub
1. Buka https://github.com
2. Klik **Sign up**
3. Isi email, password, username
4. Verifikasi email

### Langkah 1.2 — Buat Repository Baru
1. Setelah login, klik tombol **+** di pojok kanan atas
2. Pilih **New repository**
3. Isi nama repo, contoh: `hakli-soppeng`
4. Pilih **Public**
5. Klik **Create repository**

### Langkah 1.3 — Upload File Website
1. Di halaman repo yang baru dibuat, klik **uploading an existing file**
2. Drag & drop SEMUA file dan folder project ke sana:
   - `index.html`
   - `style.css`
   - `main.js`
   - `components.js`
   - `build-berita.js`
   - `berita.json`
   - `netlify.toml`
   - Folder `admin/`
   - Folder `program/`
   - Folder `_berita/`
3. Scroll ke bawah, klik **Commit changes**

> ✅ File website sudah tersimpan di GitHub

---

## BAGIAN 2 — Deploy ke Netlify

### Langkah 2.1 — Buat Akun Netlify
1. Buka https://netlify.com
2. Klik **Sign up**
3. Pilih **Sign up with GitHub** — lebih mudah karena langsung terhubung
4. Izinkan Netlify mengakses GitHub kamu

### Langkah 2.2 — Hubungkan Repository
1. Setelah login, klik **Add new site**
2. Pilih **Import an existing project**
3. Klik **GitHub**
4. Pilih repository `hakli-soppeng` yang tadi dibuat
5. Pada bagian **Build settings**:
   - **Build command** → ketik: `node build-berita.js`
   - **Publish directory** → ketik: `.` (titik satu, artinya folder utama)
   - **Node version** → biarkan default
6. Klik **Deploy site**

### Langkah 2.3 — Tunggu Deploy Selesai
- Netlify akan memproses sekitar 1-2 menit
- Setelah selesai, kamu dapat URL seperti: `https://random-name-123.netlify.app`
- Klik URL tersebut untuk melihat website

### Langkah 2.4 — Ganti Nama Site (Opsional)
1. Di dashboard Netlify → **Site configuration**
2. Klik **Change site name**
3. Ganti menjadi misalnya `hakli-soppeng`
4. URL menjadi: `https://hakli-soppeng.netlify.app`

> ✅ Website sudah online dan bisa diakses publik

---

## BAGIAN 3 — Setup Login Admin (Netlify Identity)

### Langkah 3.1 — Aktifkan Identity
1. Di dashboard Netlify, klik site kamu
2. Klik tab **Identity** di menu atas
3. Klik tombol **Enable Identity**

### Langkah 3.2 — Set Invite Only
1. Masih di halaman Identity
2. Cari bagian **Registration**
3. Klik **Edit settings**
4. Pilih **Invite only**
5. Klik **Save**

> ⚠️ Penting! Jika tidak di-set Invite Only, siapa saja bisa daftar sebagai admin

### Langkah 3.3 — Aktifkan Git Gateway
1. Scroll ke bawah di halaman Identity
2. Cari bagian **Services**
3. Klik **Enable Git Gateway**
4. Muncul popup izin GitHub → klik **Authorize**

> Git Gateway ini yang menghubungkan panel admin CMS ke repository GitHub

### Langkah 3.4 — Undang Admin
1. Di halaman Identity, klik **Invite users**
2. Masukkan email pengurus HAKLI yang akan jadi admin
3. Klik **Send**
4. Ulangi untuk email lain jika ada lebih dari satu admin

### Langkah 3.5 — Aktivasi Akun Admin
Instruksikan penerima undangan untuk:
1. Cek email → cari email dari Netlify dengan subjek **"You've been invited..."**
2. Klik tombol **Accept the invite**
3. Browser akan membuka halaman website
4. Muncul form → isi password baru
5. Klik **Sign up**

> ✅ Akun admin sudah aktif

---

## BAGIAN 4 — Menggunakan Panel Admin

### Langkah 4.1 — Akses Panel Admin
1. Buka browser
2. Ketik: `https://hakli-soppeng.netlify.app/admin`
3. Muncul halaman login
4. Masukkan email dan password yang sudah dibuat
5. Klik **Login**

### Langkah 4.2 — Tambah Berita Baru
1. Setelah login, klik **Berita & Kegiatan** di sidebar kiri
2. Klik tombol **New Berita & Kegiatan**
3. Isi form:
   - **Judul** — judul berita
   - **Tanggal** — tanggal kegiatan
   - **Kategori** — pilih dari dropdown
   - **Foto** — upload foto (opsional)
   - **Ringkasan** — deskripsi singkat (tampil di homepage)
   - **Isi Berita** — konten lengkap
   - **Berita Utama** — aktifkan jika ingin tampil paling besar
   - **Publikasikan** — aktifkan agar tampil di website
4. Klik **Publish** di pojok kanan atas

### Langkah 4.3 — Tunggu Website Update
- Setelah publish, Netlify otomatis rebuild website
- Proses sekitar 1-2 menit
- Setelah selesai, berita baru langsung tampil di website

### Langkah 4.4 — Edit atau Hapus Berita
1. Di panel admin → klik **Berita & Kegiatan**
2. Klik berita yang ingin diedit
3. Ubah konten yang diinginkan
4. Klik **Publish** untuk simpan perubahan
5. Untuk hapus → klik ikon titik tiga → **Delete**

---

## BAGIAN 5 — Custom Domain (Opsional)

Jika ingin menggunakan domain sendiri seperti `haklisoppeng.id`:

1. Beli domain di penyedia domain (Niagahoster, Domainesia, dll)
2. Di Netlify → **Domain management** → **Add custom domain**
3. Masukkan nama domain
4. Ikuti instruksi untuk update DNS di penyedia domain
5. Netlify otomatis pasang SSL (HTTPS) gratis

---

## RINGKASAN CHECKLIST

- [ ] Buat akun GitHub
- [ ] Upload semua file ke repository GitHub
- [ ] Buat akun Netlify & hubungkan ke GitHub
- [ ] Deploy site
- [ ] Aktifkan Netlify Identity
- [ ] Set Registration ke Invite Only
- [ ] Aktifkan Git Gateway
- [ ] Invite email admin
- [ ] Admin aktivasi akun via email
- [ ] Test login di `/admin`
- [ ] Test tambah berita
- [ ] Ganti nomor WhatsApp di `main.js`
- [ ] Isi link sosial media (Instagram, TikTok, YouTube)

---

*Panduan ini dibuat untuk HAKLI Soppeng — website haklisoppeng.netlify.app*
