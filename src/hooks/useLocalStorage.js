import { useState, useEffect } from 'react'
import { saveToStorage, loadFromStorage } from '../utils/storage'

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => loadFromStorage(key, defaultValue))

  useEffect(() => {
    saveToStorage(key, value)
  }, [key, value])

  return [value, setValue]
}
