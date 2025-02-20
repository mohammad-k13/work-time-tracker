"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatTime } from "../utils/timeUtils"
import type { TimeEntry } from "../types/timeEntry"
import { Loader2 } from "lucide-react"

interface TimeTrackerProps {
  onSave: (entry: Omit<TimeEntry, "id">) => Promise<void>
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ onSave }) => {
  const [isTracking, setIsTracking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [task, setTask] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [accumulatedDuration, setAccumulatedDuration] = useState(0)

  useEffect(() => {
    const storedState = localStorage.getItem("timeTrackerState")
    if (storedState) {
      const { isTracking, isPaused, task, description, startTime, duration, accumulatedDuration } =
        JSON.parse(storedState)
      setIsTracking(isTracking)
      setIsPaused(isPaused)
      setTask(task)
      setDescription(description)
      setStartTime(startTime ? new Date(startTime) : null)
      setDuration(isTracking ? duration : 0)
      setAccumulatedDuration(accumulatedDuration || 0)
    }
  }, [])

  useEffect(() => {
    const updateTimer = () => {
      if (isTracking && !isPaused && startTime) {
        const now = new Date()
        const elapsedSeconds = Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000)
        setDuration(accumulatedDuration + elapsedSeconds)
      }
    }

    if (isTracking && !isPaused) {
      updateTimer() // Update immediately
      intervalRef.current = setInterval(updateTimer, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTracking, isPaused, startTime, accumulatedDuration])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isTracking && !isPaused && startTime) {
        const now = new Date()
        const elapsedSeconds = Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000)
        setDuration(accumulatedDuration + elapsedSeconds)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isTracking, isPaused, startTime, accumulatedDuration])

  useEffect(() => {
    localStorage.setItem(
      "timeTrackerState",
      JSON.stringify({
        isTracking,
        isPaused,
        task,
        description,
        startTime: startTime?.toISOString(),
        duration,
        accumulatedDuration,
      }),
    )
  }, [isTracking, isPaused, task, description, startTime, duration, accumulatedDuration])

  const handleStart = () => {
    const now = new Date()
    setIsTracking(true)
    setIsPaused(false)
    setStartTime(now)
    setDuration(0)
    setAccumulatedDuration(0)
  }

  const handlePause = () => {
    setIsPaused(true)
    setAccumulatedDuration(duration)
  }

  const handleContinue = () => {
    setIsPaused(false)
    setStartTime(new Date())
  }

  const handleStop = async () => {
    setIsTracking(false)
    setIsPaused(false)
    if (startTime) {
      const endTime = new Date()
      setIsSaving(true)
      try {
        await onSave({
          task,
          description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration,
        })
      } finally {
        setIsSaving(false)
      }
      setTask("")
      setDescription("")
      setStartTime(null)
      setDuration(0)
      setAccumulatedDuration(0)
      localStorage.removeItem("timeTrackerState")
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-6 border rounded-lg bg-white shadow-lg">
      <Input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="What are you working on?"
        disabled={isTracking}
        className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)"
        disabled={isTracking}
        className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
        <span className="text-3xl font-bold font-mono text-blue-600">{formatTime(duration)}</span>
        <div className="space-x-2">
          {!isTracking && (
            <Button onClick={handleStart} className="bg-green-500 hover:bg-green-600">
              Start
            </Button>
          )}
          {isTracking && !isPaused && (
            <Button onClick={handlePause} className="bg-yellow-500 hover:bg-yellow-600">
              Pause
            </Button>
          )}
          {isTracking && isPaused && (
            <>
              <Button onClick={handleContinue} className="bg-blue-500 hover:bg-blue-600">
                Continue
              </Button>
              <Button onClick={handleStop} variant="destructive" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Stop
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

