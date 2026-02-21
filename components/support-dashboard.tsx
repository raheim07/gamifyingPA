"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User, getUsers, getWeeklySteps, getWeeklyTotal,
  getStreak, getPoints, sendMessage, getLevel,
} from "@/lib/store"
import { StepChart } from "@/components/step-chart"
import { Users, Send, Flame, Star, Target, BarChart3 } from "lucide-react"

interface SupportDashboardProps {
  user: User
}

export function SupportDashboard({ user }: SupportDashboardProps) {
  const participants = getUsers().filter((u) => u.role === "participant")
  const [selectedAlias, setSelectedAlias] = useState<string>(participants[0]?.alias || "")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const selected = participants.find((p) => p.alias === selectedAlias)
  const weeklyData = selectedAlias ? getWeeklySteps(selectedAlias) : []
  const weeklyTotal = selectedAlias ? getWeeklyTotal(selectedAlias) : 0
  const streak = selectedAlias ? getStreak(selectedAlias) : 0
  const points = selectedAlias ? getPoints(selectedAlias) : 0
  const level = getLevel(points)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedAlias) return
    sendMessage(user.alias, selectedAlias, message.trim())
    setMessage("")
    setSent(true)
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Support Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">View and encourage participants</p>
      </div>

      {/* Participant Selector */}
      <div className="glass-card rounded-2xl p-5">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Participant
        </label>
        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No participants registered yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <button
                key={p.alias}
                onClick={() => setSelectedAlias(p.alias)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedAlias === p.alias
                    ? "bg-primary/20 ring-2 ring-primary text-foreground"
                    : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                }`}
              >
                {p.alias}
                <span className="text-xs text-muted-foreground ml-1.5 capitalize">({p.group})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <motion.div
          key={selectedAlias}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs">Weekly</span>
              </div>
              <p className="text-xl font-bold text-foreground">{weeklyTotal.toLocaleString()}</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Flame className="h-4 w-4" />
                <span className="text-xs">Streak</span>
              </div>
              <p className="text-xl font-bold text-foreground">{streak}d</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Star className="h-4 w-4" />
                <span className="text-xs">Points</span>
              </div>
              <p className="text-xl font-bold text-foreground">{points}</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="h-4 w-4" />
                <span className="text-xs">Level</span>
              </div>
              <p className="text-xl font-bold text-foreground">{level.name}</p>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-medium text-foreground mb-3">
              {"Weekly Steps for "}{selectedAlias}
            </h3>
            <StepChart data={weeklyData} animate={true} />
          </div>

          {/* Shared Challenge */}
          <div className="glass-card rounded-2xl p-5 border border-primary/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Shared Weekly Challenge</h3>
                <p className="text-xs text-muted-foreground">Help {selectedAlias} reach 35,000 steps</p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((weeklyTotal / 35000) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((weeklyTotal / 35000) * 100)}% complete
            </p>
          </div>

          {/* Send Message */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Send Encouragement
            </h3>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write an encouraging message..."
                className="flex-1 rounded-xl bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </form>
            {sent && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-accent mt-2"
              >
                Message sent!
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
