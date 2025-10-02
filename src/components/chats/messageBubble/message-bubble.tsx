import styles from "./messageBubble.module.scss"
import Image from "next/image"
import botIcon from "../../../../public/icons/bot-response-icon.svg"
import { BarChartComponent, DataTable, LineChartComponent, MerchantTable } from "../chart-components"
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
  { name: "Aug", value: 3000 },
  { name: "Sept", value: 4000 },
  { name: "Oct", value: 5000 },
]

  const sampleData = [
    { label: "Revenue", value: "$8,200.00" , isTotal: false},
    { label: "Expenses", value: "$3,150.00", isTotal: false },
    { label: "Net Income", value: "$5,050.00", isTotal: false },
    { label: "Margin", value: "61.6%", isTotal: false },
    { label: "Total Assets", value: "$45,200.00", isTotal: true },
  ]

  const merchantData = [
    { name: "Imtiaz", amount: "35,000.46 PKR" },
    { name: "Yango", amount: "1200 PKR" },
    { name: "Habitt", amount: "80,000 PKR" },
    { name: "Interwood", amount: "45,000 PKR" },
    { name: "Faisal", amount: "80,000 PKR" },
    { name: "Anghethi", amount: "10,000 PKR" },
  ]

interface Message {
  // type: "text" | "table" | "line-chart" | "bar-chart" | "loading" | "merchant"
  type: string,

  content?: string
  isUser: boolean
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
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
        {message.type === "text" || message.type === "general" &&
          <div className={styles["bot_text_message"]} style={{ whiteSpace: 'pre-line' }}>
             {message?.content?.split('\n\n').map((paragraph, index) => (
    <p key={index} className={index > 0 ? 'mt-4 font-semibold' : ''}>
      {paragraph}
    </p>
  ))}
          </div>
          }

        {message.type === "table" && (
          <DataTable data={sampleData} title="Here's your financial data breakdown:" />
        )}

        {message.type === "line-chart" && (
          <LineChartComponent data={lineChartData} title="Here's your financial data breakdown:" description="Growth trend shows 15% increase over the period" />
        )}

        {message.type === "bar-chart" && (
          <BarChartComponent data={barChartData} title="Here's your comparison chart:" description="Category C shows highest performance at 80%" />
        )}

      {
        message.type === "merchant" && (
          <MerchantTable data={merchantData} title="Here's your top 5 merchants:" />
        ) 
      }

      </div>
    </main>
  )
}