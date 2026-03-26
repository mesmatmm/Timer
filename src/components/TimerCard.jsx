import React from 'react'
import { AnimatePresence } from 'framer-motion'
import CountdownCard from './CountdownCard'
import StopwatchCard from './StopwatchCard'
import AlarmCard from './AlarmCard'
import { useApp } from '../context/AppContext'

export default function TimerCard({ card }) {
  const { state, dispatch } = useApp()
  const isActive = state.activeCardId === card.id

  const handleActivate = () => {
    dispatch({ type: 'SET_ACTIVE_CARD', payload: { id: card.id } })
  }

  const handleDelete = () => {
    dispatch({ type: 'REMOVE_CARD', payload: { id: card.id } })
  }

  const commonProps = {
    card,
    isActive,
    onActivate: handleActivate,
    onDelete: handleDelete,
  }

  switch (card.type) {
    case 'countdown':
      return <CountdownCard {...commonProps} />
    case 'stopwatch':
      return <StopwatchCard {...commonProps} />
    case 'alarm':
      return <AlarmCard {...commonProps} />
    default:
      return null
  }
}
