//src\app\api\upload\logo\route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { requireAdmin } from "@/lib/middleware";

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.json();
    const { file, fileName } = formData; // Expecting base64 data for simplicity

    const buffer = Buffer.from(file.split(",")[1], "base64");
    const path = join(process.cwd(), "public/uploads", fileName);
    
    await writeFile(path, buffer);
    
    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}