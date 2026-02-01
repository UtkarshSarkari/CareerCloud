"use client";

import { useState } from "react";

export default function CreateJobModal({
  onJobCreated,
}: {
  onJobCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    jobLink: "",
    notes: "",
  });

  const handleSubmit = async () => {
    // Filter out empty optional fields to avoid validation errors
    const payload: any = {
      companyName: form.companyName,
      jobTitle: form.jobTitle,
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

    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", // Important: send cookies with request
    });

    setOpen(false);
    onJobCreated();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-800"
      >
        + Add Job
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md space-y-3">
            <h2 className="text-xl font-bold">Add Job</h2>

            {[
              ["companyName", "Company Name"],
              ["jobTitle", "Job Title"],
              ["jobLink", "Job Link"],
            ].map(([key, label]) => (
              <input
                key={key}
                className="w-full border p-2"
                placeholder={label}
                value={(form as any)[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            ))}

            <textarea
              className="w-full border p-2"
              placeholder="Job Description"
              value={form.jobDescription}
              onChange={(e) =>
                setForm({ ...form, jobDescription: e.target.value })
              }
            />

            <textarea
              className="w-full border p-2"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="bg-gray-200 text-black px-4 py-2 rounded cursor-pointer hover:bg-gray-300">Cancel</button>
              <button
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}