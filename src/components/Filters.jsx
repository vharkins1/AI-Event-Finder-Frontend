import { useMemo, useState } from "react";

function rangeToday() {
  const d = new Date(); d.setHours(0,0,0,0);
  const iso = d.toISOString().slice(0,10);
  return { from: iso, to: iso };
}
function rangeNext7() {
  const s = new Date(); s.setHours(0,0,0,0);
  const e = new Date(s); e.setDate(e.getDate()+6);
  return {
    from: s.toISOString().slice(0,10),
    to:   e.toISOString().slice(0,10),
  };
}
function rangeWeekend() {
  const d = new Date(); d.setHours(0,0,0,0);
  const day = d.getDay();               // 0 Sun ... 6 Sat
  const toSat = (6 - day + 7) % 7;      // days until Sat
  const sat = new Date(d); sat.setDate(d.getDate()+toSat);
  const sun = new Date(sat); sun.setDate(sat.getDate()+1);
  return {
    from: sat.toISOString().slice(0,10),
    to:   sun.toISOString().slice(0,10),
  };
}

export default function Filters({ venues, state, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const set = (patch) => onChange({ ...state, ...patch });

  // show a tiny summary when collapsed
  const summary = useMemo(() => {
    const bits = [];
    if (state.query) bits.push(`“${state.query}”`);
    if (state.venue) bits.push(state.venue);
    if (state.dateFrom || state.dateTo) {
      bits.push(`${state.dateFrom || "…"} → ${state.dateTo || "…"}`);
    } else {
      bits.push("Upcoming"); // signals past is auto-hidden
    }
    if (state.freeOnly) bits.push("Free");
    if (state.withImages) bits.push("Images");
    return bits.join(" · ");
  }, [state]);

  return (
    <section className="mx-auto mt-2 mb-3 max-w-[1180px]">
      {/* Collapsed bar */}
      <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10 backdrop-blur-md">
        <button
          type="button"
          onClick={()=>setOpen(v=>!v)}
          className="rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 px-3 py-1.5 text-sm font-semibold text-slate-100 ring-1 ring-white/10"
        >
          {open ? "Hide Filters" : "Filters"}
        </button>

        {/* Quick chips (tiny) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={()=>set({ dateFrom: "", dateTo: "" })}
            className="rounded-full bg-slate-900/60 px-2.5 py-1 text-xs text-slate-200 ring-1 ring-white/10"
            title="Clear date (show upcoming)"
          >
            Anytime
          </button>
          <button
            type="button"
            onClick={()=>set(rangeToday())}
            className="rounded-full bg-slate-900/60 px-2.5 py-1 text-xs text-slate-200 ring-1 ring-white/10"
          >
            Today
          </button>
          <button
            type="button"
            onClick={()=>set(rangeWeekend())}
            className="rounded-full bg-slate-900/60 px-2.5 py-1 text-xs text-slate-200 ring-1 ring-white/10"
          >
            Weekend
          </button>
          <button
            type="button"
            onClick={()=>set(rangeNext7())}
            className="rounded-full bg-slate-900/60 px-2.5 py-1 text-xs text-slate-200 ring-1 ring-white/10"
          >
            Next 7 days
          </button>

          {/* free/images toggles inline and tiny */}
          <label className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-slate-900/60 px-2.5 py-1 text-xs ring-1 ring-white/10">
            <input
              type="checkbox"
              className="accent-slate-200"
              checked={state.freeOnly}
              onChange={(e)=>set({ freeOnly: e.target.checked })}
            />
            <span className="text-slate-200">Free</span>
          </label>
          <label className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/60 px-2.5 py-1 text-xs ring-1 ring-white/10">
            <input
              type="checkbox"
              className="accent-slate-200"
              checked={state.withImages}
              onChange={(e)=>set({ withImages: e.target.checked })}
            />
            <span className="text-slate-200">Images</span>
          </label>
        </div>

        {/* summary text, truncate */}
        <div className="ml-auto hidden min-w-0 flex-1 truncate text-right text-xs text-slate-300/85 md:block">
          {summary}
        </div>
      </div>

      {/* Expanded panel (compact sizing) */}
      {open && (
        <div className="mt-2 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-md">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr,1fr,1fr,1fr]">
            {/* Search */}
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-300/80">Search</span>
              <input
                type="text"
                value={state.query}
                onChange={(e)=>set({ query: e.target.value })}
                placeholder="Title, description, venue…"
                className="rounded-xl bg-slate-900/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-white/20"
              />
            </label>

            {/* Venue */}
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-300/80">Venue</span>
              <select
                value={state.venue}
                onChange={(e)=>set({ venue: e.target.value })}
                className="rounded-xl bg-slate-900/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-white/20"
              >
                <option value="">Any</option>
                {venues.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>

            {/* Date From */}
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-300/80">From</span>
              <input
                type="date"
                value={state.dateFrom}
                onChange={(e)=>set({ dateFrom: e.target.value })}
                className="rounded-xl bg-slate-900/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-white/20"
              />
            </label>

            {/* Date To */}
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-300/80">To</span>
              <input
                type="date"
                value={state.dateTo}
                onChange={(e)=>set({ dateTo: e.target.value })}
                className="rounded-xl bg-slate-900/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/10 outline-none focus:ring-white/20"
              />
            </label>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className="ml-auto rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
