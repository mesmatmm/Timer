export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
}

export function formatStopwatch(ms) {
  const totalCs = Math.floor(ms / 10)
  const cs = totalCs % 100
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

export function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00'
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatAlarmTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function parseHMS(h, m, s) {
  return (parseInt(h || 0) * 3600 + parseInt(m || 0) * 60 + parseInt(s || 0)) * 1000
}

export function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
