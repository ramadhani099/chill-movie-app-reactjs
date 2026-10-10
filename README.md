# Chill – Movie App (React + Tailwind + Axios + MockAPI)

Katalog film bergaya Chill (mengikuti desain Figma) dengan CRUD penuh ke API dinamis (MockAPI.io).

## Fitur

- **Login & Daftar**
  - Daftar akun sendiri (username, email, kata sandi). Akun disimpan di MockAPI (resource `users`), kata sandi di-hash (SHA-256) sebelum dikirim.
  - Masuk dengan username *atau* email, atau **Masuk dengan Google**.
  - Akun demo `admin` / `123456` tetap tersedia.
  - Sesi disimpan di localStorage. Ini autentikasi sisi-klien untuk tugas/demo, bukan pengganti login dengan server sungguhan.
- **Home / Series / Film**: banner film unggulan, baris Melanjutkan Tonton, Persembahan Chill, Top Rating, Trending, Rilis Baru, filter **Genre** (halaman Series & Film).
- **Daftar Saya**: simpan film favorit (localStorage).
- **CRUD ke API**
  - GET: katalog dimuat dari MockAPI
  - ADD: tombol **+ Tambah film** (form modal + validasi)
  - UPDATE: ikon pensil pada kartu (hover di desktop / ketuk di mobile)
  - DELETE: ikon tempat sampah + dialog konfirmasi
- Responsive desktop & mobile (hamburger menu, baris bisa di-swipe, footer accordion).

## Struktur Folder

```
src/
├── App.jsx                 # routing (HashRouter)
├── services/api.js         # Axios: GET, POST, PUT, DELETE
├── hooks/                  # useMovies (CRUD + state), useMyList
├── context/                # AuthContext, MoviesContext (data + modal + toast)
├── constants/              # categories.js, genres.js
├── pages/                  # LoginPage, BrowsePage (Home/Series/Film), MyListPage
├── components/             # Navbar, Hero, MovieRow, MovieCard, ContinueCard,
│                           # MovieFormModal, ConfirmDialog, Footer, ...
└── utils/placeholder.js    # gambar pengganti jika poster kosong/gagal
scripts/seed.mjs            # isi MockAPI dengan data contoh
mock-data/movies.sample.json
```

## Menjalankan

1. **MockAPI.io**: buat resource `movies` dengan field:

   | Field | Tipe |
   | --- | --- |
   | `title`, `category`, `genre`, `poster`, `backdrop`, `description` | String |
   | `type` (`film` / `series`), `age` (`SU`, `13+`, `17+`, `18+`) | String |
   | `year`, `rating`, `episodes` | Number |

2. `cp .env.example .env`, isi `VITE_API_BASE_URL` (contoh `https://abc123.mockapi.io/api/v1`).
3. `npm install`
4. `npm run dev` → buka `http://localhost:5173`.

### Resource `users` (untuk Daftar)

Buat resource kedua di MockAPI bernama **`users`** dengan field (semuanya String):
`username`, `email`, `passwordHash`.

### Login Google

1. Buka Google Cloud Console, buat project (atau pilih yang ada).
2. Atur **OAuth consent screen / Google Auth Platform**: tipe *External*, isi nama aplikasi dan email.
   Selama status *Testing*, hanya email yang didaftarkan di **Test users** yang bisa masuk.
3. Buat **OAuth client ID** dengan tipe **Web application**, lalu isi **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - alamat situs yang sudah di-deploy, mis. `https://ramadhani099.github.io`
   (hanya origin, tanpa path seperti `/movie-app-reactjs/`)
4. Salin **Client ID** (berakhiran `.apps.googleusercontent.com`) ke `.env`:
   `VITE_GOOGLE_CLIENT_ID=...`, lalu restart `npm run dev`.

Client ID bukan rahasia, aman ada di kode front-end. **Jangan** pernah memasukkan *Client secret*.

Nilai `category`: `continue`, `premiere`, `top-rating`, `trending`, `new-release`.
Data lama tanpa `type` dianggap `film`.

## Deploy ke GitHub Pages

`VITE_API_BASE_URL` ikut tertanam saat **build**, jadi harus tersedia saat build
(misal sebagai *repository secret/variable* di GitHub Actions, atau jalankan
`npm run build` lokal dengan `.env` terisi). Router memakai hash (`/#/series`)
dan `base: "./"` sehingga aman di subfolder GitHub Pages.
