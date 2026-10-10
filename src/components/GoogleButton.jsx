import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

// Client ID dari Google Cloud Console (aman dipublikasikan, bukan rahasia)
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function ButtonUI({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-chill-border text-base font-bold transition hover:bg-white/10"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-10.7-3.78H1.34v3.1A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.36 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.34a12 12 0 0 0 0 10.8l4.02-3.1z" />
        <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.34 6.6l4.02 3.1A7.2 7.2 0 0 1 12 4.75z" />
      </svg>
      {label}
    </button>
  );
}

// Dipakai hanya bila Client ID tersedia (hook butuh GoogleOAuthProvider)
function ConnectedButton({ label, onProfile, onError }) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error("userinfo");
        const p = await res.json();
        onProfile({
          username: p.email,
          name: p.name || p.email,
          email: p.email,
          picture: p.picture,
        });
      } catch {
        onError("Gagal mengambil profil dari Google. Coba lagi.");
      }
    },
    onError: () => onError("Masuk dengan Google gagal. Coba lagi."),
    onNonOAuthError: (e) =>
      onError(
        e?.type === "popup_closed"
          ? "Jendela Google ditutup sebelum selesai."
          : "Popup Google diblokir browser. Izinkan popup untuk situs ini lalu coba lagi."
      ),
  });

  return <ButtonUI label={label} onClick={() => login()} />;
}

/** Tombol "Masuk/Daftar dengan Google". onProfile({username,name,email,picture}). */
export default function GoogleButton({ label, onProfile, onError }) {
  if (!CLIENT_ID) {
    return (
      <ButtonUI
        label={label}
        onClick={() =>
          onError("Login Google belum diatur. Isi VITE_GOOGLE_CLIENT_ID di file .env (lihat README), lalu restart.")
        }
      />
    );
  }
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <ConnectedButton label={label} onProfile={onProfile} onError={onError} />
    </GoogleOAuthProvider>
  );
}
