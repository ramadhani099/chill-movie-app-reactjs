import { useEffect, useRef, useState } from "react";
import { GENRES } from "../constants/genres";

/** Dropdown "Genre" di kiri-atas banner; memfilter baris film berdasarkan genre. */
export default function GenreDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const choose = (genre) => {
    onChange(genre);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-black/50 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:text-base"
      >
        {value || "Genre"}
        <span className="text-[10px]" aria-hidden="true">
          ▼
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 mt-2 grid w-[min(86vw,320px)] grid-cols-2 gap-x-4 gap-y-1 rounded-lg border border-chill-border bg-chill-bg/95 p-3 text-sm shadow-xl backdrop-blur"
        >
          <li className="col-span-2">
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => choose("")}
              className={`w-full rounded px-2 py-1.5 text-left hover:bg-white/10 ${!value ? "font-bold text-chill-accent-light" : ""}`}
            >
              Semua genre
            </button>
          </li>
          {GENRES.map((g) => (
            <li key={g}>
              <button
                type="button"
                role="option"
                aria-selected={value === g}
                onClick={() => choose(g)}
                className={`w-full rounded px-2 py-1.5 text-left hover:bg-white/10 ${value === g ? "font-bold text-chill-accent-light" : "text-chill-muted"}`}
              >
                {g}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
