import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

function StatCard({ icon, label, value, color }) {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-white/50 text-sm">{label}</div>
        </div>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

function SessionBar({ session, maxMinutes }) {
  const width = maxMinutes > 0 ? (session.minutes / maxMinutes) * 100 : 0
  const typeColors = {
    countdown: '#6366f1',
    pomodoro: '#ef4444',
    stopwatch: '#10b981',
    alarm: '#f59e0b',
  }
  const color = typeColors[session.type] || '#6366f1'
  const time = new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-white/40 w-12 text-right text-xs">{time}</span>
      <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
        <motion.div
          className="h-full rounded-lg flex items-center px-2"
          style={{ backgroundColor: `${color}60`, width: `${Math.max(width, 5)}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(width, 5)}%` }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white/80 text-xs whitespace-nowrap">
            {session.type} · {session.minutes}m
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { state } = useApp()
  const { stats } = state

  const sessions = stats.sessionHistory || []
  const maxMinutes = sessions.length > 0 ? Math.max(...sessions.map(s => s.minutes), 1) : 1

  const workSessions = sessions.filter(s => s.type === 'countdown' || s.type === 'pomodoro')
  const focusHours = (stats.totalFocusMinutes / 60).toFixed(1)

  // Weekly bar chart data (last 7 days buckets from session history)
  const todayStr = new Date().toDateString()
  const todaySessions = sessions.filter(s => new Date(s.timestamp).toDateString() === todayStr)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Productivity Dashboard</h1>
        <p className="text-white/50">Track your focus sessions and progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="🎯"
          label="Sessions Today"
          value={stats.sessionsToday}
          color="#6366f1"
        />
        <StatCard
          icon="⏰"
          label="Focus Hours"
          value={`${focusHours}h`}
          color="#10b981"
        />
        <StatCard
          icon="🏆"
          label="Longest Session"
          value={`${stats.longestSession}m`}
          color="#f59e0b"
        />
        <StatCard
          icon="🍅"
          label="Pomodoro Cycles"
          value={stats.pomadoroCycles}
          color="#ef4444"
        />
      </div>

      {/* Session history chart */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>📈</span> Session History
          <span className="text-white/40 font-normal text-sm">({sessions.length} total)</span>
        </h2>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🌱</div>
            <p className="text-white/50">No sessions yet. Start a timer to track your progress!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...sessions].reverse().map((session, i) => (
              <SessionBar key={i} session={session} maxMinutes={maxMinutes} />
            ))}
          </div>
        )}
      </div>

      {/* Weekly overview bar chart */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>📅</span> Today's Focus Time by Hour
        </h2>

        {todaySessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/40 text-sm">Complete sessions today to see your focus distribution</p>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourSessions = todaySessions.filter(
                s => new Date(s.timestamp).getHours() === hour
              )
              const totalMinutes = hourSessions.reduce((sum, s) => sum + s.minutes, 0)
              const maxHourMinutes = Math.max(
                ...Array.from({ length: 24 }, (_, h) =>
                  todaySessions.filter(s => new Date(s.timestamp).getHours() === h)
                    .reduce((sum, s) => sum + s.minutes, 0)
                ),
                1
              )
              const height = (totalMinutes / maxHourMinutes) * 100

              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1" title={`${hour}:00 - ${totalMinutes}m`}>
                  <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                    <motion.div
                      className="w-full rounded-sm"
                      style={{
                        height: `${Math.max(height, totalMinutes > 0 ? 10 : 0)}%`,
                        backgroundColor: totalMinutes > 0 ? '#6366f1' : 'rgba(255,255,255,0.05)',
                        minHeight: totalMinutes > 0 ? '4px' : '2px',
                        transformOrigin: 'bottom',
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: hour * 0.02 }}
                    />
                  </div>
                  {hour % 6 === 0 && (
                    <span className="text-white/30 text-[9px]">{hour}h</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Type breakdown */}
      {sessions.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <span>🎨</span> Session Types
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['countdown', 'pomodoro', 'stopwatch', 'alarm'].map(type => {
              const count = sessions.filter(s => s.type === type).length
              const icons = { countdown: '⏳', pomodoro: '🍅', stopwatch: '⏱', alarm: '🔔' }
              const colors = { countdown: '#6366f1', pomodoro: '#ef4444', stopwatch: '#10b981', alarm: '#f59e0b' }
              return (
                <div key={type} className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-2xl mb-1">{icons[type]}</div>
                  <div className="text-white font-bold text-xl">{count}</div>
                  <div className="text-white/40 text-xs capitalize">{type}</div>
                  <div
                    className="mt-2 h-1 rounded-full mx-auto"
                    style={{
                      width: `${sessions.length > 0 ? (count / sessions.length) * 100 : 0}%`,
                      backgroundColor: colors[type],
                      minWidth: count > 0 ? '10%' : '0',
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
