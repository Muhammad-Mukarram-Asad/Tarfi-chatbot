import type { TableData } from "@/lib/types"

interface DataTableProps {
  data: TableData[]
  title?: string
}

export function DataTable({ data, title = "Financial Data Breakdown" }: DataTableProps) {
  const sampleData = [
    { label: "Revenue", value: "$8,200.00" },
    { label: "Expenses", value: "$3,150.00" },
    { label: "Net Income", value: "$5,050.00" },
    { label: "Margin", value: "61.6%" },
    { label: "Total Assets", value: "$45,200.00", isTotal: true },
  ]

  return (
    <div className="space-y-3">
      <p className="text-sm mb-3">{title}</p>
      <div className="bg-white/10 rounded-lg p-3 space-y-2">
        {sampleData.map((item, index) => (
          <div key={index}>
            {item.isTotal && <hr className="border-white/20 mb-2" />}
            <div className={`flex justify-between text-xs ${item.isTotal ? "font-medium" : ""}`}>
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
