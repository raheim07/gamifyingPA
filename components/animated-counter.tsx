"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  label: string
  suffix?: string
  icon?: React.ReactNode
}

export function AnimatedCounter({ value, duration = 1.5, label, suffix = "", icon }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = 0
    const end = value
    const startTime = Date.now()
    const totalDuration = duration * 1000

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / totalDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (end - start) * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 text-center"
    >
      {icon && <div className="text-primary mb-2 flex justify-center">{icon}</div>}
      <div className="text-2xl font-bold text-foreground">
        {display.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  )
}
