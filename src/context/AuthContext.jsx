import { createContext, useContext, useMemo, useState } from "react";
import { addUser, getUsers } from "../services/api";
import { hashPassword } from "../utils/hash";

/**
 * Autentikasi sisi-klien untuk tugas:
 *  - akun demo admin/123456
 *  - akun buatan sendiri (disimpan di MockAPI, resource `users`, password di-hash)
 *  - masuk dengan Google (profil dari Google, tanpa disimpan ke MockAPI)
 * Sesi disimpan di localStorage.
 */
const KEY = "chill_user";
export const DEMO_ACCOUNT = { username: "admin", password: "123456" };

const AuthContext = createContext(null);

const readSession = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      /* format lama: hanya string username */
    }
    return { username: raw, name: raw, provider: "local" };
  } catch {
    return null;
  }
};

const writeSession = (session) => {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch {
    /* abaikan jika storage diblokir */
  }
};

const same = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const startSession = (session) => {
    writeSession(session);
    setUser(session);
  };

  const value = useMemo(
    () => ({
      user,

      /** Masuk dengan username/email + password. Melempar Error bila gagal. */
      async login(identifier, password) {
        const id = identifier.trim();

        if (same(id, DEMO_ACCOUNT.username) && password === DEMO_ACCOUNT.password) {
          startSession({ username: DEMO_ACCOUNT.username, name: DEMO_ACCOUNT.username, provider: "local" });
          return;
        }

        const users = await getUsers();
        const found = users.find((u) => same(u.username, id) || same(u.email ?? "", id));
        const hash = found ? await hashPassword(password, found.username) : null;

        if (!found || found.passwordHash !== hash) {
          throw new Error("Username/email atau kata sandi salah.");
        }
        startSession({ username: found.username, name: found.username, email: found.email, provider: "local" });
      },

      /** Buat akun baru lalu langsung masuk. Melempar Error bila gagal. */
      async register({ username, email, password }) {
        const users = await getUsers();
        if (users.some((u) => same(u.username, username)) || same(username, DEMO_ACCOUNT.username)) {
          throw new Error("Username sudah dipakai. Pilih username lain.");
        }
        if (users.some((u) => same(u.email ?? "", email))) {
          throw new Error("Email sudah terdaftar. Silakan masuk.");
        }
        const passwordHash = await hashPassword(password, username);
        await addUser({ username: username.trim(), email: email.trim(), passwordHash });
        startSession({ username: username.trim(), name: username.trim(), email: email.trim(), provider: "local" });
      },

      /** Dipanggil setelah Google mengembalikan profil pengguna. */
      loginWithGoogle(profile) {
        startSession({ ...profile, provider: "google" });
      },

      logout() {
        writeSession(null);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
