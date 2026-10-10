import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout, { AuthMessage, authInputClass } from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import GoogleButton from "../components/GoogleButton";
import { DEMO_ACCOUNT, useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (user) return <Navigate to="/" replace />;

  const canSubmit = identifier.trim() !== "" && password !== "" && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await login(identifier, password);
      navigate("/", { replace: true });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Masuk" subtitle="Selamat datang kembali!">
      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="identifier" className="mb-2 block text-lg font-bold">
            Username
          </label>
          <input
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Masukkan username atau email"
            autoComplete="username"
            className={authInputClass}
          />
        </div>

        <PasswordField
          id="password"
          label="Kata Sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan kata sandi"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-chill-muted">
            Belum punya akun?{" "}
            <Link to="/daftar" className="font-bold text-white hover:underline">
              Daftar
            </Link>
          </span>
          <button
            type="button"
            onClick={() =>
              setMessage({ type: "info", text: "Fitur lupa kata sandi belum tersedia di versi demo." })
            }
            className="text-chill-muted hover:text-white"
          >
            Lupa kata sandi?
          </button>
        </div>

        <AuthMessage message={message} />

        <button
          type="submit"
          disabled={!canSubmit}
          className="h-14 w-full rounded-full bg-chill-accent text-base font-bold transition hover:bg-chill-accent-light disabled:cursor-not-allowed disabled:bg-chill-border disabled:text-white/80"
        >
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>

      <p className="my-4 text-center text-chill-muted">Atau</p>

      <GoogleButton
        label="Masuk dengan Google"
        onProfile={(profile) => {
          loginWithGoogle(profile);
          navigate("/", { replace: true });
        }}
        onError={(text) => setMessage({ type: "error", text })}
      />

      <p className="mt-4 text-center text-sm text-chill-muted">
        Akun demo: {DEMO_ACCOUNT.username} / {DEMO_ACCOUNT.password}
      </p>
    </AuthLayout>
  );
}
