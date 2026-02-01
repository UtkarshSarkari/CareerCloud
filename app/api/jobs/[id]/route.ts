import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/Job";
import { getUserIdFromRequest } from "@/lib/auth";
import { z } from "zod";

const updateJobSchema = z.object({
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  jobDescription: z.string().optional(),
  jobLink: z.string().url().optional(),
  notes: z.string().optional(),
  status: z.enum(["applied", "interviewing", "rejected", "selected"]).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(); // ✅ FIXED: Added await
    const { id } = await params; // ✅ FIXED: Await params

    const body = await req.json();
    const data = updateJobSchema.parse(body);

    const job = await Job.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err: any) {
    console.error("❌ PUT /api/jobs/[id] error:", err.message);
    return NextResponse.json(
      { message: err?.message || "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(); // ✅ FIXED: Added await
    const { id } = await params; // ✅ FIXED: Await params

    const job = await Job.findOneAndDelete({ _id: id, userId });

    if (!job) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    console.error("❌ DELETE /api/jobs/[id] error:", err.message);
    return NextResponse.json({ message: "Delete failed" }, { status: 400 });
  }
}