"use client"

import { useState } from "react"
import { User, addSteps, getWeeklySteps, getWeeklyTotal, getAdherence, getSteps } from "@/lib/store"
import { StepChart } from "@/components/step-chart"
import { Footprints, BarChart3, TrendingUp } from "lucide-react"

interface ControlDashboardProps {
  user: User
}

export function ControlDashboard({ user }: ControlDashboardProps) {
  const [stepInput, setStepInput] = useState("")
  const [weeklyData, setWeeklyData] = useState(getWeeklySteps(user.alias))
  const [weeklyTotal, setWeeklyTotal] = useState(getWeeklyTotal(user.alias))
  const [adherence, setAdherence] = useState(getAdherence(user.alias))
  const [todaySteps, setTodaySteps] = useState(() => {
    const today = new Date().toISOString().split("T")[0]
    const entry = getSteps(user.alias).find((e) => e.date === today)
    return entry?.steps || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const steps = parseInt(stepInput)
    if (isNaN(steps) || steps <= 0) return

    addSteps(user.alias, steps)
    setWeeklyData(getWeeklySteps(user.alias))
    setWeeklyTotal(getWeeklyTotal(user.alias))
    setAdherence(getAdherence(user.alias))

    const today = new Date().toISOString().split("T")[0]
    const entry = getSteps(user.alias).find((e) => e.date === today)
    setTodaySteps(entry?.steps || 0)
    setStepInput("")
  }

  return (
    <div className="space-y-5">
      {/* Clean header - no animations, no energy */}
      <div>
        <h2
          className="font-[var(--font-montserrat)] text-lg font-bold tracking-wide"
          style={{ color: "#F1F5F9" }}
        >
          Step Tracker
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Control Group Dashboard</p>
      </div>

      {/* Step Input - static, clean */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: "#CBD5E1" }}>
          <Footprints className="h-4 w-4" style={{ color: "#94A3B8" }} />
          Log Steps
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            placeholder="Enter steps..."
            min="1"
            className="flex-1 rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
            style={{
              background: "rgba(30, 41, 59, 0.6)",
              color: "#F1F5F9",
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 0 2px #64748B"}
            onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
          />
          <button
            type="submit"
            className="rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "#334155", color: "#CBD5E1" }}
          >
            Submit
          </button>
        </form>
        {todaySteps > 0 && (
          <p className="text-xs mt-2" style={{ color: "#64748B" }}>
            {"Today's total: "}{todaySteps.toLocaleString()} steps
          </p>
        )}
      </div>

      {/* Stats - flat, no glow */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1" style={{ color: "#94A3B8" }}>
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Weekly Total</span>
          </div>
          <p className="font-[var(--font-montserrat)] text-2xl font-light" style={{ color: "#F1F5F9" }}>
            {weeklyTotal.toLocaleString()}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1" style={{ color: "#94A3B8" }}>
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Adherence</span>
          </div>
          <p className="font-[var(--font-montserrat)] text-2xl font-light" style={{ color: "#F1F5F9" }}>
            {adherence}%
          </p>
        </div>
      </div>

      {/* Chart - no animation, static */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-medium mb-3" style={{ color: "#CBD5E1" }}>Weekly Breakdown</h3>
        <StepChart data={weeklyData} animate={false} />
      </div>
    </div>
  )
}
