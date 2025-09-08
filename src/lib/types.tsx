export interface Message {
  id: number
  type: "text" | "table" | "line-chart" | "bar-chart" | "loading"
  content?: string
  isUser: boolean
}

export interface ChartData {
  name: string
  value: number
}

export interface TableData {
  [key: string]: string | number | boolean
}
