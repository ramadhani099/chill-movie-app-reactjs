import Modal from "./Modal";
import SmartImage from "./SmartImage";

/** Detail film (tombol "Selengkapnya" pada banner). */
export default function MovieDetailModal({ movie, inList, onPlay, onToggleList, onClose }) {
  const meta = [
    movie.type === "series" ? "Series" : "Film",
    movie.year,
    movie.type === "series" && movie.episodes ? `${movie.episodes} Episode` : null,
    movie.genre,
  ].filter(Boolean);

  return (
    <Modal title={movie.title} onClose={onClose}>
      <SmartImage
        src={movie.backdrop || movie.poster}
        title={movie.title}
        landscape
        alt={`Cuplikan ${movie.title}`}
        className="aspect-video w-full rounded-xl object-cover"
      />
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-chill-muted">
        {movie.age && (
          <span className="rounded border border-chill-muted/60 px-1.5 text-xs">{movie.age}</span>
        )}
        {movie.rating ? (
          <span>
            <span className="text-yellow-400">★</span> {Number(movie.rating).toFixed(1)}
          </span>
        ) : null}
        <span>{meta.join(" • ")}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed">
        {movie.description || "Belum ada deskripsi untuk film ini."}
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onPlay}
          className="rounded-full bg-chill-accent px-6 py-2.5 text-sm font-bold hover:bg-chill-accent-light"
        >
          Mulai
        </button>
        <button
          type="button"
          onClick={onToggleList}
          className="rounded-full border border-chill-border px-6 py-2.5 text-sm font-bold hover:bg-white/10"
        >
          {inList ? "✓ Ada di Daftar Saya" : "+ Daftar Saya"}
        </button>
      </div>
    </Modal>
  );
}
