"use client"

import { User, setCurrentUser } from "@/lib/store"
import { Heart, LogOut } from "lucide-react"

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
    ? `Participant (${user.group})`
    : user.role === "support"
    ? "Support Member"
    : "Admin"

  return (
    <header className="glass-card border-b border-border/50 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-tight">GSSI CVR Study</h1>
            <p className="text-xs text-muted-foreground leading-tight capitalize">{roleLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground font-medium">{user.alias}</span>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
