import { useEffect, useMemo, useState } from "react";
import { placeholderImage } from "../utils/placeholder";

/** <img> yang otomatis memakai gambar pengganti bila src kosong / gagal dimuat. */
export default function SmartImage({ src, title, landscape = false, className = "", alt = "" }) {
  const fallback = useMemo(
    () => placeholderImage(title, landscape ? 640 : 400, landscape ? 360 : 600),
    [title, landscape]
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <img
      src={!src || failed ? fallback : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
