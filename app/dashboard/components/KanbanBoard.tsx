"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";

export const STATUSES = [
  "applied",
  "interviewing",
  "rejected",
  "selected",
] as const;

export type Job = {
  _id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  jobDescription?: string;
  jobLink?: string;
  notes?: string;
};

export default function KanbanBoard({
  jobs,
  setJobs,
  onUpdate,
}: {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  onUpdate: () => void;
}) {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as string;

    setJobs((prev) =>
      prev.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job
      )
    );

    await fetch(`/api/jobs/${jobId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
      credentials: "include", 
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            jobs={jobs.filter((j) => j.status === status)}
            onDelete={(id) =>
              setJobs((prev) => prev.filter((j) => j._id !== id))
            }
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </DndContext>
  );
}