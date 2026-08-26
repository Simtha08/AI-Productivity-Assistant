import { useEffect, useState } from "react";

export type StatKey = "emails" | "meetings" | "conversations" | "promotions";

const KEY = "ssb-stats";
const EMPTY: Record<StatKey, number> = {
  emails: 0,
  meetings: 0,
  conversations: 0,
  promotions: 0,
};

function read(): Record<StatKey, number> {
  if (typeof window === "undefined") return EMPTY;
  try {
    return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as object) };
  } catch {
    return EMPTY;
  }
}

export function bumpStat(key: StatKey) {
  if (typeof window === "undefined") return;
  const next = { ...read(), [key]: read()[key] + 1 };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("ssb-stats-change"));
}

export function useStats() {
  const [stats, setStats] = useState(EMPTY);

  useEffect(() => {
    const sync = () => setStats(read());
    sync();
    window.addEventListener("ssb-stats-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ssb-stats-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return stats;
}
