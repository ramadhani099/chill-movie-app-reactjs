import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MoviesProvider } from "../context/MoviesContext";
import { useAuth } from "../context/AuthContext";

function Shell() {
  const { pathname } = useLocation();

  // Kembali ke atas setiap pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-chill-bg">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/** Semua halaman di dalamnya wajib login; data film dimuat sekali di MoviesProvider. */
export default function AppLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <MoviesProvider>
      <Shell />
    </MoviesProvider>
  );
}
