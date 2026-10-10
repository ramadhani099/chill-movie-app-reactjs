import Modal from "./Modal";

export default function ConfirmDialog({ movie, saving, onConfirm, onClose }) {
  return (
    <Modal title="Hapus Film?" onClose={onClose} disableClose={saving}>
      <p className="text-sm text-chill-muted">
        Film <span className="font-semibold text-white">“{movie.title}”</span>{" "}
        akan dihapus permanen dari daftar. Tindakan ini tidak dapat dibatalkan.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="rounded-full border border-chill-border px-5 py-2 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={saving}
          className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
    </Modal>
  );
}
