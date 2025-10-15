/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
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
  Tooltip,
  Rectangle,
  PieChart,
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

//  <div style={{ overflow: 'auto', marginTop: '20px' }}>
//           <div
//             style={{
//               width:
//                 bardata?.length <= 12 && bardata?.length >= 8
//                   ? '900px'
//                   : bardata?.length <= 8 && bardata?.length >= 5
//                     ? '550px'
//                     : bardata?.length <= 4 && bardata?.length >= 1
//                       ? '350px'
//                       : '1000px',
//               height: '400px',
//               margin: 'auto',
//             }}
//           >
//             <ResponsiveContainer>
//               <BarChart data={normalizedData} margin={{ top: 20, bottom: 20 }}>
//                 <CartesianGrid
//                   stroke="#E0E0E0"
//                   strokeDasharray="none"
//                   vertical={false}
//                   horizontal={true}
//                 />
//                 <XAxis
//                   tick={{ fontSize: 14, fontWeight: 300, fill: ' #615E83' }}
//                   dataKey="month"
//                   tickLine={false}
//                 />
//                 <YAxis
//                   tick={{
//                     fontSize: 10,
//                     fontWeight: 300,
//                     display: 'none',
//                     fill: ' #615E83',
//                   }}
//                   //tick={{ fontSize }}
//                   //tickFormatter={CustomTickFormatter}
//                   axisLine={false}
//                   tickCount={4}
//                   //dataKey="name"
//                 />
//                 <Legend content={<CustomLegend />} />
//                 <Bar
//                   dataKey="scaledAmount"
//                   stackId="a"
//                   shape={(props) => (
//                     <CustomBar
//                       {...props}
//                       showRemoveSvg={showAddMoreMonth}
//                       predictive={normalizedData[props.index].predictive}
//                       isHovered={hoveredBar === props.index}
//                       onHover={() => handleHover(props.index)}
//                       onLeave={handleLeave}
//                       handleDeletefunc={() => handleDelete(props.monthInNumber)}
//                       functionToActiveAndDeactivecalenderMonthFunc={() =>
//                         functionToActiveAndDeactivecalenderMonth(
//                           props.monthInNumber,
//                           props.setsofIntervals
//                         )
//                       }
//                       onClick={() => {}}
//                       uv={normalizedData[props.index].uv}
//                       fill={normalizedData[props.index].color}
//                       amount={normalizedData[props.index].amount}
//                     />
//                   )}
//                 />
//                 <Bar
//                   dataKey="uv"
//                   stackId="a"
//                   fill="#ffc86f"
//                   radius={[4, 4, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

