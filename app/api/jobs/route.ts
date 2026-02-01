import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Job } from "@/models/Job";
import { getUserIdFromRequest } from "@/lib/auth";
import { z } from "zod";

const createJobSchema = z.object({
  companyName: z.string().min(1),
  jobTitle: z.string().min(1),
  jobDescription: z.string().optional(),
  jobLink: z.string().url().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(); 

    const jobs = await Job.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ jobs });
  } catch (err: any) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getUserIdFromRequest(); 

    const body = await req.json();
    const data = createJobSchema.parse(body);

    const job = await Job.create({
      ...data,
      userId,
      status: "applied",
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Failed to create job" },
      { status: 400 }
    );
  }
}