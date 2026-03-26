import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { saveToStorage, loadFromStorage } from '../utils/storage'
import { getTodayKey } from '../utils/timeUtils'

const AppContext = createContext(null)

const initialState = {
  timerCards: [],
  soundPreference: 'chime',
  stats: {
    date: getTodayKey(),
    sessionsToday: 0,
    totalFocusMinutes: 0,
    longestSession: 0,
    pomadoroCycles: 0,
    sessionHistory: [],
  },
  activeCardId: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_CARD': {
      const newCard = {
        id: Date.now().toString(),
        type: action.payload.type,
        name: action.payload.name || getDefaultName(action.payload.type),
        createdAt: Date.now(),
      }
      return { ...state, timerCards: [...state.timerCards, newCard], activeCardId: newCard.id }
    }
    case 'REMOVE_CARD': {
      const filtered = state.timerCards.filter(c => c.id !== action.payload.id)
      return {
        ...state,
        timerCards: filtered,
        activeCardId: state.activeCardId === action.payload.id
          ? (filtered.length > 0 ? filtered[filtered.length - 1].id : null)
          : state.activeCardId
      }
    }
    case 'SET_ACTIVE_CARD':
      return { ...state, activeCardId: action.payload.id }
    case 'SET_SOUND':
      return { ...state, soundPreference: action.payload.sound }
    case 'UPDATE_CARD_NAME': {
      return {
        ...state,
        timerCards: state.timerCards.map(c =>
          c.id === action.payload.id ? { ...c, name: action.payload.name } : c
        )
      }
    }
    case 'COMPLETE_SESSION': {
      const today = getTodayKey()
      const prevStats = state.stats.date === today ? state.stats : {
        ...initialState.stats,
        date: today,
        pomadoroCycles: state.stats.pomadoroCycles,
      }
      const minutes = action.payload.minutes || 0
      const newSession = {
        type: action.payload.sessionType || 'countdown',
        minutes,
        timestamp: Date.now(),
      }
      return {
        ...state,
        stats: {
          ...prevStats,
          sessionsToday: prevStats.sessionsToday + 1,
          totalFocusMinutes: prevStats.totalFocusMinutes + minutes,
          longestSession: Math.max(prevStats.longestSession, minutes),
          sessionHistory: [...(prevStats.sessionHistory || []).slice(-29), newSession],
        }
      }
    }
    case 'COMPLETE_POMODORO_CYCLE': {
      const today = getTodayKey()
      const prevStats = state.stats.date === today ? state.stats : {
        ...initialState.stats,
        date: today,
      }
      return {
        ...state,
        stats: {
          ...prevStats,
          pomadoroCycles: prevStats.pomadoroCycles + 1,
        }
      }
    }
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

function getDefaultName(type) {
  switch (type) {
    case 'countdown': return 'Countdown'
    case 'stopwatch': return 'Stopwatch'
    case 'alarm': return 'Alarm'
    default: return 'Timer'
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const saved = loadFromStorage('timer-app-state', null)
    if (saved) {
      const today = getTodayKey()
      const stats = saved.stats?.date === today ? saved.stats : {
        ...init.stats,
        date: today,
        pomadoroCycles: saved.stats?.pomadoroCycles || 0,
      }
      return {
        ...init,
        timerCards: saved.timerCards || [],
        soundPreference: saved.soundPreference || init.soundPreference,
        stats,
        activeCardId: saved.activeCardId || null,
      }
    }
    return init
  })

  useEffect(() => {
    saveToStorage('timer-app-state', {
      timerCards: state.timerCards,
      soundPreference: state.soundPreference,
      stats: state.stats,
      activeCardId: state.activeCardId,
    })
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
