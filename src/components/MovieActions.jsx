import { useMoviesContext } from "../context/MoviesContext";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-4 w-4",
  "aria-hidden": true,
};

function IconButton({ label, onClick, className = "", children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/60 bg-black/50 text-white transition hover:border-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:h-8 md:w-8 ${className}`}
    >
      {children}
    </button>
  );
}

/** Baris tombol aksi pada kartu: putar, daftar saya, edit (PUT), hapus (DELETE). */
export default function MovieActions({ movie }) {
  const { openEdit, askDelete, playMovie, toggleList, isInList } = useMoviesContext();
  const inList = isInList(movie.id);

  return (
    <div className="flex items-center gap-1">
      <IconButton
        label={`Putar ${movie.title}`}
        onClick={() => playMovie(movie)}
        className="!border-white !bg-white !text-black hover:!bg-white/80"
      >
        <svg {...iconProps} fill="currentColor" stroke="none">
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
        </svg>
      </IconButton>

      <IconButton
        label={inList ? "Hapus dari Daftar Saya" : "Tambah ke Daftar Saya"}
        onClick={() => toggleList(movie)}
      >
        {inList ? (
          <svg {...iconProps}>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        ) : (
          <svg {...iconProps}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
      </IconButton>

      <span className="flex-1" />

      <IconButton label={`Edit ${movie.title}`} onClick={() => openEdit(movie)}>
        <svg {...iconProps} className="h-3.5 w-3.5">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      </IconButton>

      <IconButton
        label={`Hapus ${movie.title}`}
        onClick={() => askDelete(movie)}
        className="hover:!border-red-500 hover:!bg-red-600"
      >
        <svg {...iconProps} className="h-3.5 w-3.5">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
        </svg>
      </IconButton>
    </div>
  );
}
