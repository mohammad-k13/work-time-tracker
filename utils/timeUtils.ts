import type {TimeEntry} from "../types/timeEntry"

export const saveEntries = (entries: TimeEntry[]) => {
  localStorage.setItem("timeEntries", JSON.stringify(entries))
}

export const loadEntries = (): TimeEntry[] => {
  const storedEntries = localStorage.getItem("timeEntries")
  return storedEntries ? JSON.parse(storedEntries) : []
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export const calculateElapsedTime = (startTime: string, currentTime: number): number => {
  const start = new Date(startTime).getTime()
  return Math.floor((currentTime - start) / 1000)
}

