"use client";

import { useEffect, useState } from "react";
import KanbanBoard, { Job } from "./components/KanbanBoard";
import CreateJobModal from "./components/CreateJobModal";
import Stats from "./components/Stats";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs", {
      credentials: "include", // Important: send cookies with request
    });
    const data = await res.json();
    setJobs(data.jobs || []);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6 bg-red-300 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Tracker</h1>

        <div className="flex items-center gap-4">
          <CreateJobModal onJobCreated={fetchJobs} />

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="text-sm text-gray-600 hover:text-black"
          >
            Logout
          </button>
        </div>
      </div>

      <Stats jobs={jobs} />

      <KanbanBoard jobs={jobs} setJobs={setJobs} onUpdate={fetchJobs} />
    </div>
  );
}