"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

export default function EditProjectModal({
  projectId,
  initialName,
  initialDescription,
}: {
  projectId: string;
  initialName: string;
  initialDescription: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button fullWidth onPress={() => setIsOpen(true)}>
        Edit Project
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Edit Project</h3>
            </div>

            <form onSubmit={handleSubmit} className="mt-6">
              <label className="block mb-2 text-sm font-medium">
                Project Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-full px-4 py-3"
              />

              <label className="block mt-5 mb-2 text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border rounded-2xl px-4 py-3"
              />

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="primary" onPress={() => setIsOpen(false)}>
                  Cancel
                </Button>

                <Button variant="primary" type="submit" isDisabled={loading}>
                  {loading ? "Saving..." : "Update Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
