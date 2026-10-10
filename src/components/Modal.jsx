import { useEffect } from "react";

/**
 * Modal dasar: tutup dengan tombol Esc / klik backdrop, kunci scroll body.
 * Di mobile tampil sebagai bottom-sheet, di desktop sebagai dialog di tengah.
 */
export default function Modal({ title, onClose, children, disableClose = false }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !disableClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, disableClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !disableClose) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-chill-border bg-chill-surface p-5 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={disableClose}
            aria-label="Tutup"
            className="grid h-8 w-8 place-items-center rounded-full text-chill-muted transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
