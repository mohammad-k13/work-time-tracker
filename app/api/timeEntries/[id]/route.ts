import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, context: any) {
  const { params } = context; // Accessing params from context
  const data = await request.json();

  const entry = await prisma.timeEntry.update({
    where: { id: params.id },
    data: {
      task: data.task,
      description: data.description,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      duration: data.duration,
    },
  });

  return NextResponse.json(entry);
}

export async function DELETE(request: Request, context: any) {
  const { params } = context; // Accessing params from context

  await prisma.timeEntry.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Entry deleted" });
}
