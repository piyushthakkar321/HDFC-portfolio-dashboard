import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { committeeNotes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    await seedDatabase();
    const notes = await db.select().from(committeeNotes).orderBy(desc(committeeNotes.createdAt));
    return NextResponse.json({ success: true, data: notes });
  } catch (error: any) {
    console.error("Error fetching committee notes:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      author,
      role,
      category,
      title,
      content,
      recommendation = "OVERWEIGHT",
      targetAllocationPct = 32.5,
      classification = "INTERPRETATION",
    } = body;

    if (!author || !title || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(committeeNotes)
      .values({
        author,
        role: role || "Research Analyst",
        category: category || "fundamental",
        title,
        content,
        recommendation,
        targetAllocationPct: Number(targetAllocationPct),
        status: "approved",
        classification,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    console.error("Error creating committee note:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
