// Kategori = baris/section di katalog Chill. Nilai `value` disimpan di field
// `category` pada MockAPI. `titles` = judul baris sesuai halaman (Home/Film/Series).
export const CATEGORIES = [
  {
    value: "continue",
    label: "Melanjutkan Tonton",
    variant: "landscape",
    titles: {
      all: "Melanjutkan Tonton",
      film: "Melanjutkan Tonton Film",
      series: "Melanjutkan Tonton Series",
    },
  },
  {
    value: "premiere",
    label: "Persembahan Chill",
    variant: "poster",
    titles: {
      all: "Persembahan Chill",
      film: "Film Persembahan Chill",
      series: "Series Persembahan Chill",
    },
  },
  {
    value: "top-rating",
    label: "Top Rating Hari Ini",
    variant: "poster",
    titles: {
      all: "Top Rating Film dan Series Hari Ini",
      film: "Top Rating Film Hari Ini",
      series: "Top Rating Series Hari Ini",
    },
  },
  {
    value: "trending",
    label: "Trending",
    variant: "poster",
    titles: { all: "Trending", film: "Film Trending", series: "Series Trending" },
  },
  {
    value: "new-release",
    label: "Rilis Baru",
    variant: "poster",
    titles: { all: "Rilis Baru", film: "Rilis Baru", series: "Rilis Baru" },
  },
];

export const FALLBACK_CATEGORY = { value: "other", label: "Lainnya" };

export const MOVIE_TYPES = [
  { value: "film", label: "Film" },
  { value: "series", label: "Series" },
];

export const AGE_RATINGS = ["SU", "13+", "17+", "18+"];
