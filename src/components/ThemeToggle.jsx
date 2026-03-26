import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
      style={{ backgroundColor: isDark ? '#4f46e5' : '#e2e8f0' }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <motion.div
        className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
        style={{ backgroundColor: isDark ? '#fff' : '#1a1a2e' }}
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </button>
  )
}
