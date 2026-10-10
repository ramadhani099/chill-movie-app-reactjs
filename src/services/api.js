import axios from "axios";

/**
 * Semua pemanggilan API dikumpulkan di file ini.
 * Base URL dibaca dari file .env (VITE_API_BASE_URL), tidak di-hardcode.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  // Peringatan dini di console supaya mudah ketahuan kalau .env belum dibuat
  console.warn(
    "[api] VITE_API_BASE_URL belum diisi. Salin .env.example menjadi .env lalu isi Base URL MockAPI kamu."
  );
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Mengubah error Axios menjadi pesan yang ramah dibaca pengguna.
 * Dilempar ulang sebagai Error biasa supaya komponen cukup pakai err.message.
 */
const handleError = (error) => {
  if (axios.isCancel(error)) throw error; // dibatalkan sengaja (unmount), biarkan lewat

  let message = "Terjadi kesalahan. Silakan coba lagi.";

  if (error.code === "ECONNABORTED") {
    message = "Permintaan terlalu lama (timeout). Periksa koneksi internetmu.";
  } else if (error.response) {
    const { status } = error.response;
    if (status === 404) message = "Data tidak ditemukan di server.";
    else if (status === 429) message = "Terlalu banyak permintaan. Coba lagi sebentar lagi.";
    else if (status >= 500) message = "Server sedang bermasalah. Coba lagi nanti.";
    else message = `Permintaan gagal (kode ${status}).`;
  } else if (error.request) {
    message = "Tidak dapat terhubung ke server. Periksa koneksi atau Base URL API.";
  }

  throw new Error(message);
};

/* ------------------------------ CRUD MOVIES ------------------------------ */

// GET  /movies  -> ambil semua film
export const getMovies = async (config = {}) => {
  try {
    const { data } = await api.get("/movies", config);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

// POST /movies  -> tambah film baru
export const addMovie = async (payload) => {
  try {
    const { data } = await api.post("/movies", payload);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

// PUT  /movies/:id  -> ubah data film
export const updateMovie = async (id, payload) => {
  try {
    const { data } = await api.put(`/movies/${id}`, payload);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

// DELETE /movies/:id  -> hapus film
export const deleteMovie = async (id) => {
  try {
    const { data } = await api.delete(`/movies/${id}`);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

/* ------------------------------ USERS (akun) ------------------------------ */

// GET /users -> semua akun. MockAPI membalas 404 saat resource masih kosong,
// jadi 404 di sini kita anggap "belum ada akun".
export const getUsers = async () => {
  try {
    const { data } = await api.get("/users");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.response?.status === 404) return [];
    return handleError(error);
  }
};

// POST /users -> daftar akun baru
export const addUser = async (payload) => {
  try {
    const { data } = await api.post("/users", payload);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export default api;
