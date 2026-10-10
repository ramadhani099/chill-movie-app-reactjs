import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../services/api";

/**
 * Custom hook yang membungkus seluruh state + operasi CRUD film.
 * Komponen UI cukup memanggil hook ini tanpa tahu detail Axios.
 */
export default function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // loading awal / refetch
  const [error, setError] = useState(null); // error saat GET
  const [saving, setSaving] = useState(false); // loading saat ADD / UPDATE / DELETE

  /* ------------------------------- GET -------------------------------- */
  const fetchMovies = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovies({ signal });
      setMovies(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      if (axios.isCancel(err)) return; // komponen di-unmount, abaikan
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchMovies(controller.signal);
    return () => controller.abort(); // batalkan request jika unmount
  }, [fetchMovies]);

  /* ------------------------------- ADD -------------------------------- */
  const createMovie = async (payload) => {
    setSaving(true);
    try {
      const created = await addMovie(payload);
      setMovies((prev) => [created, ...prev]); // tampil paling atas
      return created;
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------ UPDATE ------------------------------ */
  const editMovie = async (id, payload) => {
    setSaving(true);
    try {
      const updated = await updateMovie(id, payload);
      setMovies((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return updated;
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------ DELETE ------------------------------ */
  const removeMovie = async (id) => {
    setSaving(true);
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setSaving(false);
    }
  };

  return {
    movies,
    loading,
    error,
    saving,
    refetch: () => fetchMovies(),
    createMovie,
    editMovie,
    removeMovie,
  };
}
