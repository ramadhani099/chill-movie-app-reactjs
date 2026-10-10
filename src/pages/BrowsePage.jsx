import { useMemo, useState } from "react";
import Hero from "../components/Hero";
import GenreDropdown from "../components/GenreDropdown";
import MovieRow from "../components/MovieRow";
import MovieSkeleton from "../components/MovieSkeleton";
import { useMoviesContext } from "../context/MoviesContext";
import { CATEGORIES, FALLBACK_CATEGORY } from "../constants/categories";

/**
 * Halaman katalog. type = "all" (Home) | "film" | "series".
 * Dipasang dengan `key` berbeda per route supaya filter genre ter-reset.
 */
export default function BrowsePage({ type = "all" }) {
  const { movies, loading, error, refetch, openAdd } = useMoviesContext();
  const [genre, setGenre] = useState("");

  const typed = useMemo(
    () => movies.filter((m) => type === "all" || (m.type || "film") === type),
    [movies, type]
  );

  // Film unggulan di banner = rating tertinggi
  const heroMovie = useMemo(
    () => [...typed].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))[0],
    [typed]
  );

  const rows = useMemo(() => {
    const g = genre.toLowerCase();
    const filtered = g ? typed.filter((m) => m.genre?.toLowerCase().includes(g)) : typed;
    const known = CATEGORIES.map((c) => ({
      key: c.value,
      title: c.titles[type],
      variant: c.variant,
      items: filtered.filter((m) => m.category === c.value),
    }));
    const knownValues = CATEGORIES.map((c) => c.value);
    const others = {
      key: FALLBACK_CATEGORY.value,
      title: FALLBACK_CATEGORY.label,
      variant: "poster",
      items: filtered.filter((m) => !knownValues.includes(m.category)),
    };
    return [...known, others].filter((r) => r.items.length > 0);
  }, [typed, genre, type]);

  if (loading) return <MovieSkeleton />;

  if (error) {
    return (
      <div className="px-4 py-16 md:px-10 lg:px-24">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center">
          <p className="font-bold text-red-300">Gagal memuat data film</p>
          <p className="mt-1 text-sm text-red-200/80">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-bold hover:bg-red-500"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!heroMovie) {
    return (
      <div className="px-4 py-16 md:px-10 lg:px-24">
        <div className="rounded-2xl border border-dashed border-chill-border p-10 text-center">
          <p className="font-bold">Belum ada {type === "all" ? "film" : type}.</p>
          <p className="mt-1 text-sm text-chill-muted">
            Tambahkan data pertama atau jalankan <code>npm run seed</code>.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className="mt-4 rounded-full bg-chill-accent px-5 py-2 text-sm font-bold hover:bg-chill-accent-light"
          >
            + Tambah film
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero movie={heroMovie}>
        {type !== "all" && <GenreDropdown value={genre} onChange={setGenre} />}
      </Hero>

      <div className="px-4 md:px-10 lg:px-24">
        {rows.length === 0 ? (
          <p className="mt-12 text-center text-chill-muted">
            Tidak ada film dengan genre “{genre}”.
          </p>
        ) : (
          rows.map((row) => (
            <MovieRow key={row.key} title={row.title} movies={row.items} variant={row.variant} />
          ))
        )}
      </div>
    </>
  );
}
