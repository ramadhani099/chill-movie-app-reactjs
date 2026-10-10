import { useEffect } from "react";

const COLORS = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-chill-accent",
};

// Notifikasi singkat: type = "success" | "error" | "info"
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6"
    >
      <div
        className={`flex max-w-md items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
          COLORS[toast.type] || COLORS.info
        }`}
      >
        <span>{toast.message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
