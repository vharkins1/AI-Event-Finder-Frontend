import { useMemo, useState } from "react";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (!isNaN(d)) {
    const hasTime = /T\d{2}:\d{2}/.test(String(value));
    return d.toLocaleString([], hasTime
      ? { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric", year: "numeric" }
    );
  }
  return value;
}
function cleanedPrice(p) {
  if (!p) return "";
  const s = String(p).trim();
  if (s === "$0" || /free/i.test(s)) return "Free";
  return s;
}

export default function EventCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const {
    title = "Untitled Event",
    date = "",
    venue = "",
    link = "#",
    image = "",
    description = "",
    price = "",
  } = item || {};

  const badge = useMemo(() => {
    if (venue) return venue;
    try { return new URL(link).hostname.replace(/^www\./, ""); } catch { return "event"; }
  }, [venue, link]);

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,.45)] transition-transform hover:-translate-y-0.5"
    >
      {/* Artwork */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e)=>{ e.currentTarget.style.display="none"; }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
        <div className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-slate-100 ring-1 ring-white/10 backdrop-blur">
          {badge}
        </div>
      </div>

      {/* Body becomes a flex column that grows */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
        <h3 className="text-[15px] font-semibold tracking-[.2px] clamp-2">{title}</h3>

        <div className="flex flex-wrap gap-2 text-[12px] text-slate-300">
          {date && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 px-2.5 py-1 ring-1 ring-white/10">
              <span>📅</span><span>{formatDate(date)}</span>
            </span>
          )}
          {venue && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 px-2.5 py-1 ring-1 ring-white/10">
              <span>📍</span><span>{venue}</span>
            </span>
          )}
          {cleanedPrice(price) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 px-2.5 py-1 ring-1 ring-white/10">
              <span>💰</span><span>{cleanedPrice(price)}</span>
            </span>
          )}
        </div>

        {description && (
          <p className={`text-[13px] leading-snug text-slate-200 ${expanded ? "" : "clamp-3"}`}>
            {description}
          </p>
        )}

        {/* Spacer pushes footer down for short descriptions */}
        <div className="flex-1" />

        {/* Footer always at bottom */}
        <div className="mt-1 flex gap-2">
          <a
            href={link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 px-3 py-2 text-center text-[13px] font-semibold text-slate-100 ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
          >
            Open Event
          </a>
          {description && (
            <button
              onClick={()=>setExpanded(v=>!v)}
              className="rounded-xl bg-slate-900/60 px-3 py-2 text-[13px] font-semibold text-slate-100 ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
              type="button"
            >
              {expanded ? "Hide" : "Details"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
