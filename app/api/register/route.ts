import { NextResponse } from "next/server";
import { Client } from "pg";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const SALT_ROUNDS = 10;

async function executeQuery(client: Client, query: string, params: any[] = []) {
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  const {
    name,
    email,
    password,
    databaseUrl,
    role = "Admin",
  } = await req.json();

  if (!databaseUrl) {
    return NextResponse.json(
      { error: "Database URL is required" },
      { status: 400 }
    );
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();

    const existingUsers = await executeQuery(
      client,
      `SELECT * FROM "users" WHERE email = $1`,
      [email]
    );
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = uuidv4();
    const currentTime = new Date();

    const [user] = await executeQuery(
      client,
      `INSERT INTO "users" (id, email, name, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, email, name, hashedPassword, role, currentTime, currentTime]
    );

    await ensureDefaultData(client);

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

async function ensureDefaultData(client: Client) {
  // Ensure UserLimit exists
  const userLimitExists = await executeQuery(
    client,
    `SELECT * FROM "UserLimit" LIMIT 1`
  );
  if (userLimitExists.length === 0) {
    await executeQuery(
      client,
      `INSERT INTO "UserLimit" (id, maxRole) VALUES ($1, $2)`,
      [uuidv4(), 6]
    );
  }

  // Ensure Active status exists
  const activeStatusExists = await executeQuery(
    client,
    `SELECT * FROM "Active" LIMIT 1`
  );
  if (activeStatusExists.length === 0) {
    await executeQuery(
      client,
      `INSERT INTO "Active" (id, status) VALUES ($1, $2)`,
      [uuidv4(), true]
    );
  }

  // Ensure default Category exists
  const defaultCategoryExists = await executeQuery(
    client,
    `SELECT * FROM "categories" WHERE name = $1 LIMIT 1`,
    ["Uncategorized"]
  );
  if (defaultCategoryExists.length === 0) {
    await executeQuery(
      client,
      `INSERT INTO "categories" (id, name) VALUES ($1, $2)`,
      [uuidv4(), "Uncategorized"]
    );
  }
}
