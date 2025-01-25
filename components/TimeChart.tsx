import type React from "react"
import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TimeEntry } from "@/types/timeEntry"
import { formatDate, formatTime } from "@/utils/timeUtils"

interface TimeChartProps {
  entries: TimeEntry[]
}

type ChartData = {
  date: string
  duration: number
}

export const TimeChart: React.FC<TimeChartProps> = ({ entries }) => {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day")

  const chartData = useMemo(() => {
    const data: { [key: string]: ChartData } = {}

    entries.forEach((entry) => {
      const date = formatDate(new Date(entry.startTime))
      if (!data[date]) {
        data[date] = { date, duration: 0 }
      }
      data[date].duration += entry.duration
    })

    return Object.values(data)
  }, [entries])

  return (
    <div className="space-y-4">
      <Select onValueChange={(value) => setPeriod(value as "day" | "week" | "month")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Daily</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
        </SelectContent>
      </Select>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ value }: any) => (
              <div>
                <strong>{formatDate(new Date(value?.date))}</strong>
                <br />
                Duration: {formatTime(value.duration)}
              </div>
            )}
          />
          <Bar dataKey="duration" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

