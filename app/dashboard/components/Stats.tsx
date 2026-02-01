"use client";

import { Job } from "./KanbanBoard";

export default function Stats({ jobs }: { jobs: Job[] }) {
  const count = (status: string) =>
    jobs.filter((j) => j.status === status).length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="Applied" value={count("applied")} />
      <StatCard title="Interviewing" value={count("interviewing")} />
      <StatCard title="Selected" value={count("selected")} />
      <StatCard title="Rejected" value={count("rejected")} />
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
