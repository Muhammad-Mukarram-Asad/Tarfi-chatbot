import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  LabelList,
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
              // domain={[0, 60000]} // Define the range explicitly
              tickCount={6} // Ensure enough ticks are displayed
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
    const data1 = [
    // { name: "Aug", value1: 0, value2: 0 },
    { name: "Sept", value1: 10000, value2: 5000 },
    { name: "Oct", value1: 20000, value2: 15000 },
    { name: "Nov", value1: 30000, value2: 25000 },
    { name: "Dec", value1: 40000, value2: 35000 },
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm mb-3">{title}</p>
      <div className="bg-white rounded-lg p-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data1}>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              strokeDasharray="0"
              stroke="#e5e5e5"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              dataKey={"value1"}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              // domain={[0, 60000]} // Define the range explicitly
              tickCount={5} // Ensure enough ticks are displayed
            />
<Bar dataKey="value2" radius={[8,8,0,0]}>
  {data1.map((entry, index) => {
    const colors = ["#335A60", "#3C95A3", "#6ED9EA", '#14b8a6'];
    return (
      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
    );
  })}

    <LabelList 
        dataKey="value2" 
        position="insideTop" 
        fontSize={14} 
        formatter={(value) => `${Number(value) / 1000}k`} // Format the value as 'k'
        fill="#fff" // Color of the label text
        fontWeight="bold"
      />
</Bar>
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
      <div className="bg-white/10 rounded-lg p-0 space-y-2">
        {/* {data?.map((item, index) => (
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


        ))} */}
          <table className="w-full table-fixed border border-black border-collapse">
  <thead className="bg-gray-100 p-2">
    <tr className="border-b-2 border-black">
      <th className="px-2 py-2 text-left text-sm">Metric</th>
      <th className="px-2 py-2 text-left text-sm">Before</th>
      <th className="px-2 py-2 text-left text-sm">After</th>
      <th className="px-2 py-2 text-left text-sm">Change</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-black">
      <td className="px-2 py-2 text-left text-sm">Monthly Cash inflow</td>
      <td className="px-2 py-2 text-left text-sm">50,000</td>
      <td className="px-2 py-2 text-left text-sm">10,000</td>
      <td className="px-2 py-2 text-left text-sm">-40,000</td>
    </tr>

     <tr className="border-b border-black">
      <td className="px-2 py-2 text-left text-sm">Net Worth in 10 Years</td>
      <td className="px-2 py-2 text-left text-sm">20M PKR</td>
      <td className="px-2 py-2 text-left text-sm">15.5M PKR</td>
      <td className="px-2 py-2 text-left text-sm">-4.5M PKR</td>
    </tr>

    <tr className="border-b border-black">
      <td className="px-2 py-2 text-left text-xs">Retirement Goal</td>
      <td className="px-2 py-2 text-left text-sm">58 Years</td>
      <td className="px-2 py-2 text-left text-sm">60 Years</td>
      <td className="px-2 py-2 text-left text-sm">+2 Years</td>
    </tr>
  </tbody>
</table>
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
