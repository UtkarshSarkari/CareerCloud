"use client";

import { useState } from "react";
import { Job } from "./KanbanBoard";

export default function EditJobModal({
  job,
  onJobUpdated,
  onClose,
}: {
  job: Job;
  onJobUpdated: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    companyName: job.companyName || "",
    jobTitle: job.jobTitle || "",
    jobDescription: (job as any).jobDescription || "",
    jobLink: (job as any).jobLink || "",
    notes: (job as any).notes || "",
    status: job.status,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Filter out empty optional fields
    const payload: any = {
      companyName: form.companyName,
      jobTitle: form.jobTitle,
      status: form.status,
    };

    if (form.jobDescription && form.jobDescription.trim()) {
      payload.jobDescription = form.jobDescription;
    }
    if (form.jobLink && form.jobLink.trim()) {
      payload.jobLink = form.jobLink;
    }
    if (form.notes && form.notes.trim()) {
      payload.notes = form.notes;
    }

    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        onJobUpdated();
        onClose();
      } else {
        const data = await res.json();
        alert(`Failed to update: ${data.message}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update job");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md space-y-3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Edit Job</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Company Name *</label>
          <input
            className="w-full border p-2 rounded"
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Title *</label>
          <input
            className="w-full border p-2 rounded"
            placeholder="Job Title"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full border p-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Link</label>
          <input
            className="w-full border p-2 rounded"
            placeholder="https://..."
            value={form.jobLink}
            onChange={(e) => setForm({ ...form, jobLink: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Job Description"
            rows={4}
            value={form.jobDescription}
            onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Your notes..."
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !form.companyName || !form.jobTitle}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}