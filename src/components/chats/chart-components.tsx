import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import type { ChartData } from "@/lib/types"

interface LineChartComponentProps {
  data: ChartData[]
  title?: string
  description?: string
}

export function LineChartComponent({ data, title = "Trend Analysis", description }: LineChartComponentProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm mb-3">{title}</p>
      <div className="bg-white rounded-lg p-3 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <YAxis hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ fill: "#14b8a6", strokeWidth: 0, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {description && <p className="text-xs opacity-90">{description}</p>}
    </div>
  )
}

interface BarChartComponentProps {
  data: ChartData[]
  title?: string
  description?: string
}

export function BarChartComponent({ data, title = "Comparison Chart", description }: BarChartComponentProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm mb-3">{title}</p>
      <div className="bg-white rounded-lg p-3 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <YAxis hide />
            <Bar dataKey="value" fill="#14b8a6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {description && <p className="text-xs opacity-90">{description}</p>}
    </div>
  )
}