import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/Job";
import { getUserIdFromRequest } from "@/lib/auth";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["applied", "interviewing", "rejected", "selected"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(); // ✅ FIXED: Added await
    const { id } = await params; // ✅ FIXED: Await params

    const body = await req.json();
    const { status } = statusSchema.parse(body);

    const job = await Job.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status } },
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err: any) {
    console.error("❌ PATCH /api/jobs/[id]/status error:", err.message);
    return NextResponse.json(
      { message: err?.message || "Status update failed" },
      { status: 400 }
    );
  }
}