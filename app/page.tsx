"use client"

import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { TimeTracker } from "../components/TimeTracker"
import { TimeTable } from "../components/TimeTable"
import { TimeChart } from "../components/TimeChart"
import type { TimeEntry } from "../types/timeEntry"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CustomPeriodStats } from "../components/CustomPeriodStats"

export default function Home() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    const response = await fetch("/api/timeEntries")
    const data = await response.json()
    setEntries(data)
  }

  const handleSave = async (entry: Omit<TimeEntry, "id">) => {
    const response = await fetch("/api/timeEntries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })
    const savedEntry = await response.json()
    setEntries([...entries, savedEntry])
  }

  const handleEdit = (id: string) => {
    const entryToEdit = entries.find((entry) => entry.id === id)
    if (entryToEdit) {
      setEditingEntry(entryToEdit)
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/timeEntries/${id}`, {
      method: "DELETE",
    })
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const handleUpdateEntry = async (updatedEntry: TimeEntry) => {
    const response = await fetch(`/api/timeEntries/${updatedEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEntry),
    })
    const updated = await response.json()
    setEntries(entries.map((entry) => (entry.id === updated.id ? updated : entry)))
    setEditingEntry(null)
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Time Tracker App</h1>
      <TimeTracker onSave={handleSave} />
      <TimeTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
      {/*<TimeChart entries={entries} />*/}

      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdateEntry(editingEntry)
              }}
            >
              <div className="space-y-4">
                <Input
                  value={editingEntry.task}
                  onChange={(e) => setEditingEntry({ ...editingEntry, task: e.target.value })}
                  placeholder="Task"
                />
                <Textarea
                  value={editingEntry.description || ""}
                  onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })}
                  placeholder="Description"
                />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {/*<div className="flex justify-end">*/}
      {/*  <CustomPeriodStats entries={entries} />*/}
      {/*</div>*/}
    </main>
  )
}

