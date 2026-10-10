import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useMoviesContext } from "../context/MoviesContext";

const LINKS = [
  { to: "/series", label: "Series" },
  { to: "/film", label: "Film" },
  { to: "/daftar-saya", label: "Daftar Saya" },
];

// Foto profil Google bila ada, jika tidak huruf pertama nama di lingkaran merah
function Avatar({ user, className }) {
  const [broken, setBroken] = useState(false);
  const base = `grid shrink-0 place-items-center overflow-hidden rounded-full bg-red-600 font-bold ${className}`;
  if (user?.picture && !broken) {
    return (
      <img
        src={user.picture}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`${base} object-cover`}
      />
    );
  }
  return <span className={base}>{(user?.name || "?").charAt(0).toUpperCase()}</span>;
}

const linkClass = ({ isActive }) =>
  `transition hover:text-white ${isActive ? "font-bold text-white" : "text-white/90"}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { openAdd } = useMoviesContext();
  const [menuOpen, setMenuOpen] = useState(false); // menu hamburger (mobile)
  const [userOpen, setUserOpen] = useState(false); // dropdown avatar (desktop)
  const userRef = useRef(null);
  const location = useLocation();

  // Tutup menu saat pindah halaman
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  // Tutup dropdown avatar saat klik di luar
  useEffect(() => {
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-chill-bg">
      <div className="flex h-16 items-center justify-between px-4 md:h-24 md:px-10 lg:px-24">
        <div className="flex items-center gap-6 lg:gap-12">
          <Link to="/" aria-label="Chill - Beranda" className="text-white">
            <Logo textClass="text-xl md:text-3xl" />
          </Link>
          <nav className="hidden items-center gap-8 text-base md:flex lg:text-lg" aria-label="Utama">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Desktop: tombol tambah + avatar */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={openAdd}
            className="rounded-full bg-chill-accent px-6 py-3 text-base font-bold transition hover:bg-chill-accent-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            + Tambah film
          </button>

          <div ref={userRef} className="relative">
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userOpen}
              className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Avatar user={user} className="h-12 w-12 text-lg" />
              <span className="text-[10px] text-white/80" aria-hidden="true">
                ▼
              </span>
            </button>
            {userOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-chill-border bg-chill-surface py-1 shadow-xl"
              >
                <p className="truncate px-4 py-2 text-xs text-chill-muted">Masuk sebagai {user.name}</p>
                <button
                  type="button"
                  role="menuitem"
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-sm font-semibold hover:bg-white/10"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="grid h-10 w-10 place-items-center rounded-full border border-chill-border md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-chill-border px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col" aria-label="Menu mobile">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={(s) => `${linkClass(s)} py-3 text-base`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openAdd();
            }}
            className="mt-2 w-full rounded-full bg-chill-accent py-3 text-sm font-bold"
          >
            + Tambah film
          </button>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-chill-surface px-4 py-3">
            <span className="flex items-center gap-3 text-sm">
              <Avatar user={user} className="h-9 w-9" />
              <span className="truncate">{user.name}</span>
            </span>
            <button type="button" onClick={logout} className="text-sm font-bold text-chill-accent-light">
              Keluar
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
