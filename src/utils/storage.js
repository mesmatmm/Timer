export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key)
    return item !== null ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.warn('Failed to load from localStorage:', e)
    return defaultValue
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.warn('Failed to remove from localStorage:', e)
  }
}
