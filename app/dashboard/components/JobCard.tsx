"use client";

import { useDraggable } from "@dnd-kit/core";
import { Job } from "./KanbanBoard";
import { useState } from "react";
import EditJobModal from "./EditJobModal";

export default function JobCard({
  job,
  onDelete,
  onUpdate,
}: {
  job: Job;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job._id,
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag from triggering
    
    if (!confirm(`Delete job at ${job.companyName}?`)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        onDelete(job._id); // Remove from UI
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.message}`);
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete job");
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag from triggering
    setShowEditModal(true);
  };

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white p-3 rounded shadow"
      >
        {/* Draggable area */}
        <div {...listeners} {...attributes} className="cursor-move">
          <h3 className="font-semibold">{job.companyName}</h3>
          <p className="text-sm text-gray-600">{job.jobTitle}</p>
          
          {/* Show job link if available */}
          {(job as any).jobLink && (
            <a
              href={(job as any).jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline block mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              View Job →
            </a>
          )}
          
          {/* Show notes preview if available */}
          {(job as any).notes && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {(job as any).notes}
            </p>
          )}
        </div>

        {/* Action buttons - NOT draggable */}
        <div className="flex gap-2 mt-2 border-t pt-2">
          <button
            onClick={handleEdit}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditJobModal
          job={job}
          onJobUpdated={onUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}