"use client";

import { useEffect, useState } from "react";
import KanbanBoard, { Job } from "./components/KanbanBoard";
import CreateJobModal from "./components/CreateJobModal";
import Stats from "./components/Stats";
import Image from "next/image";
import logo from "@/public/briefcase.png";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs", {
      credentials: "include",
    });
    const data = await res.json();
    setJobs(data.jobs || []);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6
    bg-[linear-gradient(to_right,#dbeafe,#fef9c3,#fee2e2,#dcfce7)]
    min-h-[calc(100vh-2.5rem)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Image src={logo} height={40} width={40} alt="logo" />
          <h1 className="text-3xl font-bold">Career Cloud</h1>
        </div>

        <div className="flex items-center gap-4">
          <CreateJobModal onJobCreated={fetchJobs} />

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="text-sm cursor-pointer bg-black text-white px-4 py-2.5 rounded-sm hover:bg-gray-800"
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