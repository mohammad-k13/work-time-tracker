"use client"

import React, {useState, useEffect} from "react"
import {v4 as uuidv4} from "uuid"
import {TimeTracker} from "../components/TimeTracker"
import {TimeTable} from "../components/TimeTable"
import {TimeChart} from "../components/TimeChart"
import type {TimeEntry} from "../types/timeEntry"
import {saveEntries, loadEntries} from "../utils/timeUtils"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {CustomPeriodStats} from "../components/CustomPeriodStats"

export default function Home() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)

  useEffect(() => {
    setEntries(loadEntries())
  }, [])

  const handleSave = (entry: Omit<TimeEntry, "id">) => {
    const newEntry = {...entry, id: uuidv4()}
    const updatedEntries = [...entries, newEntry]
    setEntries(updatedEntries)
    saveEntries(updatedEntries)
  }

  const handleEdit = (id: string) => {
    const entryToEdit = entries.find((entry) => entry.id === id)
    if (entryToEdit) {
      setEditingEntry(entryToEdit)
    }
  }

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    saveEntries(updatedEntries)
  }

  const handleUpdateEntry = (updatedEntry: TimeEntry) => {
    const updatedEntries = entries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    setEntries(updatedEntries)
    saveEntries(updatedEntries)
    setEditingEntry(null)
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Time Tracker App</h1>
      <TimeTracker onSave={handleSave}/>
      <TimeTable entries={entries} onEdit={handleEdit} onDelete={handleDelete}/>
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
                  onChange={(e) => setEditingEntry({...editingEntry, task: e.target.value})}
                  placeholder="Task"
                />
                <Textarea
                  value={editingEntry.description}
                  onChange={(e) => setEditingEntry({...editingEntry, description: e.target.value})}
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
      {/*  <CustomPeriodStats entries={entries}/>*/}
      {/*</div>*/}
    </main>
  )
}

