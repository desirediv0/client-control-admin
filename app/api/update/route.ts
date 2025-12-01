import prisma from "@/db/db.config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, show = false, link } = data;

    const newUpdate = await prisma.update.create({
      data: {
        title,
        show,
        link,
      },
    });

    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error("Error creating update:", error);
    return NextResponse.json(
      { error: "Failed to create update" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const updates = await prisma.update.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error fetching updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}