export function BarChartComponent({
  data,
  dataset,
  title = "Comparison Chart",
  xAxisLabel,
  yAxisLabel,
}: BarChartComponentProps) {
  const barWidth = 80;
  const chartWidth = Math.max(data.length * barWidth, 400);
  const yAxisWidth = 100;

  return (
    <div className="mb-3">
      <p className="mb-4 text-center" style={{ fontSize: "14px" }}>
        {title}
      </p>
      <div 
        className="bg-white" 
        style={{ 
          height: "400px", 
          display: "flex",
          position: "relative",
          marginLeft: "-40px",
        }}
      >
        {/* Fixed Y-axis container */}
        <div 
          style={{ 
            width: `${yAxisWidth}px`, 
            flexShrink: 0,
            height: "85%",
            background: "white",
            zIndex: 10
          }}
        >
          <ResponsiveContainer width="100%" height="100%" style={{ pointerEvents: "none" }}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 0, bottom: 60, left: 0 }}
            >
              <CartesianGrid
                vertical={false}
                horizontal={true}
                strokeDasharray="none"
                stroke="#e5e5e5"
              />
              <YAxis
                tick={{
                  fontSize: 12,
                  textAnchor: "end",
                  fill: "black",
                  dx: -5,
                  dy: 0,

                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                // rotate={0}
                // interval={0}
                tickCount={6}
                width={yAxisWidth}
              />
              <Bar dataKey="value" fill="transparent" barSize={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scrollable chart container */}
        <div 
          style={{ 
            flex: 1,
            overflowX: "auto", 
            overflowY: "hidden",
            height: "100%",
            marginLeft: "-1px" // Overlap by 1px to hide the gap
          }}
        >
          <div style={{ width: `${chartWidth}px`, height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%" style={{ pointerEvents: "none" }}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 60, left: 0 }}
                // barGap={10}
                barCategoryGap={12}
              >
                <CartesianGrid
                  vertical={false}
                  horizontal={true}
                  strokeDasharray="none"
                  stroke="#e5e5e5"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "black",
                    textAnchor: "middle",
                  }}
                  height={60}
                  interval={0}
                  angle={0}
                  label={
                    xAxisLabel
                      ? {
                          value: xAxisLabel,
                          position: "insideBottom",
                          offset: -5,
                          fontSize: 14,
                        }
                      : undefined
                  }
                />
                <YAxis
                  hide={true}
                  tickFormatter={formatCurrency}
                  tickCount={6}
                />
                <Bar
                  dataKey="value"
                  fill={
                    Array.isArray(dataset[0]?.color)
                      ? dataset[0].color[0]
                      : dataset[0]?.color || "#3b82f6"
                  }
                  radius={[8, 8, 0, 0]}
                  // barSize={50}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    fontSize={11}
                    formatter={(value: any) => {
                      if (value === 0) return "0";
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                      return value.toFixed(0);
                    }}
                    fill="#fff"
                    fontWeight="bold"
                    offset={-15}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
// export function ComparisonBarChart({
//   data,
//   datasets,
//   title = "Comparison Chart",
//   xAxisLabel,
//   yAxisLabel,
// }: ComparisonBarChartProps) {
//   // Calculate dynamic width based on number of categories
//   // Each category gets 150px width to ensure proper spacing and visibility
//   const chartWidth = Math.max(600, data.length * 150);

//   return (
//     <section style={{ width: "100%" }}>
//       <div className="mb-3">
//         <p className="mb-4 text-center" style={{ fontSize: "14px" }}>
//           {title}
//         </p>
//         {/* Flex container to keep Y-axis fixed */}
//         <div className="bg-white rounded-lg h-72 mb-0 flex">
//           {/* Fixed Y-axis container */}
//           <div style={{ width: "80px", flexShrink: 0 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={data}
//                 style={{ pointerEvents: "none" }}
//                 margin={{ left: 10, right: 0, top: 5, bottom: 20 }}
//               >
//                 <YAxis
//                   tick={{
//                     fontSize: 12,
//                     textAnchor: "end",
//                     fill: "black",
//                   }}
//                   tickLine={false}
//                   axisLine={false}
//                   tickFormatter={formatCurrency}
//                   tickCount={6}
//                   width={60}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Scrollable chart container */}
//           <div className="overflow-x-auto flex-1">
//             <div style={{ width: `${chartWidth}px`, height: "100%" }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={data}
//                   style={{ pointerEvents: "none" }}
//                   margin={{ left: 0, right: 20, top: 5, bottom: 20 }}
//                 >
//                   <CartesianGrid
//                     vertical={false}
//                     horizontal={true}
//                     strokeDasharray="0"
//                     stroke="#e5e5e5"
//                   />
//                   <XAxis
//                     dataKey="name"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fontSize: 11 }}
//                     interval={0}
//                     label={{
//                       value: xAxisLabel,
//                       position: "insideBottom",
//                       offset: -5,
//                       fontSize: 14,
//                     }}
//                   />
//                   {/* Hidden Y-axis to maintain proper spacing */}
//                   <YAxis
//                     tick={false}
//                     tickLine={false}
//                     axisLine={false}
//                     width={0}
//                     tickFormatter={formatCurrency}
//                     tickCount={6}
//                   />
//                   <Legend
//                     wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
//                     iconType="rect"
//                     iconSize={12}
//                   />

//                   {datasets.map((dataset, index) => (
//                     <Bar
//                       key={index}
//                       dataKey={dataset.label}
//                       fill={
//                         Array.isArray(dataset.color)
//                           ? dataset.color[0]
//                           : dataset.color
//                       }
//                       radius={[8, 8, 0, 0]}
//                       barSize={40}
//                     >
//                       <LabelList
//                         dataKey={dataset.label}
//                         position="insideTop"
//                         fontSize={11}
//                         formatter={(value) => `${(Number(value) / 1000).toFixed(0)}k`}
//                         fill="#fff"
//                         fontWeight="bold"
//                         dy={8}
//                       />
//                     </Bar>
//                   ))}
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

export function ComparisonBarChart({
  data,
  datasets,
  title = "Comparison Chart",
  xAxisLabel,
  yAxisLabel,
}: ComparisonBarChartProps) {
  // Calculate dynamic width based on number of categories
  // Each category needs adequate space for grouped bars
  const barGroupWidth = 120; // Space per category group
  const chartWidth = Math.max(400, data.length * barGroupWidth);

  // Calculate max value across all datasets for consistent Y-axis
  const maxValue = Math.max(
    ...data.map((item) =>
      Math.max(...datasets.map((dataset) => Number(item[dataset.label]) || 0))
    )
  );

  // Add padding to max value (10% extra space on top)
  const yAxisMax = Math.ceil(maxValue * 1.1);

  return (
    <section style={{ width: "100%" }}>
      <div className="mb-3">
        <p
          className="mb-4 text-center font-medium"
          style={{ fontSize: "14px" }}
        >
          {title}
        </p>

        {/* Main chart container */}
        <div className="bg-white rounded-lg mb-0" style={{ height: "320px" }}>
          <div className="flex h-full">
            {/* Fixed Y-axis container - optimized width */}
            <div style={{ width: "50px", flexShrink: 0, paddingTop: "5px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ left: 0, right: 0, top: 5, bottom: 40 }}
                >
                  <CartesianGrid
                    vertical={false}
                    horizontal={true}
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                      textAnchor: "end",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatCurrency}
                    domain={[0, yAxisMax]}
                    tickCount={6}
                    width={45}
                  />
                  {/* Invisible bars to maintain scale */}
                  {datasets.map((dataset, index) => (
                    <Bar
                      key={`invisible-${index}`}
                      dataKey={dataset.label}
                      fill="transparent"
                      barSize={0}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Scrollable chart area */}
            <div
              className="overflow-x-auto flex-1"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 #f1f5f9",
              }}
            >
              <div style={{ width: `${chartWidth}px`, height: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ left: 10, right: 20, top: 5, bottom: 40 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      horizontal={true}
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#6b7280",
                      }}
                      interval={0}
                      height={60}
                      label={
                        xAxisLabel
                          ? {
                              value: xAxisLabel,
                              position: "insideBottom",
                              offset: -10,
                              fontSize: 12,
                              fill: "#374151",
                            }
                          : undefined
                      }
                    />
                    {/* Hidden Y-axis for alignment */}
                    <YAxis hide domain={[0, yAxisMax]} tickCount={6} />
                    <Legend
                      wrapperStyle={{
                        fontSize: "11px",
                        paddingTop: "15px",
                        color: "#374151",
                      }}
                      iconType="rect"
                      iconSize={10}
                    />

                    {datasets.map((dataset, index) => (
                      <Bar
                        key={`bar-${index}`}
                        dataKey={dataset.label}
                        fill={
                          Array.isArray(dataset.color)
                            ? dataset.color[0]
                            : dataset.color
                        }
                        radius={[6, 6, 0, 0]}
                        barSize={35}
                      >
                        <LabelList
                          dataKey={dataset.label}
                          position="top"
                          fontSize={10}
                          formatter={(value: any) => {
                            if (value === 0) return "0";
                            if (value >= 1000)
                              return `${(value / 1000).toFixed(0)}k`;
                            return value.toFixed(0);
                          }}
                          fill="#374151"
                          fontWeight="600"
                          offset={5}
                        />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      {/* <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style> */}
    </section>
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
                  <th
                    key={index}
                    className={`px-4 py-2 text-center ${
                      index === 0 ? "sticky left-0 z-20 bg-gray-100" : ""
                    }`}
                    style={{ fontSize: "14px" }}
                  >
                    {col}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data?.rows?.map((outerRow, rowIndex) => {
              return (
                <tr key={rowIndex} className="border-b border-black">
                  {outerRow.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-4 py-2 text-center ${
                        colIndex === 0 ? "sticky left-0 z-20 bg-white" : ""
                      }`}
                      style={{ fontSize: "14px" }}
                    >
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
              <span className="font-medium" style={{ fontSize: "14px" }}>
                {goal.label}
              </span>
              <span className=" text-gray-600" style={{ fontSize: "14px" }}>
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
            <div
              className="flex justify-between text-gray-500"
              style={{ fontSize: "14px" }}
            >
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
                  <span style={{ fontSize: "14px" }}>{item.name}</span>
                </div>
                <div className=" text-gray-600" style={{ fontSize: "14px" }}>
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
