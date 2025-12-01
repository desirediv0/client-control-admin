// pages/api/check-api-status.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

async function getPool(databaseUrl: string) {
  return new Pool({
    connectionString: databaseUrl,
  });
}

export async function POST(req: NextRequest) {
  const { databaseUrl } = await req.json();

  if (!databaseUrl) {
    return NextResponse.json(
      { message: "Database URL is required" },
      { status: 400 }
    );
  }

  const pool = await getPool(databaseUrl);

  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT status FROM "Active" LIMIT 1');
      const status = result.rows[0]?.status;

      if (status !== undefined) {
        return NextResponse.json({ status }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "No active status found" },
          { status: 404 }
        );
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error querying Active model:", error);
    return NextResponse.json(
      { message: "Error checking API status", error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}

export async function PUT(req: NextRequest) {
  const { databaseUrl } = await req.json();

  if (!databaseUrl) {
    return NextResponse.json(
      { message: "Database URL is required" },
      { status: 400 }
    );
  }

  const pool = await getPool(databaseUrl);

  try {
    const client = await pool.connect();
    try {
      // First, get the current status
      const getCurrentStatus = await client.query(
        'SELECT status FROM "Active" LIMIT 1'
      );
      const currentStatus = getCurrentStatus.rows[0]?.status;

      if (currentStatus === undefined) {
        return NextResponse.json(
          { message: "No active status found" },
          { status: 404 }
        );
      }

      // Toggle the status
      const newStatus = !currentStatus;

      // Update the status in the database
      const updateResult = await client.query(
        'UPDATE "Active" SET status = $1 RETURNING status',
        [newStatus]
      );

      const updatedStatus = updateResult.rows[0]?.status;

      return NextResponse.json({ status: updatedStatus }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating Active model:", error);
    return NextResponse.json(
      { message: "Error updating API status", error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
