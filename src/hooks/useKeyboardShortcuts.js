import { useEffect } from 'react'

export function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if typing in an input, textarea, or select
      const tag = e.target.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          handlers.onSpace?.()
          break
        case 'r':
        case 'R':
          handlers.onReset?.()
          break
        case 'n':
        case 'N':
          handlers.onNew?.()
          break
        case '1':
          handlers.onTab?.(0)
          break
        case '2':
          handlers.onTab?.(1)
          break
        case '3':
          handlers.onTab?.(2)
          break
        case '4':
          handlers.onTab?.(3)
          break
        case '5':
          handlers.onTab?.(4)
          break
        case '?':
          handlers.onHelp?.()
          break
        case 'Escape':
          handlers.onEscape?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
