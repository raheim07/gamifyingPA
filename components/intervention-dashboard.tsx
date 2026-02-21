"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Badge, addSteps, getWeeklySteps, getWeeklyTotal,
  getAdherence, getPoints, getStreak, getLevel,
  checkAndUnlockBadges, getUnlockedBadges, getSteps,
  getMessagesFor, getUsers, BADGES,
} from "@/lib/store"
import { StepChart } from "@/components/step-chart"
import { ProgressRing } from "@/components/progress-ring"
import { AnimatedCounter } from "@/components/animated-counter"
import { BadgeModal } from "@/components/badge-modal"
import {
  Footprints, Flame, Star, Trophy, Target,
  Medal, MessageCircle, Zap, TrendingUp, Calendar,
} from "lucide-react"

const smallIconMap: Record<string, React.ReactNode> = {
  Footprints: <Footprints className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  Target: <Target className="h-5 w-5" />,
  Flame: <Flame className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  Star: <Star className="h-5 w-5" />,
  Trophy: <Trophy className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
}

interface InterventionDashboardProps {
  user: User
}

export function InterventionDashboard({ user }: InterventionDashboardProps) {
  const [stepInput, setStepInput] = useState("")
  const [weeklyData, setWeeklyData] = useState(getWeeklySteps(user.alias))
  const [weeklyTotal, setWeeklyTotal] = useState(getWeeklyTotal(user.alias))
  const [adherence, setAdherence] = useState(getAdherence(user.alias))
  const [points, setPoints] = useState(getPoints(user.alias))
  const [streak, setStreak] = useState(getStreak(user.alias))
  const [unlockedBadges, setUnlockedBadges] = useState(getUnlockedBadges(user.alias))
  const [newBadge, setNewBadge] = useState<Badge | null>(null)
  const [messages] = useState(getMessagesFor(user.alias))
  const [todaySteps, setTodaySteps] = useState(() => {
    const today = new Date().toISOString().split("T")[0]
    const entry = getSteps(user.alias).find((e) => e.date === today)
    return entry?.steps || 0
  })

  const level = getLevel(points)
  const weeklyGoal = 35000
  const weeklyProgress = Math.round((weeklyTotal / weeklyGoal) * 100)

  const refreshData = useCallback(() => {
    setWeeklyData(getWeeklySteps(user.alias))
    setWeeklyTotal(getWeeklyTotal(user.alias))
    setAdherence(getAdherence(user.alias))
    setPoints(getPoints(user.alias))
    setStreak(getStreak(user.alias))
    setUnlockedBadges(getUnlockedBadges(user.alias))
    const today = new Date().toISOString().split("T")[0]
    const entry = getSteps(user.alias).find((e) => e.date === today)
    setTodaySteps(entry?.steps || 0)
  }, [user.alias])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const steps = parseInt(stepInput)
    if (isNaN(steps) || steps <= 0) return

    addSteps(user.alias, steps)
    const newBadges = checkAndUnlockBadges(user.alias)
    refreshData()
    setStepInput("")

    if (newBadges.length > 0) {
      setNewBadge(newBadges[0])
    }
  }

  // Leaderboard
  const allUsers = getUsers().filter((u) => u.role === "participant" && u.group === "intervention")
  const leaderboard = allUsers
    .map((u) => ({ alias: u.alias, points: getPoints(u.alias) }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)

  // Motivational microcopy
  const microcopies = [
    "Every step counts toward a healthier heart!",
    "You are making progress - keep it up!",
    "Consistency is the key to cardiovascular health.",
    "Your future self will thank you for these steps!",
    "Small steps lead to big changes.",
  ]
  const motivationalText = microcopies[Math.floor(Date.now() / 86400000) % microcopies.length]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
          <span>Welcome back, {user.alias}</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Flame className="h-5 w-5 text-accent" />
          </motion.span>
        </h2>
        <p className="text-sm text-muted-foreground italic">{motivationalText}</p>
      </div>

      {/* Step Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Footprints className="h-4 w-4 text-primary" />
          Log Your Steps
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            placeholder="Enter steps..."
            min="1"
            className="flex-1 rounded-xl bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Submit
          </button>
        </form>
        {todaySteps > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {"Today's total: "}{todaySteps.toLocaleString()} steps
          </p>
        )}
      </motion.div>

      {/* Animated Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatedCounter value={points} label="Points" icon={<Star className="h-5 w-5" />} />
        <AnimatedCounter value={streak} label="Day Streak" suffix="d" icon={<Flame className="h-5 w-5" />} />
        <AnimatedCounter value={adherence} label="Adherence" suffix="%" icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      {/* Level & Weekly Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-muted-foreground">Current Level</span>
            <div className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground">{level.name}</span>
            </div>
            <div className="mt-1 w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((points - level.min) / (level.max - level.min)) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          <ProgressRing
            progress={weeklyProgress}
            size={100}
            strokeWidth={8}
            value={`${Math.round(weeklyProgress)}%`}
            label="Weekly Goal"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {weeklyTotal.toLocaleString()} / {weeklyGoal.toLocaleString()} steps this week
        </p>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="text-sm font-medium text-foreground mb-3">Weekly Breakdown</h3>
        <StepChart data={weeklyData} animate={true} />
      </motion.div>

      {/* Challenge Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card rounded-2xl p-5 border border-primary/30"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Weekly Challenge</h3>
            <p className="text-xs text-muted-foreground">Reach 35,000 steps this week</p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {Math.max(0, weeklyGoal - weeklyTotal).toLocaleString()} steps remaining
        </p>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          Badges ({unlockedBadges.length}/{BADGES.length})
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.some((b) => b.id === badge.id)
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isUnlocked ? "bg-primary/10 text-primary" : "bg-secondary/30 text-muted-foreground opacity-40"
                }`}
              >
                {smallIconMap[badge.icon] || <Star className="h-5 w-5" />}
                <span className="text-[10px] text-center leading-tight">{badge.name}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card rounded-2xl p-5"
      >
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          Leaderboard
        </h3>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-muted-foreground">No participants yet</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.alias}
                className={`flex items-center justify-between px-3 py-2 rounded-xl ${
                  entry.alias === user.alias ? "bg-primary/10" : "bg-secondary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${idx === 0 ? "text-accent" : "text-muted-foreground"}`}>
                    #{idx + 1}
                  </span>
                  <span className="text-sm text-foreground font-medium">
                    {entry.alias}{entry.alias === user.alias ? " (You)" : ""}
                  </span>
                </div>
                <span className="text-sm text-primary font-semibold">{entry.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Support Messages */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            Encouragement Feed
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-secondary/30 rounded-xl px-3 py-2">
                <p className="text-xs text-muted-foreground mb-0.5">From {msg.from}</p>
                <p className="text-sm text-foreground">{msg.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Badge Modal */}
      <BadgeModal badge={newBadge} onClose={() => setNewBadge(null)} />
    </div>
  )
}
