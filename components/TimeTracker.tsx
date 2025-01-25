import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatTime } from "../utils/timeUtils"
import type { TimeEntry } from "../types/timeEntry"

interface TimeTrackerProps {
  onSave: (entry: Omit<TimeEntry, "id">) => void
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ onSave }) => {
  const [isTracking, setIsTracking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [task, setTask] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const storedState = localStorage.getItem("timeTrackerState")
    if (storedState) {
      const { isTracking, isPaused, task, description, startTime, duration } = JSON.parse(storedState)
      setIsTracking(isTracking)
      setIsPaused(isPaused)
      setTask(task)
      setDescription(description)
      setStartTime(startTime ? new Date(startTime) : null)
      setDuration(duration)
    }
  }, [])

  useEffect(() => {
    const updateTimer = () => {
      if (isTracking && !isPaused && startTime) {
        const now = new Date()
        const elapsedSeconds = Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000)
        setDuration(elapsedSeconds)
      }
    }

    if (isTracking && !isPaused) {
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
  }, [isTracking, isPaused, startTime])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isTracking && !isPaused && startTime) {
        const now = new Date()
        const elapsedSeconds = Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000)
        setDuration(elapsedSeconds)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isTracking, isPaused, startTime])

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
      }),
    )
  }, [isTracking, isPaused, task, description, startTime, duration])

  const handleStart = () => {
    const now = new Date()
    setIsTracking(true)
    setIsPaused(false)
    setStartTime(now)
    setDuration(0)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleContinue = () => {
    setIsPaused(false)
  }

  const handleStop = () => {
    setIsTracking(false)
    setIsPaused(false)
    if (startTime) {
      const endTime = new Date()
      onSave({
        task,
        description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
      })
      setTask("")
      setDescription("")
      setStartTime(null)
      setDuration(0)
      localStorage.removeItem("timeTrackerState")
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-lg">
      <Input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="What are you working on?"
        disabled={isTracking}
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)"
        disabled={isTracking}
      />
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold font-mono">{formatTime(duration)}</span>
        <div className="space-x-2">
          {!isTracking && <Button onClick={handleStart}>Start</Button>}
          {isTracking && !isPaused && <Button onClick={handlePause}>Pause</Button>}
          {isTracking && isPaused && (
            <>
              <Button onClick={handleContinue}>Continue</Button>
              <Button onClick={handleStop} variant="destructive">
                Stop
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

