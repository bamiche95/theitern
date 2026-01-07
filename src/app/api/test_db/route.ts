import { NextResponse } from "next/server";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    // rows will be typed correctly as an array of RowDataPacket
    const [rows] = await db.query<RowDataPacket[]>("SELECT NOW() AS now");

    // Access the property, cast to string
    const dbTime = (rows[0] as { now: string }).now;

    return NextResponse.json({ dbTime });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
