import { useEffect, useMemo, useState } from "react";
import EventCard from "./components/EventCard";
import Filters from "./components/Filters";
import { uniqueVenues, applyFilters } from "./utils/filter";

const SOURCES = ["/out/events.json", "/out/manifest.json"];

function useEvents() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      for (const url of SOURCES) {
        try {
          const r = await fetch(url, { cache: "no-store" });
          if (!r.ok) continue;
          const data = await r.json();
          if (Array.isArray(data)) {
            if (alive) setEvents(data);
            return;
          }
        } catch { /* try next */ }
      }
      if (alive) { setEvents([]); setError("No /out/events.json or /out/manifest.json found."); }
    })();
    return () => { alive = false; };
  }, []);

  return { events, error };
}

export default function App() {
  const { events, error } = useEvents();
  const [filter, setFilter] = useState({
    query: "",
    dateFrom: "",
    dateTo: "",
    venue: "",
    freeOnly: false,
    withImages: false,
  });

  const venues = useMemo(() => uniqueVenues(events || []), [events]);

  const sorted = useMemo(() => {
    if (!events) return null;
    // sort by date; undated at end
    return [...events].sort((a, b) => {
      const da = Date.parse(a?.date ?? "") || Infinity;
      const db = Date.parse(b?.date ?? "") || Infinity;
      return da - db;
    });
  }, [events]);

  const shown = useMemo(() => {
    if (!sorted) return null;
    return applyFilters(sorted, filter);
  }, [sorted, filter]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 pt-6">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="h-11 w-11 rounded-2xl shadow-[0_10px_24px_rgba(0,0,0,.35)] ring-1 ring-white/15"
            style={{ background: "conic-gradient(from 210deg,#7aa6ff,#7affc9,#ffef7a,#ff77aa,#7aa6ff)" }}
          />
          <div>
            <h1 className="m-0 text-[22px] font-bold tracking-[.2px]">Event Lobby</h1>
            <p className="m-0 text-xs text-slate-300/85">Filter by date, venue, and more.</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <Filters
        venues={venues}
        state={filter}
        onChange={setFilter}
        onClear={() => setFilter({ query: "", dateFrom: "", dateTo: "", venue: "", freeOnly: false, withImages: false })}
      />

      {/* Grid */}
      <main className="mx-auto my-5 grid max-w-[1180px] grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 px-5">
        {!shown && (
          <div className="col-span-full rounded-2xl bg-white/5 px-4 py-6 text-center text-slate-200 ring-1 ring-white/10">
            Loading events…
          </div>
        )}

        {shown && shown.length === 0 && (
          <div className="col-span-full rounded-2xl bg-white/5 px-4 py-6 text-center text-slate-200 ring-1 ring-white/10">
            {error || "No events match your filters."}
          </div>
        )}

        {shown && shown.length > 0 && shown.map((it, idx) => (
          <EventCard key={idx + (it.link ?? "")} item={it} />
        ))}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-[1180px] px-5 pb-10 pt-1 text-center text-xs text-slate-400">
        Built with Vite • React • Tailwind v4
      </footer>
    </div>
  );
}
