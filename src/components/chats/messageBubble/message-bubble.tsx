import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import styles from "./messageBubble.module.scss"
import Image from "next/image"
import botIcon from "../../../..//public/bot-response-icon.svg"
import { LineChartComponent } from "../chart-components"
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
  // id: number
  type: "text" | "table" | "line-chart" | "bar-chart" | "loading" | "merchant"
  content?: string
  isUser: boolean
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  console.log("Rendering message: ", message)
  if (message.isUser) {
    return (
      <main className={styles["user_message_main_div"]}>
        <div className={styles["user_message_content_div"]}>
          <p>{message.content}</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles["bot_message_main_div"]}>
      <div className={styles["bot_message_container"]}>
        <Image src={botIcon} width={32} height={32} alt="bot_icon_response" />
        {message.type === "text" && 
          <p className={styles["bot_text_message"]}>{message.content}</p>
          }

        {message.type === "table" && (
          <div className="space-y-3">
            <p className="text-sm mb-3">{"Here's your financial data breakdown:"}</p>
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
          // <div className="space-y-3">
          //   <p className="text-sm mb-3">Here&apos;s your trend analysis:</p>
          //   <div className="bg-white rounded-lg p-3 h-32">
          //     <ResponsiveContainer width="100%" height="100%">
          //       <LineChart data={lineChartData}>
          //         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
          //         <YAxis hide />
          //         <Line
          //           type="linear"
          //           dataKey="value"
          //           stroke="#14b8a6"
          //           strokeWidth={2}
          //           dot={{ fill: "#14b8a6", strokeWidth: 0, r: 3 }}
                    
          //         />
          //       </LineChart>
          //     </ResponsiveContainer>
          //   </div>
          //   <p className="text-xs opacity-90">Growth trend shows 15% increase over the period</p>
          // </div>

          <LineChartComponent data={lineChartData} title="Here's your financial data breakdown:" description="Growth trend shows 15% increase over the period" />
        )}

        {message.type === "bar-chart" && (
          <div className="space-y-3">
            <p className="text-sm mb-3">Here`&apos;`s your comparison chart:</p>
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

      {
        message.type === "merchant" && (
          <div className={styles["merchant_message_bubble"]}>
            <p>Your top 5 {message.type === "merchant" ? "merchants" : "vendors"} are:</p>
             <div className={styles["merchant_list_container"]}>
              <div className={styles["merchant_list_inner_divs"]}>
                <span>Imtiaz</span>
                <span>35,000.46 PKR</span>
              </div>
              <div className={styles["merchant_list_inner_divs"]}>
                <span>Yango</span>
                <span>1200 PKR</span>
              </div>
              <div className={styles["merchant_list_inner_divs"]}>
                <span>Habitt</span>
                <span>80,000 PKR</span>
              </div>
              <div className={styles["merchant_list_inner_divs"]}>
                <span>Interwood</span>
                <span>45,000 PKR</span>
              </div>
              <div className={styles["merchant_list_inner_divs"]}>
                <span>Anghethi</span>
                <span>10,000 PKR</span>
              </div>
              <div className={styles["merchant_list_inner_divs"]}>
                <span>Nueplex</span>
                <span>5000 PKR</span>
              </div>
            </div>

          </div>
        ) 
      }

      </div>
    </main>
  )
}