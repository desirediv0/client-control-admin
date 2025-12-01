import prisma from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await request.json();

    const updatedUpdate = await prisma.update.update({
      where: { id },
      data: {
        title: data.title,
        link: data.link,
        show: data.show,
      },
    });

    return NextResponse.json(updatedUpdate);
  } catch (error) {
    console.error("Error updating update:", error);
    return NextResponse.json(
      { error: "Failed to update update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.update.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Update deleted successfully" });
  } catch (error) {
    console.error("Error deleting update:", error);
    return NextResponse.json(
      { error: "Failed to delete update" },
      { status: 500 }
    );
  }
}
