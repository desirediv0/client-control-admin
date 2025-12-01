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
  } catch (error: any) {
    // Handle case where Update table doesn't exist in database
    if (error?.code === "P2021" || error?.message?.includes("does not exist")) {
      console.warn(
        "Update table does not exist in database. Returning empty array."
      );
      return NextResponse.json([]);
    }
    console.error("Error fetching updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}
