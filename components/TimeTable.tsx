import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TimeEntry } from "@/types/timeEntry"
import { formatDate, formatTime } from "@/utils/timeUtils"
import { Pencil, Trash2 } from "lucide-react"

interface TimeTableProps {
  entries: TimeEntry[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const TimeTable: React.FC<TimeTableProps> = ({ entries, onEdit, onDelete }) => {
  const [filter, setFilter] = useState("")
  const [sortBy, setSortBy] = useState<keyof TimeEntry>("startTime")

  const filteredEntries = entries.filter(
    (entry) =>
      entry.task.toLowerCase().includes(filter.toLowerCase()) ||
      entry.description.toLowerCase().includes(filter.toLowerCase()),
  )

  const sortedEntries = [...filteredEntries].sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Filter by task or description"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={(value) => setSortBy(value as keyof TimeEntry)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="startTime">Start Time</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.task}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{formatDate(new Date(entry.startTime))}</TableCell>
              <TableCell>{formatDate(new Date(entry.endTime))}</TableCell>
              <TableCell>{formatTime(entry.duration)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(entry.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onDelete(entry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

