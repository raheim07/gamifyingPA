"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, getCurrentUser } from "@/lib/store"
import { LoginScreen } from "@/components/login-screen"
import { AppHeader } from "@/components/app-header"
import { ControlDashboard } from "@/components/control-dashboard"
import { InterventionDashboard } from "@/components/intervention-dashboard"
import { SupportDashboard } from "@/components/support-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = getCurrentUser()
    if (stored) setUser(stored)
  }, [])

  if (!mounted) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />
  }

  return (
    <div className="gradient-bg min-h-screen">
      <AppHeader user={user} onLogout={() => setUser(null)} />
      <AnimatePresence mode="wait">
        <motion.main
          key={user.alias + user.role}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto px-4 py-6 pb-16"
        >
          {user.role === "participant" && user.group === "control" && (
            <ControlDashboard user={user} />
          )}
          {user.role === "participant" && user.group === "intervention" && (
            <InterventionDashboard user={user} />
          )}
          {user.role === "support" && (
            <SupportDashboard user={user} />
          )}
          {user.role === "admin" && (
            <AdminDashboard />
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
