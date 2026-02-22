"use client"

import { User, setCurrentUser } from "@/lib/store"
import { Heart, LogOut } from "lucide-react"
import { motion } from "framer-motion"

interface AppHeaderProps {
  user: User
  onLogout: () => void
}

export function AppHeader({ user, onLogout }: AppHeaderProps) {
  const handleLogout = () => {
    setCurrentUser(null)
    onLogout()
  }

  const roleLabel = user.role === "participant"
    ? `Participant \u00B7 ${user.group}`
    : user.role === "support"
    ? "Support Member"
    : "Administrator"

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40"
      style={{
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.06)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(14, 165, 164, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)",
            }}
          >
            <Heart className="h-4 w-4" style={{ color: "#0EA5A4" }} />
          </div>
          <div>
            <h1
              className="font-[var(--font-montserrat)] text-sm font-bold tracking-wide leading-tight"
              style={{ color: "#F1F5F9" }}
            >
              GSSI CVR Study
            </h1>
            <p className="text-[11px] leading-tight capitalize" style={{ color: "#64748B" }}>{roleLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: "#CBD5E1" }}>{user.alias}</span>
          <button
            onClick={handleLogout}
            className="transition-all duration-300 hover:scale-105"
            style={{ color: "#64748B" }}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
