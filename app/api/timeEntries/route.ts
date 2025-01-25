import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const entries = await prisma.timeEntry.findMany()
  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  const data = await request.json()
  const entry = await prisma.timeEntry.create({
    data: {
      task: data.task,
      description: data.description,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      duration: data.duration,
    },
  })
  return NextResponse.json(entry)
}

