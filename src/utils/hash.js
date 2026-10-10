// Hash password (SHA-256 + salt) di browser sebelum dikirim ke API,
// supaya password tidak tersimpan sebagai teks biasa.
// Catatan: ini cukup untuk tugas/demo, BUKAN pengganti autentikasi di server.
export async function hashPassword(password, username) {
  if (!globalThis.crypto?.subtle) {
    throw new Error(
      "Browser ini tidak mendukung enkripsi yang dibutuhkan. Buka lewat localhost atau HTTPS."
    );
  }
  const salt = `chill:${String(username).trim().toLowerCase()}`;
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
