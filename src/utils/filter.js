// Helper to parse event date strings, supporting YYYY-MM-DD as local midnight
function parseEventDate(value) {
  if (!value) return null;
  // Match YYYY-MM-DD exactly
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (m) {
    const [_, y, mo, d] = m;
    return new Date(Number(y), Number(mo) - 1, Number(d));
  }
  // fallback: parse with Date constructor (handles ISO and other formats)
  return new Date(value);
}

export function uniqueVenues(events) {
  const s = new Set();
  for (const e of events || []) if (e?.venue) s.add(e.venue.trim());
  return [...s].sort((a, b) => a.localeCompare(b));
}

function startOfTodayTs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return +d;
}

export function applyFilters(events, f) {
  const {
    query = "",
    dateFrom = "",
    dateTo = "",
    venue = "",
    freeOnly = false,
    withImages = false,
  } = f || {};

  const q = query.trim().toLowerCase();
  const fromTs = dateFrom ? +parseEventDate(dateFrom) : NaN;
  const toTs   = dateTo   ? +parseEventDate(dateTo)   : NaN;
  const today  = startOfTodayTs();

  return (events || []).filter(e => {
    // text
    const hay = `${e?.title||""} ${e?.description||""} ${e?.venue||""}`.toLowerCase();
    if (q && !hay.includes(q)) return false;

    // venue
    if (venue && e?.venue !== venue) return false;

    // date
    const d = parseEventDate(e?.date || "");
    const t = d ? +d : NaN;
    const hasDate = !isNaN(t);

    // auto-exclude past if no explicit date filter
    if (!dateFrom && !dateTo) {
      if (hasDate && t < today) return false;
      // if no date on event, let it through
    } else {
      // explicit inclusive range
      if (!hasDate) return false;
      if (!isNaN(fromTs) && t < fromTs) return false;
      if (!isNaN(toTs)   && t > (toTs + 24*60*60*1000 - 1)) return false;
    }

    // free only
    if (freeOnly) {
      const p = String(e?.price ?? "").trim().toLowerCase();
      const looksFree = p === "" || p === "$0" || p === "0" || /\bfree\b/.test(p);
      if (!looksFree) return false;
    }

    // must have image
    if (withImages && !(typeof e?.image === "string" && e.image.trim().length)) return false;

    // passed all filters
    return true;
  });
}

export { parseEventDate };