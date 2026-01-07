import { NextResponse } from "next/server";
import { getSiteFeatures } from "@/lib/settings";

export async function GET() {
  try {
    const features = await getSiteFeatures();
    return NextResponse.json(features);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 });
  }
}