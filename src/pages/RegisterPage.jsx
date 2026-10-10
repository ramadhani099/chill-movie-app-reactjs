import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout, { AuthMessage, authInputClass } from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import GoogleButton from "../components/GoogleButton";
import { useAuth } from "../context/AuthContext";

const EMPTY = { username: "", email: "", password: "", confirm: "" };

function validate(f) {
  const errors = {};
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(f.username.trim()))
    errors.username = "Username 3–20 karakter: huruf, angka, atau garis bawah (_).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    errors.email = "Format email tidak valid.";
  if (f.password.length < 6) errors.password = "Kata sandi minimal 6 karakter.";
  if (f.confirm !== f.password) errors.confirm = "Konfirmasi kata sandi tidak sama.";
  return errors;
}

export default function RegisterPage() {
  const { user, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      navigate("/", { replace: true });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Daftar" subtitle="Buat akunmu dan mulai menonton!">
      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="username" className="mb-2 block text-lg font-bold">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Masukkan username"
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            className={authInputClass}
          />
          {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-lg font-bold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={authInputClass}
          />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        <PasswordField
          id="password"
          label="Kata Sandi"
          value={form.password}
          onChange={(e) => handleChange({ target: { name: "password", value: e.target.value } })}
          placeholder="Minimal 6 karakter"
          autoComplete="new-password"
          error={errors.password}
        />

        <PasswordField
          id="confirm"
          label="Konfirmasi Kata Sandi"
          value={form.confirm}
          onChange={(e) => handleChange({ target: { name: "confirm", value: e.target.value } })}
          placeholder="Ulangi kata sandi"
          autoComplete="new-password"
          error={errors.confirm}
        />

        <p className="text-sm text-chill-muted">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold text-white hover:underline">
            Masuk
          </Link>
        </p>

        <AuthMessage message={message} />

        <button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-full bg-chill-accent text-base font-bold transition hover:bg-chill-accent-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Membuat akun..." : "Daftar"}
        </button>
      </form>

      <p className="my-4 text-center text-chill-muted">Atau</p>

      <GoogleButton
        label="Daftar dengan Google"
        onProfile={(profile) => {
          loginWithGoogle(profile);
          navigate("/", { replace: true });
        }}
        onError={(text) => setMessage({ type: "error", text })}
      />
    </AuthLayout>
  );
}
