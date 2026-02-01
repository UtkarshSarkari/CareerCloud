"use client";

import { useDroppable } from "@dnd-kit/core";
import JobCard from "./JobCard";
import { Job } from "./KanbanBoard";

export default function Column({
  status,
  jobs,
  onDelete,
  onUpdate,
}: {
  status: string;
  jobs: Job[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-3 rounded min-h-[500px]">
      <h2 className="font-bold capitalize mb-3">{status}</h2>

      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}