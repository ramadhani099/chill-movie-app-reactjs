import Logo from "./Logo";

export const authInputClass =
  "h-14 w-full rounded-full border border-chill-border bg-transparent px-6 text-base text-white placeholder:text-gray-400 focus:border-chill-accent-light focus:outline-none focus:ring-1 focus:ring-chill-accent-light";

/** Kerangka halaman Masuk/Daftar: latar biru, kartu di tengah, logo, judul. */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="login-bg grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-[660px] rounded-3xl border border-white/15 bg-black/75 px-6 py-8 shadow-2xl backdrop-blur sm:px-12 sm:py-10">
        <div className="flex justify-center text-white">
          <Logo textClass="text-2xl" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-center text-chill-muted">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}

export function AuthMessage({ message }) {
  if (!message?.text) return null;
  return (
    <p
      role="alert"
      className={`rounded-xl px-4 py-2 text-sm ${
        message.type === "error" ? "bg-red-500/15 text-red-300" : "bg-white/10 text-chill-muted"
      }`}
    >
      {message.text}
    </p>
  );
}
