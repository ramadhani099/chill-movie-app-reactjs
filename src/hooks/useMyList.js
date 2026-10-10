import { useCallback, useEffect, useState } from "react";

const KEY = "chill_my_list";

const read = () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(value) ? value.map(String) : [];
  } catch {
    return [];
  }
};

/** "Daftar Saya": menyimpan id film favorit di localStorage. */
export default function useMyList() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* abaikan jika storage diblokir */
    }
  }, [ids]);

  const toggle = useCallback((id) => {
    const key = String(id);
    setIds((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  }, []);

  const has = useCallback((id) => ids.includes(String(id)), [ids]);

  return { ids, toggle, has };
}
