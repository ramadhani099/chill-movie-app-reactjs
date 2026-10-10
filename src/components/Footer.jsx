import Logo from "./Logo";
import { GENRES, HELP_LINKS } from "../constants/genres";

const linkClass = "text-sm text-chill-muted transition hover:text-white";

// Bagi daftar genre menjadi 3 kolom seperti di desain
const columns = (list, n) => {
  const size = Math.ceil(list.length / n);
  return Array.from({ length: n }, (_, i) => list.slice(i * size, (i + 1) * size));
};

function Accordion({ title, children }) {
  return (
    <details className="group border-b border-chill-border py-3 md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold">
        {title}
        <span className="text-xs transition group-open:rotate-180" aria-hidden="true">
          ▼
        </span>
      </summary>
      <div className="mt-3 grid grid-cols-2 gap-2">{children}</div>
    </details>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-chill-border px-4 py-10 md:px-10 lg:px-24">
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <Logo textClass="text-2xl" />
          <p className="mt-4 text-sm text-chill-muted">
            @{new Date().getFullYear()} Chill All Rights Reserved.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden gap-16 md:flex lg:gap-24">
          <div>
            <h3 className="mb-4 text-base font-bold">Genre</h3>
            <div className="flex gap-10 lg:gap-14">
              {columns(GENRES, 3).map((col, i) => (
                <ul key={i} className="space-y-3">
                  {col.map((g) => (
                    <li key={g}>
                      <span className={linkClass}>{g}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-base font-bold">Bantuan</h3>
            <ul className="space-y-3">
              {HELP_LINKS.map((h) => (
                <li key={h}>
                  <span className={linkClass}>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Accordion title="Genre">
            {GENRES.map((g) => (
              <span key={g} className={linkClass}>
                {g}
              </span>
            ))}
          </Accordion>
          <Accordion title="Bantuan">
            {HELP_LINKS.map((h) => (
              <span key={h} className={linkClass}>
                {h}
              </span>
            ))}
          </Accordion>
        </div>
      </div>
    </footer>
  );
}
