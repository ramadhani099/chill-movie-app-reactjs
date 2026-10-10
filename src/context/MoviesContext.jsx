import { createContext, useCallback, useContext, useMemo, useState } from "react";
import useMovies from "../hooks/useMovies";
import useMyList from "../hooks/useMyList";
import MovieFormModal from "../components/MovieFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import MovieDetailModal from "../components/MovieDetailModal";
import Toast from "../components/Toast";

const MoviesContext = createContext(null);

/**
 * Satu sumber data untuk semua halaman: daftar film dari API (GET), aksi CRUD,
 * "Daftar Saya", serta modal tambah/edit/hapus/detail dan toast.
 */
export function MoviesProvider({ children }) {
  const { movies, loading, error, saving, refetch, createMovie, editMovie, removeMovie } =
    useMovies();
  const myList = useMyList();

  const [formState, setFormState] = useState({ open: false, movie: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailMovie, setDetailMovie] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((type, message) => setToast({ type, message }), []);
  const closeToast = useCallback(() => setToast(null), []);

  const openAdd = useCallback(() => setFormState({ open: true, movie: null }), []);
  const openEdit = useCallback((movie) => setFormState({ open: true, movie }), []);
  const closeForm = useCallback(() => setFormState({ open: false, movie: null }), []);

  const playMovie = useCallback(
    (movie) => notify("info", `Memutar “${movie.title}” (simulasi, belum ada video)`),
    [notify]
  );

  const toggleList = useCallback(
    (movie) => {
      const adding = !myList.has(movie.id);
      myList.toggle(movie.id);
      notify("success", adding ? "Ditambahkan ke Daftar Saya." : "Dihapus dari Daftar Saya.");
    },
    [myList, notify]
  );

  const handleSubmit = async (payload) => {
    try {
      if (formState.movie) {
        await editMovie(formState.movie.id, payload);
        notify("success", "Film berhasil diperbarui.");
      } else {
        await createMovie(payload);
        notify("success", "Film berhasil ditambahkan.");
      }
      closeForm();
    } catch (err) {
      notify("error", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await removeMovie(deleteTarget.id);
      notify("success", "Film berhasil dihapus.");
      setDeleteTarget(null);
    } catch (err) {
      notify("error", err.message);
    }
  };

  const myListMovies = useMemo(
    () => movies.filter((m) => myList.has(m.id)),
    [movies, myList]
  );

  const value = {
    movies,
    loading,
    error,
    refetch,
    openAdd,
    openEdit,
    askDelete: setDeleteTarget,
    openDetail: setDetailMovie,
    playMovie,
    toggleList,
    isInList: myList.has,
    myListMovies,
  };

  return (
    <MoviesContext.Provider value={value}>
      {children}

      {formState.open && (
        <MovieFormModal
          key={formState.movie?.id ?? "new"}
          movie={formState.movie}
          saving={saving}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          movie={deleteTarget}
          saving={saving}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {detailMovie && (
        <MovieDetailModal
          movie={detailMovie}
          inList={myList.has(detailMovie.id)}
          onPlay={() => {
            playMovie(detailMovie);
            setDetailMovie(null);
          }}
          onToggleList={() => toggleList(detailMovie)}
          onClose={() => setDetailMovie(null)}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </MoviesContext.Provider>
  );
}

export const useMoviesContext = () => useContext(MoviesContext);
