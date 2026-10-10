import { useState } from "react";
import SmartImage from "./SmartImage";
import { useMoviesContext } from "../context/MoviesContext";

/** Banner utama: film unggulan + tombol Mulai / Selengkapnya / usia / suara. */
export default function Hero({ movie, children }) {
  const { openDetail, playMovie } = useMoviesContext();
  const [muted, setMuted] = useState(true);

  return (
    <section className="relative h-[460px] w-full overflow-hidden sm:h-[540px] lg:h-[min(70vh,720px)]">
      <SmartImage
        src={movie.backdrop || movie.poster}
        title={movie.title}
        landscape
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-chill-bg/90 via-chill-bg/35 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-chill-bg via-transparent to-chill-bg/30" />

      {/* Slot kiri-atas, dipakai untuk dropdown Genre */}
      <div className="absolute left-4 top-4 z-20 md:left-10 md:top-6 lg:left-24">{children}</div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-4 pb-8 md:px-10 md:pb-12 lg:px-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{movie.title}</h1>
          {movie.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed md:mt-4 md:text-lg">
              {movie.description}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2 md:mt-6 md:gap-3">
            <button
              type="button"
              onClick={() => playMovie(movie)}
              className="rounded-full bg-chill-accent px-6 py-2.5 text-sm font-bold transition hover:bg-chill-accent-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:px-8 md:py-3.5 md:text-base"
            >
              Mulai
            </button>
            <button
              type="button"
              onClick={() => openDetail(movie)}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/30 px-5 py-2.5 text-sm font-bold backdrop-blur transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:px-6 md:py-3.5 md:text-base"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5M12 8h.01" />
              </svg>
              Selengkapnya
            </button>
            <span className="rounded-full border border-white/40 bg-black/30 px-4 py-2.5 text-sm font-bold md:py-3.5 md:text-base">
              {movie.age || "13+"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
          aria-pressed={!muted}
          className="mb-1 hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-white/50 bg-black/30 transition hover:bg-white/15 sm:grid"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4z" />
            {muted ? <path d="M22 9l-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
          </svg>
        </button>
      </div>
    </section>
  );
}
