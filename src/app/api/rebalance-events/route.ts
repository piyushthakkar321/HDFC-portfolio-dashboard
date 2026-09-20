import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rebalanceEvents } from "@/db/schema";
import { desc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    await seedDatabase();
    const events = await db.select().from(rebalanceEvents).orderBy(desc(rebalanceEvents.createdAt));
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    console.error("Error fetching rebalance events:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventDate = new Date().toISOString().split("T")[0],
      strategy = "Active Bank Alpha",
      triggerType = "Manual Rebalance",
      assetTraded = "HDFCBANK.NS",
      action = "REBALANCE",
      weightBefore = 32.5,
      weightAfter = 34.0,
      turnoverPct = 1.5,
      costBps = 25.0,
      realizedFrictionInr = 37500,
    } = body;

    const [inserted] = await db
      .insert(rebalanceEvents)
      .values({
        eventDate,
        strategy,
        triggerType,
        assetTraded,
        action,
        weightBefore: Number(weightBefore),
        weightAfter: Number(weightAfter),
        turnoverPct: Number(turnoverPct),
        costBps: Number(costBps),
        realizedFrictionInr: Number(realizedFrictionInr),
        status: "Executed",
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    console.error("Error logging rebalance event:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
