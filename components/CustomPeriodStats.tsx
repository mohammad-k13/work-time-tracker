import type React from "react"
import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {DatePicker} from "@/components/ui/date-picker"
import {formatTime} from "../utils/timeUtils"
import type {TimeEntry} from "../types/timeEntry"

interface CustomPeriodStatsProps {
  entries: TimeEntry[]
}

export const CustomPeriodStats: React.FC<CustomPeriodStatsProps> = ({entries}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [hourlyRate, setHourlyRate] = useState<number>(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  const calculateStats = () => {
    if (startDate && endDate) {
      const filteredEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.startTime)
        return entryDate >= startDate && entryDate <= endDate
      })

      const totalSeconds = filteredEntries.reduce((acc, entry) => acc + entry.duration, 0)
      setTotalDuration(totalSeconds)

      const totalHours = totalSeconds / 3600
      setTotalIncome(totalHours * hourlyRate)
    }
  }

  // @ts-ignore
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Calculate Custom Period Stats</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Custom Period Statistics</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              {/*<DatePicker />*/}
            </div>
            <div className="flex flex-col gap-2">
              {/*<Label htmlFor="end-date">End Date</Label>*/}
              {/*<DatePicker id="end-date" selected={endDate} onSelect={setEndDate} placeholder="Select end date"/>*/}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
            <Input
              id="hourly-rate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              placeholder="Enter hourly rate"
            />
          </div>
          <Button onClick={calculateStats}>Calculate</Button>
          {totalDuration > 0 && (
            <div className="space-y-2">
              <p>Total Duration: {formatTime(totalDuration)}</p>
              <p>Total Income: ${totalIncome.toFixed(2)}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

