import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BrowsePage from "./pages/BrowsePage";
import MyListPage from "./pages/MyListPage";

// HashRouter: URL berbentuk /#/series sehingga aman di-host di GitHub Pages
export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/daftar" element={<RegisterPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<BrowsePage key="all" type="all" />} />
            <Route path="series" element={<BrowsePage key="series" type="series" />} />
            <Route path="film" element={<BrowsePage key="film" type="film" />} />
            <Route path="daftar-saya" element={<MyListPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
