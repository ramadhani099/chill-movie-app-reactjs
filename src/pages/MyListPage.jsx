import MovieCard from "../components/MovieCard";
import MovieSkeleton from "../components/MovieSkeleton";
import { useMoviesContext } from "../context/MoviesContext";

export default function MyListPage() {
  const { myListMovies, loading, error, refetch } = useMoviesContext();

  if (loading) return <MovieSkeleton />;

  return (
    <div className="px-4 pt-4 md:px-10 lg:px-24">
      <h1 className="text-2xl font-bold md:text-3xl">Daftar Saya</h1>

      {error ? (
        <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center">
          <p className="text-sm text-red-200">{error}</p>
          <button type="button" onClick={refetch} className="mt-3 rounded-full bg-red-600 px-5 py-2 text-sm font-bold">
            Coba Lagi
          </button>
        </div>
      ) : myListMovies.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-chill-border p-10 text-center">
          <p className="font-bold">Daftar Saya masih kosong.</p>
          <p className="mt-1 text-sm text-chill-muted">
            Tekan poster film lalu pilih tombol “+” untuk menyimpannya di sini.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
          {myListMovies.map((m) => (
            <MovieCard key={m.id} movie={m} fluid />
          ))}
        </div>
      )}
    </div>
  );
}
