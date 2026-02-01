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

  // Define status colors
  const statusColors: Record<string, string> = {
    applied: "bg-blue-50 border-blue-200",
    interviewing: "bg-yellow-50 border-yellow-200",
    selected: "bg-green-50 border-green-200",
    rejected: "bg-red-50 border-red-200",
  };

  const statusTextColors: Record<string, string> = {
    applied: "text-blue-700",
    interviewing: "text-yellow-700",
    selected: "text-green-700",
    rejected: "text-red-700",
  };

  return (
    <div className={`${statusColors[status] || "bg-gray-50"} border-2 p-3 rounded-lg h-[calc(100vh-280px)] flex flex-col shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h2 className={`font-bold capitalize ${statusTextColors[status] || "text-gray-700"}`}>
          {status}
        </h2>
        <span className="text-xs bg-white px-2 py-1 rounded-full font-medium text-gray-600">
          {jobs.length}
        </span>
      </div>

      {/* Scrollable Job Cards */}
      <div 
        ref={setNodeRef}
        className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar"
      >
        {jobs.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            No jobs yet
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}