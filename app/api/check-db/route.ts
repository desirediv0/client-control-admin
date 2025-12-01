// app/api/check-db/route.ts
import { Pool } from "pg";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let pool: Pool | null = null;
  try {
    const { databaseUrl } = await request.json();

    if (!databaseUrl) {
      return NextResponse.json(
        { success: false, message: "Database URL is required" },
        { status: 400 }
      );
    }

    // Validate database URL format
    if (
      typeof databaseUrl !== "string" ||
      !databaseUrl.startsWith("postgres")
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid database URL format" },
        { status: 400 }
      );
    }

    // Check if it's a Neon database (requires SSL)
    const isNeonDatabase =
      databaseUrl.includes("neon.tech") ||
      databaseUrl.includes("neondb") ||
      databaseUrl.includes("neon");

    const isDevelopment = process.env.NODE_ENV !== "production";

    // Configure SSL - Neon databases always require SSL
    const sslConfig = isNeonDatabase
      ? { rejectUnauthorized: false } // Neon uses valid certificates, but we don't verify in dev
      : isDevelopment
      ? { rejectUnauthorized: false }
      : { rejectUnauthorized: true };

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: sslConfig,
      connectionTimeoutMillis: 10000, // 10 second timeout
      query_timeout: 5000, // 5 second query timeout
    });

    const client = await pool.connect();

    // Test the connection with a simple query
    await client.query("SELECT 1");

    await client.release();
    await pool.end();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
    });
  } catch (error: any) {
    // Ensure pool is closed even on error
    if (pool) {
      try {
        await pool.end();
      } catch (closeError) {
        // Ignore close errors
      }
    }

    console.error("Database connection error:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to connect to database";
    if (error?.code === "28P01") {
      errorMessage =
        "Password authentication failed. Please check your database credentials.";
    } else if (error?.code === "ENOTFOUND" || error?.code === "ECONNREFUSED") {
      errorMessage =
        "Cannot reach database server. Please check the host and port.";
    } else if (error?.code === "ETIMEDOUT") {
      errorMessage =
        "Connection timeout. Please check your network connection.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
