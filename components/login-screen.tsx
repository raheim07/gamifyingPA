"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Role, Group, saveUser, setCurrentUser } from "@/lib/store"
import { Heart, Activity, Users, ShieldCheck } from "lucide-react"

interface LoginScreenProps {
  onLogin: (user: User) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [alias, setAlias] = useState("")
  const [role, setRole] = useState<Role>("participant")
  const [group, setGroup] = useState<Group>("intervention")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!alias.trim()) return

    const user: User = {
      alias: alias.trim(),
      role,
      group: role === "participant" ? group : undefined,
      createdAt: new Date().toISOString(),
    }

    saveUser(user)
    setCurrentUser(user)
    onLogin(user)
  }

  const roles: { value: Role; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: "participant", label: "Participant", icon: <Activity className="h-5 w-5" />, desc: "Track your daily steps" },
    { value: "support", label: "Support Member", icon: <Users className="h-5 w-5" />, desc: "Encourage participants" },
    { value: "admin", label: "Admin", icon: <ShieldCheck className="h-5 w-5" />, desc: "Demo panel access" },
  ]

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4"
          >
            <Heart className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Gamified Physical Activity & Social Support Intervention
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Cardiovascular Risk Reduction Study
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
          <div>
            <label htmlFor="alias" className="block text-sm font-medium text-foreground mb-1.5">
              Your Alias
            </label>
            <input
              id="alias"
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Enter a nickname..."
              className="w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Role
            </label>
            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all text-left ${
                    role === r.value
                      ? "bg-primary/20 ring-2 ring-primary text-foreground"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                  }`}
                >
                  <span className={role === r.value ? "text-primary" : "text-muted-foreground"}>
                    {r.icon}
                  </span>
                  <div>
                    <span className="font-medium text-sm">{r.label}</span>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {role === "participant" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Study Group
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["control", "intervention"] as Group[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGroup(g)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-all capitalize ${
                      group === g
                        ? "bg-primary/20 ring-2 ring-primary text-foreground"
                        : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Enter Study
          </button>
        </form>
      </motion.div>
    </div>
  )
}
