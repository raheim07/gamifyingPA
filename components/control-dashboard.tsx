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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Step Tracker</h2>
        <p className="text-sm text-muted-foreground">Control Group Dashboard</p>
      </div>

      {/* Step Input */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Footprints className="h-4 w-4 text-primary" />
          Log Steps
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Weekly Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{weeklyTotal.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Adherence</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{adherence}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Weekly Breakdown</h3>
        <StepChart data={weeklyData} animate={false} />
      </div>
    </div>
  )
}
