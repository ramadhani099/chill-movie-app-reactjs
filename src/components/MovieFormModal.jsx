import { useState } from "react";
import Modal from "./Modal";
import { AGE_RATINGS, CATEGORIES, MOVIE_TYPES } from "../constants/categories";
import { GENRES } from "../constants/genres";

const EMPTY_FORM = {
  title: "",
  type: "film",
  category: CATEGORIES[1].value,
  genre: "",
  year: "",
  rating: "",
  age: "13+",
  episodes: "",
  poster: "",
  backdrop: "",
  description: "",
};

const inputClass =
  "w-full rounded-lg border border-chill-border bg-chill-bg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-chill-accent-light focus:outline-none focus:ring-1 focus:ring-chill-accent-light";

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-chill-muted">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

const isHttpUrl = (value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Judul wajib diisi.";
  if (!form.genre.trim()) errors.genre = "Genre wajib diisi.";

  const year = Number(form.year);
  if (!form.year || !Number.isInteger(year) || year < 1900 || year > 2100)
    errors.year = "Tahun tidak valid (1900–2100).";

  if (form.rating !== "") {
    const rating = Number(form.rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 5)
      errors.rating = "Rating harus antara 0 dan 5.";
  }

  if (form.type === "series" && form.episodes !== "") {
    const eps = Number(form.episodes);
    if (!Number.isInteger(eps) || eps < 1) errors.episodes = "Jumlah episode minimal 1.";
  }

  if (form.poster.trim() && !isHttpUrl(form.poster.trim()))
    errors.poster = "URL poster tidak valid (harus diawali http/https).";
  if (form.backdrop.trim() && !isHttpUrl(form.backdrop.trim()))
    errors.backdrop = "URL backdrop tidak valid (harus diawali http/https).";

  return errors;
}

/**
 * Form untuk ADD (movie = null) dan UPDATE (movie = objek film).
 * Parent memberi `key` berbeda agar state form ter-reset saat berganti data.
 */
export default function MovieFormModal({ movie, saving, onSubmit, onClose }) {
  const isEdit = Boolean(movie);

  const [form, setForm] = useState(
    isEdit
      ? {
          ...EMPTY_FORM,
          ...movie,
          type: movie.type || "film",
          age: movie.age || "13+",
          year: movie.year ?? "",
          rating: movie.rating ?? "",
          episodes: movie.episodes || "",
          poster: movie.poster || "",
          backdrop: movie.backdrop || "",
          description: movie.description || "",
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    // Rapikan tipe data sebelum dikirim ke API
    onSubmit({
      title: form.title.trim(),
      type: form.type,
      category: form.category,
      genre: form.genre.trim(),
      year: Number(form.year),
      rating: form.rating === "" ? 0 : Number(form.rating),
      age: form.age,
      episodes: form.type === "series" && form.episodes !== "" ? Number(form.episodes) : 0,
      poster: form.poster.trim(),
      backdrop: form.backdrop.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <Modal title={isEdit ? "Edit Film" : "Tambah Film Baru"} onClose={onClose} disableClose={saving}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Judul *" error={errors.title}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Contoh: Duty After School"
            className={inputClass}
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tipe">
            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
              {MOVIE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Kategori / baris">
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="col-span-2">
            <Field label="Genre *" error={errors.genre}>
              <input
                name="genre"
                list="genre-options"
                value={form.genre}
                onChange={handleChange}
                placeholder="Drama"
                className={inputClass}
              />
              <datalist id="genre-options">
                {GENRES.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </Field>
          </div>
          <Field label="Tahun *" error={errors.year}>
            <input
              name="year"
              type="number"
              inputMode="numeric"
              value={form.year}
              onChange={handleChange}
              placeholder="2025"
              className={inputClass}
            />
          </Field>
          <Field label="Rating (0–5)" error={errors.rating}>
            <input
              name="rating"
              type="number"
              step="0.1"
              inputMode="decimal"
              value={form.rating}
              onChange={handleChange}
              placeholder="4.5"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Batas usia">
            <select name="age" value={form.age} onChange={handleChange} className={inputClass}>
              {AGE_RATINGS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
          {form.type === "series" && (
            <Field label="Jumlah episode" error={errors.episodes}>
              <input
                name="episodes"
                type="number"
                inputMode="numeric"
                value={form.episodes}
                onChange={handleChange}
                placeholder="12"
                className={inputClass}
              />
            </Field>
          )}
        </div>

        <Field label="URL Poster (tegak)" error={errors.poster}>
          <input
            name="poster"
            value={form.poster}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>

        <Field
          label="URL Backdrop (lebar, untuk banner)"
          error={errors.backdrop}
          hint="Opsional. Jika kosong, banner memakai poster."
        >
          <input
            name="backdrop"
            value={form.backdrop}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>

        <Field label="Deskripsi">
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Sinopsis singkat film"
            className={inputClass}
          />
        </Field>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-chill-border px-5 py-2 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-chill-accent px-5 py-2 text-sm font-semibold transition hover:bg-chill-accent-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Film"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
