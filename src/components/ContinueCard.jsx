import { useState } from "react";
import SmartImage from "./SmartImage";
import MovieActions from "./MovieActions";

// Progres tonton hanya hiasan visual (belum ada data riwayat tonton di API).
const fakeProgress = (id) => ((Number(String(id).replace(/\D/g, "")) || 1) * 23) % 65 + 25;

/** Kartu landscape (16:9) untuk baris "Melanjutkan Tonton". */
export default function ContinueCard({ movie }) {
  const [open, setOpen] = useState(false);
  const { title, backdrop, poster, rating } = movie;

  return (
    <article className="w-[240px] shrink-0 snap-start sm:w-[280px] md:w-[340px] lg:w-[400px]">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${title}. Tekan untuk menampilkan aksi`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-chill-surface outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <SmartImage
          src={backdrop || poster}
          title={title}
          landscape
          alt={`Cuplikan ${title}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent px-3 pb-3 pt-10">
          <div className="flex items-end justify-between gap-2">
            <h3 className="truncate text-sm font-bold md:text-base">{title}</h3>
            {rating ? (
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold md:text-sm">
                <span className="text-yellow-400">★</span>
                {Number(rating).toFixed(1)}
              </span>
            ) : null}
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/30">
            <div className="h-full rounded-full bg-chill-accent" style={{ width: `${fakeProgress(movie.id)}%` }} />
          </div>
        </div>

        <div
          className={`absolute inset-x-0 top-0 bg-linear-to-b from-black/85 to-transparent p-2 pb-8 transition-opacity md:p-2.5 ${
            open
              ? "opacity-100"
              : "opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          }`}
        >
          <MovieActions movie={movie} />
        </div>
      </div>
    </article>
  );
}
