export function today() {
  let today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}
export function compareDates(date1, date2) {
  let d1 = new Date(date1).setHours(0, 0, 0, 0)
  let d2 = new Date(date2).setHours(0, 0, 0, 0)
  return d1 === d2
}
export function addYears(date, years) {
  date.setFullYear(date.getFullYear() + years)
  return date
}
export function addMonths(date, months) {
  date.setMonth(date.getMonth() + months)
  return date
}
export function addDays(date, days) {
  date.setDate(date.getDate() + days)
  return date
}
export function firstDayOfMonth(month, year) {
  return new Date(year, month, 1)
}
export function lastDayOfMonth(month, year) {
  return addDays(addMonths(firstDayOfMonth(month, year), 1), -1)
}
export function toLocaleDateString(locale, date, options) {
  const dateWithTimezoneOffset = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  return dateWithTimezoneOffset.toLocaleDateString(locale, options)
}
