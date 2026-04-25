# Panduan Deploy HAKLI Soppeng ke Cloudflare Pages

---

## BAGIAN 1 — Deploy ke Cloudflare Pages

### Langkah 1.1 — Buat Akun Cloudflare
1. Buka https://dash.cloudflare.com
2. Klik **Sign up**
3. Isi email dan password
4. Verifikasi email

### Langkah 1.2 — Buat Project Pages
1. Setelah login, klik **Workers & Pages** di sidebar kiri
2. Klik tab **Pages**
3. Klik **Create a project**
4. Pilih **Connect to Git**
5. Klik **Connect GitHub** → izinkan akses
6. Pilih repository `hakli-soppeng`
7. Klik **Begin setup**

### Langkah 1.3 — Konfigurasi Build
1. Pada bagian **Build settings**:
   - **Framework preset** → None
   - **Build command** → `node build-berita.js`
   - **Build output directory** → `/` (atau kosongkan)
2. Klik **Save and Deploy**

### Langkah 1.4 — Tunggu Deploy
- Proses sekitar 1-2 menit
- URL akan seperti: `https://hakli-soppeng.pages.dev`

> ✅ Website sudah online

---

## BAGIAN 2 — Setup GitHub OAuth untuk Admin CMS

Sveltia CMS login menggunakan GitHub OAuth — lebih aman dan tidak butuh Git Gateway.

### Langkah 2.1 — Buat GitHub OAuth App
1. Buka https://github.com/settings/developers
2. Klik **OAuth Apps** → **New OAuth App**
3. Isi form:
   - **Application name** → `HAKLI Soppeng CMS`
   - **Homepage URL** → `https://hakli-soppeng.pages.dev`
   - **Authorization callback URL** → `https://sveltia-cms-auth.NAMA.workers.dev/callback`
   (NAMA akan diisi setelah setup Worker di langkah berikutnya — sementara isi dulu dengan placeholder)
4. Klik **Register application**
5. Catat **Client ID** dan klik **Generate a new client secret** → catat **Client Secret**

### Langkah 2.2 — Deploy Sveltia CMS Auth Worker
1. Buka https://dash.cloudflare.com
2. Klik **Workers & Pages** → **Create**
3. Klik **Create Worker**
4. Beri nama: `sveltia-cms-auth`
5. Klik **Deploy**
6. Klik **Edit code**
7. Hapus semua kode yang ada
8. Buka https://github.com/sveltia/sveltia-cms-auth
9. Copy isi file `src/index.js` dari repo tersebut
10. Paste ke editor Cloudflare Worker
11. Klik **Deploy**

### Langkah 2.3 — Tambah Environment Variables di Worker
1. Di halaman Worker `sveltia-cms-auth`
2. Klik **Settings** → **Variables**
3. Tambah variabel:
   - `GITHUB_CLIENT_ID` → isi dengan Client ID dari langkah 2.1
   - `GITHUB_CLIENT_SECRET` → isi dengan Client Secret dari langkah 2.1
4. Klik **Save**

### Langkah 2.4 — Update Callback URL di GitHub
1. Kembali ke GitHub → Settings → Developer settings → OAuth Apps
2. Klik app `HAKLI Soppeng CMS`
3. Update **Authorization callback URL** dengan URL worker yang sebenarnya:
   `https://sveltia-cms-auth.NAMA_AKUN.workers.dev/callback`
4. Klik **Update application**

### Langkah 2.5 — Update admin/config.yml
1. Buka file `admin/config.yml` di GitHub
2. Ganti dua baris ini:
   ```yaml
   repo: NAMA_GITHUB/hakli-soppeng
   base_url: https://sveltia-cms-auth.NAMA_WORKER.workers.dev
   ```
   Dengan data yang sebenarnya, contoh:
   ```yaml
   repo: Aiz-Oblivion/hakli-soppeng
   base_url: https://sveltia-cms-auth.aiz-oblivion.workers.dev
   ```
3. Commit → Cloudflare Pages auto rebuild

---

## BAGIAN 3 — Akses Panel Admin

1. Buka `https://hakli-soppeng.pages.dev/admin`
2. Klik **Login with GitHub**
3. Izinkan akses → masuk ke panel CMS
4. Tambah berita seperti biasa

---

## RINGKASAN KEUNGGULAN CLOUDFLARE PAGES vs NETLIFY

| Fitur | Cloudflare Pages | Netlify (Gratis) |
|-------|-----------------|-----------------|
| Build minutes | **Unlimited** | 300/bulan |
| Bandwidth | **Unlimited** | 100 GB/bulan |
| Deploy | Otomatis | Otomatis |
| Custom domain | Gratis | Gratis |
| SSL | Gratis | Gratis |
| Harga | **Gratis** | Gratis (terbatas) |

---

*Panduan ini dibuat untuk HAKLI Soppeng*
