import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { scenarios } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    await seedDatabase();
    const allScenarios = await db.select().from(scenarios).orderBy(desc(scenarios.createdAt));
    return NextResponse.json({ success: true, data: allScenarios });
  } catch (error: any) {
    console.error("Error fetching scenarios:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      scenarioType = "custom",
      loanGrowth,
      nim,
      creditCostBps,
      costToIncome,
      exitPbMultiple,
      horizonYears = 3,
      transactionCostBps = 25,
      projectedPat,
      projectedBvps,
      targetPrice,
      upsidePercent,
      notes,
      createdBy = "Institutional Analyst",
    } = body;

    if (!name || loanGrowth === undefined || nim === undefined) {
      return NextResponse.json({ success: false, error: "Missing required scenario parameters" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(scenarios)
      .values({
        name,
        scenarioType,
        loanGrowth: Number(loanGrowth),
        nim: Number(nim),
        creditCostBps: Number(creditCostBps),
        costToIncome: Number(costToIncome),
        exitPbMultiple: Number(exitPbMultiple),
        horizonYears: Number(horizonYears),
        transactionCostBps: Number(transactionCostBps),
        projectedPat: projectedPat ? Number(projectedPat) : null,
        projectedBvps: projectedBvps ? Number(projectedBvps) : null,
        targetPrice: targetPrice ? Number(targetPrice) : null,
        upsidePercent: upsidePercent ? Number(upsidePercent) : null,
        notes: notes || "User-defined institutional scenario assumption.",
        createdBy,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted });
  } catch (error: any) {
    console.error("Error creating scenario:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing scenario ID" }, { status: 400 });
    }

    await db.delete(scenarios).where(eq(scenarios.id, Number(id)));
    return NextResponse.json({ success: true, message: `Scenario ${id} deleted` });
  } catch (error: any) {
    console.error("Error deleting scenario:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
