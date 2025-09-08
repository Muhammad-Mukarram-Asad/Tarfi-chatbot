import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import type { ChartData, TableData } from "@/lib/types";
import styles from "./messageBubble/messageBubble.module.scss";
interface DataTableProps {
  data: TableData[];
  title?: string;
}

interface LineChartComponentProps {
  data: ChartData[];
  title?: string;
  description?: string;
}

interface MerchantDataProps {
  name: string;
  amount: string;
}

export function LineChartComponent({
  data,
  title = "Trend Analysis",
  description,
}: LineChartComponentProps) {
  const data1 = [
    { name: "1", value1: 0, value2: 0 },
    { name: "2", value1: 10000, value2: 5000 },
    { name: "3", value1: 20000, value2: 15000 },
    { name: "4", value1: 30000, value2: 25000 },
    { name: "5", value1: 40000, value2: 35000 },
    { name: "6", value1: 50000, value2: 45000 },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm mb-3">{title}</p>
      <div className="bg-white rounded-lg p-3 h-64">
        {/* <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ fill: "#14b8a6", strokeWidth: 0, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer> */}
        <ResponsiveContainer width="100%" height={"100%"}>
          <LineChart data={data1}>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              strokeDasharray="0"
              stroke="#e5e5e5"
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
              domain={[0, 60000]} // Define the range explicitly
              tickCount={7} // Ensure enough ticks are displayed
            />
            <Line
              type="monotone"
              dataKey="value1"
              stroke="#0d9488"
              strokeWidth={2}
              dot={false} // Removed dots
            />
            <Line
              type="monotone"
              dataKey="value2"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={false} // Removed dots
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {description && <p className="text-xs opacity-90">{description}</p>}
    </div>
  );
}

interface BarChartComponentProps {
  data: ChartData[];
  title?: string;
  description?: string;
}

export function BarChartComponent({
  data,
  title = "Comparison Chart",
  description,
}: BarChartComponentProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm mb-3">{title}</p>
      <div className="bg-white rounded-lg p-3 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              strokeDasharray="3 3"
              stroke="#e5e5e5"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              dataKey={"value"}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <Bar dataKey="value" fill="#14b8a6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {description && <p className="text-xs opacity-90">{description}</p>}
    </div>
  );
}

export function DataTable({
  data,
  title = "Financial Data Breakdown",
}: DataTableProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm mb-3">{title}</p>
      <div className="bg-white/10 rounded-lg p-3 space-y-2">
        {data?.map((item, index) => (
          <div key={index}>
            {item.isTotal && <hr className="border-white/20 mb-2" />}
            <div
              className={`flex justify-between text-xs ${
                item.isTotal ? "font-medium" : ""
              }`}
            >
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MerchantTable({
  data,
  title = "Top 5 Merchants",
}: {
  data?: MerchantDataProps[];
  title?: string;
}) {
  return (
    <div className={styles["merchant_message_bubble"]}>
      <p>{title}</p>
      <div className={styles["merchant_list_container"]}>
        {data?.map((item: MerchantDataProps, index: number) => (
          <div key={index} className={styles["merchant_list_inner_divs"]}>
            <span>{item.name}</span>
            <span>{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
