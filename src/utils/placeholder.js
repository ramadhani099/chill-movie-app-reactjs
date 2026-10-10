// Gambar pengganti (SVG data URI) bila URL poster/backdrop kosong atau gagal dimuat.
// Judul film ikut digambar supaya kartu tetap bisa dikenali.
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const hueOf = (str) => {
  let h = 0;
  for (const ch of String(str)) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
};

const wrapText = (text, max) => {
  const lines = [];
  let line = "";
  for (const word of String(text).split(/\s+/)) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
};

export function placeholderImage(title = "Chill", width = 400, height = 600) {
  const landscape = width > height;
  const hue = hueOf(title);
  const lines = wrapText(title, landscape ? 26 : 13).slice(0, 4);
  const size = landscape ? 40 : 38;
  const startY = height / 2 - ((lines.length - 1) * size * 1.2) / 2;
  const text = lines
    .map(
      (l, i) =>
        `<text x="${width / 2}" y="${startY + i * size * 1.2}" fill="#fff" font-family="Lato,Arial,sans-serif" font-weight="800" font-size="${size}" text-anchor="middle">${esc(l)}</text>`
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},45%,30%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360},50%,10%)"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>${text}</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
