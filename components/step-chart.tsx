"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { StepEntry } from "@/lib/store"

interface StepChartProps {
  data: StepEntry[]
  animate?: boolean
}

export function StepChart({ data, animate = true }: StepChartProps) {
  const chartData = data.map((entry) => ({
    day: new Date(entry.date).toLocaleDateString("en", { weekday: "short" }),
    steps: entry.steps,
    isGoalMet: entry.steps >= 5000,
  }))

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.04 220 / 0.3)" />
          <XAxis
            dataKey="day"
            tick={{ fill: "oklch(0.65 0.03 210)", fontSize: 12 }}
            axisLine={{ stroke: "oklch(0.35 0.04 220 / 0.3)" }}
          />
          <YAxis
            tick={{ fill: "oklch(0.65 0.03 210)", fontSize: 12 }}
            axisLine={{ stroke: "oklch(0.35 0.04 220 / 0.3)" }}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.22 0.025 220 / 0.9)",
              border: "1px solid oklch(0.5 0.08 200 / 0.2)",
              borderRadius: "12px",
              backdropFilter: "blur(8px)",
              color: "oklch(0.97 0.005 210)",
            }}
            labelStyle={{ color: "oklch(0.65 0.03 210)" }}
          />
          <Bar
            dataKey="steps"
            radius={[6, 6, 0, 0]}
            isAnimationActive={animate}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isGoalMet ? "oklch(0.7 0.15 195)" : "oklch(0.45 0.06 220)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
