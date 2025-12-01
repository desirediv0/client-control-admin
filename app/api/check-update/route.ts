import prisma from "@/db/db.config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const updates = await prisma.update.findMany({
      where: {
        show: true,
      },
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
