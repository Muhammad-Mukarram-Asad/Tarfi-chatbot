/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Legend,
  Text,
  Label,
} from "recharts";
import { ChartData, TableData } from "@/lib/types";
import styles from "./messageBubble/messageBubble.module.scss";
// components/chats/chart-components/ProgressChart.tsx
import { ProgressGoal } from "@/lib/types/agentResponse";
interface DataTableProps {
  data: TableData;
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

interface Dataset {
  label: string;
  data: number[];
  color: string | string[];
}

interface BarChartComponentProps {
  data: ChartData[];
  dataset: Dataset[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  barColor?: string;
}

interface ComparisonBarChartProps {
  data: any[];
  datasets: Dataset[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}
const formatCurrency = (value: any) => {
  if (value >= 1000) {
    return `PKR ${value / 1000}k`;
  }
  return `PKR ${value}`;
};
export function LineChartComponent({
  data,
  title = "Trend Analysis",
  description,
}: LineChartComponentProps) {
  return (
    <div className="space-y-3 mb-3 flex flex-col items-start">
      <p className="mb-4" style={{ fontSize: "15px" }}>
        {title}
      </p>
      <div
        className="bg-white pt-3 pb-3"
        style={{ width: "95%", height: "300px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            style={{ pointerEvents: "none" }}
            width={window.screen.width - 10}
            height={300}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              vertical={false}
              horizontal={true}
              strokeDasharray="0"
              stroke="#e5e5e5"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 14, textAnchor: "end", fill: "black" }}
              tickLine={false}
              axisLine={false}
            ></XAxis>
            <YAxis
              tick={{
                fontSize: 14,
                textAnchor: "end",
                fill: "black",
                transform: "rotate(0)", // Ensures horizontal text
              }}
              tickLine={false}
              axisLine={true}
              tickFormatter={formatCurrency}
              tickCount={6}
              width="auto"
            />

            <Line
              type="monotone"
              dataKey="value1"
              stroke="#0d9488"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="value2"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p
        style={{
          fontSize: "15px",
          textAlign: "center",
          width: "100%",
          marginLeft: "20px",
          marginTop: "-30px",
        }}
      >
        Years
      </p>
      {description && <p style={{ fontSize: "15px" }}>{description}</p>}
    </div>
  );
}

export function BarChartComponent({
  data,
  dataset,
  title = "Comparison Chart",
  xAxisLabel,
  yAxisLabel,
  barColor,
}: BarChartComponentProps) {
  return (
    <div className="mb-3">
      <p className="mb-4 text-center" style={{ fontSize: "14px" }}>
        {title}
      </p>
      <div className="bg-white rounded-lg h-60 mb-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            style={{ pointerEvents: "none" }}
            barGap={10}
            barCategoryGap={10}
          >
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
              label={{
                value: xAxisLabel,
                position: "insideBottom",
                offset: -5,
                fontSize: 14,
              }}
            />
            <YAxis
              tick={{
                fontSize: 14,
                textAnchor: "end",
                fill: "black",
                transform: "rotate(0)", // Ensures horizontal text
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              tickCount={6}
              width="auto"
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "left",
                offset: 0,
                fontSize: 14,
              }}
            />
            {dataset.map((dataset, index) => (
              <Bar
                key={index}
                dataKey={dataset.label}
                fill={
                  Array.isArray(dataset.color)
                    ? dataset.color[0]
                    : dataset.color
                }
                radius={[8, 8, 0, 0]}
                barSize={60}
              >
                <LabelList
                  dataKey={dataset.label}
                  position="insideTop"
                  fontSize={12}
                  formatter={(value) => `${(Number(value) / 1000).toFixed(0)}k`} // Format the value as 'k'
                  fill="#fff"
                  fontWeight="bold"
                  dy={5}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ComparisonBarChart({
  data,
  datasets,
  title = "Comparison Chart",
  xAxisLabel,
  yAxisLabel,
}: ComparisonBarChartProps) {
  return (
    <div className="mb-3">
      <p className="mb-4 text-center" style={{ fontSize: "14px" }}>
        {title}
      </p>
      <div className="bg-white rounded-lg h-72 mb-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            style={{ pointerEvents: "none" }}
            // barGap={10}
            // barCategoryGap="10%"
          >
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
              label={{
                value: xAxisLabel,
                position: "insideBottom",
                offset: -5,
                fontSize: 14,
                marginTop: "10px",
              }}
            />
            <YAxis
              tick={{
                fontSize: 14,
                textAnchor: "end",
                fill: "black",
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              tickCount={6}
              width={"auto"}
              // label={{
              //   value: yAxisLabel,
              //   angle: -90,
              //   position: "left",
              //   offset: 10,
              //   fontSize: 14,
              // }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              iconType="rect"
              iconSize={12}
            />

            {/* Render a Bar for each dataset */}
            {datasets.map((dataset, index) => (
              <Bar
                key={index}
                dataKey={dataset.label}
                fill={
                  Array.isArray(dataset.color)
                    ? dataset.color[0]
                    : dataset.color
                }
                radius={[8, 8, 0, 0]}
                barSize={60}
              >
                <LabelList
                  dataKey={dataset.label}
                  position="insideTop"
                  fontSize={12}
                  formatter={(value) => `${(Number(value) / 1000).toFixed(0)}k`} // Format the value as 'k'
                  fill="#fff"
                  fontWeight="bold"
                  dy={5}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DataTable({
  data,
  title = "Financial Data Breakdown",
}: DataTableProps) {
  return (
    <main className={styles["table_main_div"]}>
      <p>{title}</p>

      {/* Wrapper div for horizontal scrolling */}
      <div className="overflow-x-auto">
        <table className="table-auto border border-black border-collapse min-w-full">
          <thead className="bg-gray-100">
            <tr className="border-b-2 border-black">
              {data.columns.map((col, index) => {
                return (
                  <th key={index} className="px-4 py-2 text-left text-xs">
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data?.rows?.map((outerRow, index) => {
              return (
                <tr key={index} className="border-b border-black">
                  {outerRow.map((col, index) => (
                    <td key={index} className="px-4 py-2 text-left text-sm">
                      {col}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
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

interface ProgressChartProps {
  data: ProgressGoal[];
  title: string;
}

export function ProgressChart({ data, title }: ProgressChartProps) {
  return (
    <div className="w-full bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{goal.label}</span>
              <span className="text-sm text-gray-600">
                {goal.percentage.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${goal.percentage}%`,
                  backgroundColor: goal.color,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Current: PKR {goal.current.toLocaleString()}</span>
              <span>Target: PKR {goal.target.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartComponentProps {
  data: PieChartData[];
  title: string;
}

export function PieChartComponent({ data, title }: PieChartComponentProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate angles for pie slices
  let currentAngle = 0;
  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const slice = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return slice;
  });

  // Simple SVG pie chart
  const createArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(50, 50, 40, endAngle);
    const end = polarToCartesian(50, 50, 40, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Pie Chart SVG */}
        <div className="flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-48 h-48">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={createArc(slice.startAngle, slice.endAngle)}
                fill={slice.color}
                stroke="white"
                strokeWidth="0.5"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    PKR {item.value.toLocaleString()}
                  </span>
                  <span className="ml-2 text-gray-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
