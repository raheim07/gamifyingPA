"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/lib/store"
import { X, Footprints, Calendar, Target, Flame, Zap, Star, Trophy, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

const iconMap: Record<string, React.ReactNode> = {
  Footprints: <Footprints className="h-12 w-12" />,
  Calendar: <Calendar className="h-12 w-12" />,
  Target: <Target className="h-12 w-12" />,
  Flame: <Flame className="h-12 w-12" />,
  Zap: <Zap className="h-12 w-12" />,
  Star: <Star className="h-12 w-12" />,
  Trophy: <Trophy className="h-12 w-12" />,
  TrendingUp: <TrendingUp className="h-12 w-12" />,
}

interface BadgeModalProps {
  badge: Badge | null
  onClose: () => void
}

function ConfettiParticle({ delay }: { delay: number }) {
  const colors = ["oklch(0.7 0.15 195)", "oklch(0.65 0.18 175)", "oklch(0.75 0.2 60)", "oklch(0.7 0.2 30)", "oklch(0.65 0.15 300)"]
  const color = colors[Math.floor(Math.random() * colors.length)]
  const x = Math.random() * 300 - 150
  const rotation = Math.random() * 720

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      animate={{ opacity: 0, y: 200, x, rotate: rotation, scale: 0 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
      className="absolute top-0 left-1/2 w-2 h-2 rounded-sm"
      style={{ background: color }}
    />
  )
}

export function BadgeModal({ badge, onClose }: BadgeModalProps) {
  const [confetti, setConfetti] = useState<number[]>([])

  useEffect(() => {
    if (badge) {
      setConfetti(Array.from({ length: 30 }, (_, i) => i))
    }
  }, [badge])

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-card rounded-2xl p-8 text-center max-w-sm w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti */}
            <div className="absolute inset-0 pointer-events-none flex items-start justify-center">
              {confetti.map((i) => (
                <ConfettiParticle key={i} delay={i * 0.03} />
              ))}
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close badge modal"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/20 text-primary mb-4"
            >
              {iconMap[badge.icon] || <Star className="h-12 w-12" />}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold text-foreground mb-2"
            >
              Badge Unlocked!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg font-semibold text-primary mb-1"
            >
              {badge.name}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              {badge.description}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
