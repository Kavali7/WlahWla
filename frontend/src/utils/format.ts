const locale = 'fr-FR'

export const defaultCurrency = 'XOF'

export function formatNumber(value: number | string | null | undefined, options: Intl.NumberFormatOptions = {}) {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(numeric)) return String(value)
  return new Intl.NumberFormat(locale, options).format(numeric)
}

export function formatInteger(value: number | string | null | undefined) {
  return formatNumber(value, { maximumFractionDigits: 0 })
}

export function formatCurrency(value: number | string | null | undefined, currency = defaultCurrency) {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(numeric)) return String(value)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numeric)
}

export function formatPercent(value: number | string | null | undefined, digits = 1) {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(numeric)) return String(value)
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(numeric / 100)
}

export function formatCurrencyWithFallback(
  value: number | string | null | undefined,
  fallback: string,
  currency = defaultCurrency,
) {
  const formatted = formatCurrency(value, currency)
  return formatted === '-' ? fallback : formatted
}

export function formatDate(value: string | Date | null | undefined, options: Intl.DateTimeFormatOptions = {}) {
  if (!value) return '-'
  const date = typeof value === 'string' ? new Date(value) : value
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '-'
  }
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    ...options,
  })
  return formatter.format(date)
}
