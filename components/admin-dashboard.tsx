"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  getUsers, getWeeklyTotal, getPoints, getStreak,
  getUnlockedBadges, getEngagementScore, exportCSV,
  updateUserGroup, Group, getAdherence,
} from "@/lib/store"
import { ShieldCheck, Download, BarChart3, Users, ArrowRightLeft, Eye } from "lucide-react"

export function AdminDashboard() {
  const [users, setUsers] = useState(getUsers())
  const [comparisonMode, setComparisonMode] = useState(false)

  const participants = users.filter((u) => u.role === "participant")
  const controlUsers = participants.filter((u) => u.group === "control")
  const interventionUsers = participants.filter((u) => u.group === "intervention")

  const handleExportCSV = () => {
    const csv = exportCSV()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "study_data.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleToggleGroup = (alias: string) => {
    const user = users.find((u) => u.alias === alias)
    if (!user || user.role !== "participant") return
    const newGroup: Group = user.group === "control" ? "intervention" : "control"
    updateUserGroup(alias, newGroup)
    setUsers(getUsers())
  }

  const getGroupStats = (group: "control" | "intervention") => {
    const groupUsers = participants.filter((u) => u.group === group)
    if (groupUsers.length === 0) return { avgSteps: 0, avgPoints: 0, avgStreak: 0, avgEngagement: 0 }
    const totalSteps = groupUsers.reduce((s, u) => s + getWeeklyTotal(u.alias), 0)
    const totalPoints = groupUsers.reduce((s, u) => s + getPoints(u.alias), 0)
    const totalStreak = groupUsers.reduce((s, u) => s + getStreak(u.alias), 0)
    const totalEngagement = groupUsers.reduce((s, u) => s + getEngagementScore(u.alias), 0)
    return {
      avgSteps: Math.round(totalSteps / groupUsers.length),
      avgPoints: Math.round(totalPoints / groupUsers.length),
      avgStreak: Math.round(totalStreak / groupUsers.length),
      avgEngagement: Math.round(totalEngagement / groupUsers.length),
    }
  }

  const controlStats = getGroupStats("control")
  const interventionStats = getGroupStats("intervention")

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Admin Panel
          </h2>
          <p className="text-sm text-muted-foreground">Manage demo users and export data</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className="rounded-xl bg-secondary px-4 py-2 text-sm text-secondary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <Eye className="h-4 w-4" />
            {comparisonMode ? "Hide" : "Compare"}
          </button>
          <button
            onClick={handleExportCSV}
            className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
          <p className="text-xs text-muted-foreground">Total Users</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{controlUsers.length}</p>
          <p className="text-xs text-muted-foreground">Control</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <BarChart3 className="h-5 w-5 text-accent mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{interventionUsers.length}</p>
          <p className="text-xs text-muted-foreground">Intervention</p>
        </div>
      </div>

      {/* Comparison Mode */}
      {comparisonMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card rounded-2xl p-5 border border-primary/30"
        >
          <h3 className="text-sm font-bold text-foreground mb-4">Group Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Control</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Weekly Steps</span>
                  <span className="text-foreground font-medium">{controlStats.avgSteps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Points</span>
                  <span className="text-foreground font-medium">{controlStats.avgPoints}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Streak</span>
                  <span className="text-foreground font-medium">{controlStats.avgStreak}d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Engagement</span>
                  <span className="text-foreground font-medium">{controlStats.avgEngagement}%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Intervention</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Weekly Steps</span>
                  <span className="text-foreground font-medium">{interventionStats.avgSteps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Points</span>
                  <span className="text-foreground font-medium">{interventionStats.avgPoints}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Streak</span>
                  <span className="text-foreground font-medium">{interventionStats.avgStreak}d</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Engagement</span>
                  <span className="text-foreground font-medium">{interventionStats.avgEngagement}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">All Users</h3>
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users registered yet.</p>
        ) : (
          <div className="space-y-2">
            {users.map((u) => {
              const weekly = u.role === "participant" ? getWeeklyTotal(u.alias) : 0
              const pts = u.role === "participant" ? getPoints(u.alias) : 0
              const strk = u.role === "participant" ? getStreak(u.alias) : 0
              const badges = u.role === "participant" ? getUnlockedBadges(u.alias).length : 0
              const engagement = u.role === "participant" ? getEngagementScore(u.alias) : 0
              const adherence = u.role === "participant" ? getAdherence(u.alias) : 0

              return (
                <motion.div
                  key={u.alias}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-secondary/30 rounded-xl p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{u.alias}</span>
                      <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-full bg-secondary">
                        {u.role}
                      </span>
                      {u.group && (
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          u.group === "intervention"
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary text-secondary-foreground"
                        }`}>
                          {u.group}
                        </span>
                      )}
                    </div>
                    {u.role === "participant" && (
                      <button
                        onClick={() => handleToggleGroup(u.alias)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                        title="Toggle group"
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        Toggle
                      </button>
                    )}
                  </div>
                  {u.role === "participant" && (
                    <div className="grid grid-cols-3 gap-2 text-xs lg:grid-cols-6">
                      <div>
                        <span className="text-muted-foreground">Weekly</span>
                        <p className="text-foreground font-medium">{weekly.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Points</span>
                        <p className="text-foreground font-medium">{pts}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Streak</span>
                        <p className="text-foreground font-medium">{strk}d</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Badges</span>
                        <p className="text-foreground font-medium">{badges}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Adherence</span>
                        <p className="text-foreground font-medium">{adherence}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Engagement</span>
                        <p className="text-foreground font-medium">{engagement}%</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Submit Study Data */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Submit Study Data</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Export all participant data for analysis.
        </p>
        <button
          onClick={handleExportCSV}
          className="w-full rounded-xl bg-primary py-3 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Submit Study Data
        </button>
      </div>
    </div>
  )
}
