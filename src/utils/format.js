export function formatDateMaybeISO(input) {
  if (!input) return "";
  const d = new Date(input);
  if (!isNaN(d.getTime())) {
    // Show local date if time is present; otherwise just a date
    const hasTime = /T\d{2}:\d{2}/.test(input);
    return d.toLocaleString('en-US', hasTime
      ? { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute:'2-digit' }
      : { month: 'short', day: 'numeric', year: 'numeric' }
    );
  }
  return input; // fallback – already a nice string
}

export function displayPrice(price) {
  if (!price) return "";
  const clean = String(price).trim();
  if (clean === '$0' || clean === '$0–$0') return 'Free';
  return clean;
}
