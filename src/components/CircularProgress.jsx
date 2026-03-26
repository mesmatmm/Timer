import React from 'react'
import { motion } from 'framer-motion'

export default function CircularProgress({
  progress = 0,
  size = 160,
  strokeWidth = 10,
  color = '#6366f1',
  trailColor = 'rgba(255,255,255,0.1)',
  children,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedProgress = Math.min(1, Math.max(0, progress))
  const dashOffset = circumference * (1 - clampedProgress)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {/* Trail circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trailColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
