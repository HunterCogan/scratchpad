"use client";

import { useEffect, useState } from "react";

export default function UsernameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Failed to update username",
        );
      }

      setMessage("Username updated successfully");
      setIsOpen(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update username",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-4 bg-white">
      <h2 className="text-lg font-semibold">Username</h2>

      <div className="flex items-center justify-between mt-4">
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-gray-900">{name}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            px-5
            py-2
            rounded-full
            bg-blue-600
            text-white
            font-medium
            hover:bg-blue-700
            transition
            "
        >
          Update Username
        </button>
      </div>

      {message && (
        <p className="text-sm text-emerald-600 mt-4 font-medium">{message}</p>
      )}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Update Username</h3>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Enter a new username for your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6">
              <label className="block text-sm font-medium mb-2">
                New Username
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-full px-4 py-3"
                placeholder="Enter new username"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 border rounded-full"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-full"
                >
                  {loading ? "Saving..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
