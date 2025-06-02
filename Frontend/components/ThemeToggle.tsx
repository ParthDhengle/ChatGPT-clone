"use client"

import type React from "react"

import { useTheme } from "@/contexts/ThemeContext"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
