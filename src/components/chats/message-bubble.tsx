import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"

// Sample data for charts
const lineChartData = [
  { name: "1", value: 20 },
  { name: "2", value: 45 },
  { name: "3", value: 30 },
  { name: "4", value: 60 },
  { name: "5", value: 40 },
  { name: "6", value: 80 },
]

const barChartData = [
  { name: "A", value: 40 },
  { name: "B", value: 60 },
  { name: "C", value: 80 },
  { name: "D", value: 45 },
]

interface Message {
  id: number
  type: "text" | "table" | "line-chart" | "bar-chart" | "loading"
  content?: string
  isUser: boolean
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white text-black border bg-gray-700 px-4 py-3 rounded-2xl  max-w-[85%]">
        {message.type === "text" && <p className="text-sm leading-relaxed">{message.content}</p>}

        {message.type === "table" && (
          <div className="space-y-3">
            <p className="text-sm mb-3">Here's your financial data breakdown:</p>
            <div className="bg-white/10 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Revenue</span>
                <span>$8,200.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Expenses</span>
                <span>$3,150.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Net Income</span>
                <span>$5,050.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Margin</span>
                <span>61.6%</span>
              </div>
              <hr className="border-white/20" />
              <div className="flex justify-between text-xs font-medium">
                <span>Total Assets</span>
                <span>$45,200.00</span>
              </div>
            </div>
          </div>
        )}

        {message.type === "line-chart" && (
          <div className="space-y-3">
            <p className="text-sm mb-3">Here's your trend analysis:</p>
            <div className="bg-white rounded-lg p-3 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
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
            <p className="text-xs opacity-90">Growth trend shows 15% increase over the period</p>
          </div>
        )}

        {message.type === "bar-chart" && (
          <div className="space-y-3">
            <p className="text-sm mb-3">Here's your comparison chart:</p>
            <div className="bg-white rounded-lg p-3 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Bar dataKey="value" fill="#14b8a6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs opacity-90">Category C shows highest performance at 80%</p>
          </div>
        )}
      </div>
    </div>
  )
}