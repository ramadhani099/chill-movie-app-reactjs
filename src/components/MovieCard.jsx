import { useState } from "react";
import SmartImage from "./SmartImage";
import MovieActions from "./MovieActions";

const BADGE_BASE = "absolute top-0 rounded-b-md px-2 py-0.5 text-[10px] font-bold md:text-xs";

/**
 * Kartu poster (2:3). Panel aksi muncul saat hover (desktop) atau saat kartu
 * diketuk (mobile/touch).
 */
export default function MovieCard({ movie, fluid = false }) {
  const [open, setOpen] = useState(false);
  const { title, poster, age, episodes, genre, year, category, type } = movie;

  const isSeries = type === "series";
  const isNew = category === "new-release" || category === "premiere";
  const meta = isSeries && episodes ? `${episodes} Episode` : year;

  return (
    <article
      className={`shrink-0 snap-start ${
        fluid ? "w-full" : "w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px]"
      }`}
    >
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
        className="group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-lg bg-chill-surface outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <SmartImage
          src={poster}
          title={title}
          alt={`Poster ${title}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {isNew && (
          <span className={`${BADGE_BASE} left-2 bg-yellow-400 text-black`}>
            {isSeries ? "Episode Baru" : "Baru"}
          </span>
        )}
        {category === "top-rating" && (
          <span className={`${BADGE_BASE} right-2 bg-red-600 text-white`}>Top 10</span>
        )}

        <div
          className={`absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/85 to-transparent p-1.5 pt-12 transition-opacity md:p-2.5 md:pt-16 ${
            open
              ? "opacity-100"
              : "opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
          }`}
        >
          <MovieActions movie={movie} />
          <p className="mt-2 truncate text-xs font-bold md:text-sm">{title}</p>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-[10px] text-chill-muted md:text-xs">
            {age && (
              <span className="rounded border border-chill-muted/60 px-1 leading-4">{age}</span>
            )}
            <span className="truncate">{[meta, genre].filter(Boolean).join(" • ")}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
