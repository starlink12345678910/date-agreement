/** Format an ISO date string ("YYYY-MM-DD") into a localised, readable date. */
export function formatDate(iso, locale = 'ru-RU') {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const dt = new Date(y, m - 1, d) // local date, no TZ shift
  try {
    return dt.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

/** Replace {her} / {him} placeholders in a template string. */
export function fill(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`))
}
