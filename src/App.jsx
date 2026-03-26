import React, { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from './context/ThemeContext'
import { useApp } from './context/AppContext'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useNotifications } from './hooks/useNotifications'
import Navbar from './components/Navbar'
import TimerCard from './components/TimerCard'
import PomodoroCard from './components/PomodoroCard'
import Dashboard from './components/Dashboard'
import ShortcutsModal from './components/ShortcutsModal'
import AddTimerModal from './components/AddTimerModal'
import SoundPicker from './components/SoundPicker'

const tabVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export default function App() {
  const { theme } = useTheme()
  const { state, dispatch } = useApp()
  const { requestPermission } = useNotifications()
  const [activeTab, setActiveTab] = useState(0)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showAddTimer, setShowAddTimer] = useState(false)
  const activeCardRef = useRef(null)

  // Request notification permission on first load
  React.useEffect(() => {
    requestPermission()
  }, [requestPermission])

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  const handlers = {
    onSpace: useCallback(() => {
      // Trigger active card's toggle - we use a custom event
      window.dispatchEvent(new CustomEvent('timer-toggle', { detail: { id: state.activeCardId } }))
    }, [state.activeCardId]),
    onReset: useCallback(() => {
      window.dispatchEvent(new CustomEvent('timer-reset', { detail: { id: state.activeCardId } }))
    }, [state.activeCardId]),
    onNew: useCallback(() => {
      if (activeTab === 0) setShowAddTimer(true)
    }, [activeTab]),
    onTab: useCallback((tab) => {
      setActiveTab(tab)
    }, []),
    onHelp: useCallback(() => {
      setShowShortcuts(true)
    }, []),
    onEscape: useCallback(() => {
      setShowShortcuts(false)
      setShowAddTimer(false)
    }, []),
  }

  useKeyboardShortcuts(handlers)

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen ${isDark ? 'animated-gradient' : 'animated-gradient-light light-mode'}`}>
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onShowShortcuts={() => setShowShortcuts(true)}
      />

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="timers"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {/* Timer Cards Tab */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-white">My Timers</h1>
                    <p className="text-white/50 text-sm mt-0.5">
                      {state.timerCards.length === 0
                        ? 'Add a timer to get started'
                        : `${state.timerCards.length} timer${state.timerCards.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <SoundPicker />
                    <button
                      onClick={() => setShowAddTimer(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/30"
                    >
                      <span className="text-lg">+</span>
                      Add Timer
                      <kbd className="hidden sm:inline text-xs bg-indigo-700/50 px-1.5 py-0.5 rounded font-mono">N</kbd>
                    </button>
                  </div>
                </div>

                {state.timerCards.length === 0 ? (
                  <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-8xl mb-4">⏱</div>
                    <h2 className="text-2xl font-bold text-white mb-3">No timers yet</h2>
                    <p className="text-white/50 mb-6">Create a countdown, stopwatch, or alarm to get started.</p>
                    <button
                      onClick={() => setShowAddTimer(true)}
                      className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30"
                    >
                      Add Your First Timer
                    </button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {state.timerCards.map(card => (
                        <TimerCard key={card.id} card={card} />
                      ))}
                    </AnimatePresence>
                    {/* Add timer card */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setShowAddTimer(true)}
                      className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-white/40 hover:text-white/70 hover:border-white/40 hover:bg-white/10 transition-all min-h-[200px]"
                    >
                      <span className="text-4xl">+</span>
                      <span className="font-medium">Add Timer</span>
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="pomodoro"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <div className="max-w-lg mx-auto">
                  <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-white">Pomodoro Timer</h1>
                    <p className="text-white/50 text-sm mt-0.5">Focus in structured intervals</p>
                  </div>
                  <PomodoroCard />
                  <div className="mt-6 bg-white/5 rounded-2xl p-5 border border-white/10">
                    <h3 className="text-white font-semibold mb-3">How Pomodoro Works</h3>
                    <div className="space-y-2 text-sm text-white/60">
                      <div className="flex items-center gap-3">
                        <span className="text-indigo-400">💼</span>
                        <span>25 min work session</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400">☕</span>
                        <span>5 min short break</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-400">🌟</span>
                        <span>15 min long break (after 4 work sessions)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="dashboard"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <Dashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <AddTimerModal isOpen={showAddTimer} onClose={() => setShowAddTimer(false)} />
    </div>
  )
}
