"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TimeEntry } from "../types/timeEntry"
import { formatDate, formatTime } from "../utils/timeUtils"
import { Pencil, Trash2, Loader2 } from "lucide-react"

interface TimeTableProps {
  entries: TimeEntry[]
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
}

export const TimeTable: React.FC<TimeTableProps> = ({ entries, onEdit, onDelete }) => {
  const [filter, setFilter] = useState("")
  const [sortBy, setSortBy] = useState<keyof TimeEntry>("startTime")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredEntries = entries.filter(
    (entry) =>
      entry.task.toLowerCase().includes(filter.toLowerCase()) ||
      entry.description?.toLowerCase().includes(filter.toLowerCase()),
  )

  const sortedEntries = [...filteredEntries].sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this time entry?")
    if (confirmDelete) {
      setDeletingId(id)
      try {
        await onDelete(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Filter by task or description"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm border-blue-300 focus:ring-blue-500 focus:border-blue-500"
        />
        <Select onValueChange={(value) => setSortBy(value as keyof TimeEntry)}>
          <SelectTrigger className="w-[180px] border-blue-300 focus:ring-blue-500 focus:border-blue-500">
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
          <TableRow className="bg-blue-50">
            <TableHead className="text-blue-600">Task</TableHead>
            <TableHead className="text-blue-600">Description</TableHead>
            <TableHead className="text-blue-600">Start Time</TableHead>
            <TableHead className="text-blue-600">End Time</TableHead>
            <TableHead className="text-blue-600">Duration</TableHead>
            <TableHead className="text-blue-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry) => (
            <TableRow key={entry.id} className="hover:bg-blue-50">
              <TableCell>{entry.task}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{formatDate(new Date(entry.startTime))}</TableCell>
              <TableCell>{formatDate(new Date(entry.endTime))}</TableCell>
              <TableCell>{formatTime(entry.duration)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(entry.id)}
                    className="text-blue-500 hover:text-blue-600 hover:border-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="text-red-500 hover:text-red-600 hover:border-red-600"
                  >
                    {deletingId === entry.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
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

