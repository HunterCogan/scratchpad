"use client";

import { useState } from "react";

export default function DeleteAccountForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-5 bg-white">
      <h2 className="text-lg font-semibold text-red-600">Delete Account</h2>

      <p className="text-sm text-gray-500 mt-2">
        Permanently delete your account.
      </p>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-red-600">
              Delete Account
            </h2>

            <p className="mt-4 text-sm text-gray-600">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                px-5
                py-2
                rounded-full
                bg-red-600
                text-white
                font-medium
                hover:bg-red-700
                transition
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2 bg-red-600 text-white rounded-full"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
