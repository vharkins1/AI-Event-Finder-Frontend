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
  const fromTs = dateFrom ? Date.parse(dateFrom) : NaN;
  const toTs   = dateTo   ? Date.parse(dateTo)   : NaN;
  const today  = startOfTodayTs();

  return (events || []).filter(e => {
    // text
    const hay = `${e?.title||""} ${e?.description||""} ${e?.venue||""}`.toLowerCase();
    if (q && !hay.includes(q)) return false;

    // venue
    if (venue && e?.venue !== venue) return false;

    // date
    const t = Date.parse(e?.date || "");
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
      const p = String(e?.price || "").toLowerCase();
      const looksFree = p === "" || p === "$0" || p.includes("free");
      if (!looksFree) return false;
    }

    // must have image
    if (withImages && !e?.image) return false;

    return true;
  });
}
