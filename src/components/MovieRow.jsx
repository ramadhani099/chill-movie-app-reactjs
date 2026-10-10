import { useRef } from "react";
import MovieCard from "./MovieCard";
import ContinueCard from "./ContinueCard";

function Arrow({ dir, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Geser ke kiri" : "Geser ke kanan"}
      className={`absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-xl text-white opacity-0 transition hover:bg-black group-hover/row:opacity-100 focus-visible:opacity-100 md:grid ${
        dir < 0 ? "-left-3 lg:-left-5" : "-right-3 lg:-right-5"
      }`}
    >
      {dir < 0 ? "‹" : "›"}
    </button>
  );
}

/** Satu baris film yang bisa digeser (swipe di mobile, tombol panah di desktop). */
export default function MovieRow({ title, movies, variant = "poster" }) {
  const scroller = useRef(null);

  if (!movies.length) return null;

  const scrollBy = (dir) =>
    scroller.current?.scrollBy({
      left: dir * scroller.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  return (
    <section className="mt-8 md:mt-10">
      <h2 className="mb-3 text-lg font-bold md:mb-4 md:text-2xl">{title}</h2>
      <div className="group/row relative">
        <Arrow dir={-1} onClick={() => scrollBy(-1)} />
        <div
          ref={scroller}
          className="no-scrollbar -mx-4 flex snap-x scroll-pl-4 gap-3 overflow-x-auto px-4 pb-2 md:-mx-10 md:scroll-pl-10 md:gap-4 md:px-10 lg:-mx-24 lg:scroll-pl-24 lg:px-24"
        >
          {movies.map((movie) =>
            variant === "landscape" ? (
              <ContinueCard key={movie.id} movie={movie} />
            ) : (
              <MovieCard key={movie.id} movie={movie} />
            )
          )}
        </div>
        <Arrow dir={1} onClick={() => scrollBy(1)} />
      </div>
    </section>
  );
}
