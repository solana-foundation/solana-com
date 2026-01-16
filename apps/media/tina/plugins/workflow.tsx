"use client";

import { useState, useCallback } from "react";
import type { TinaCMS } from "tinacms";
import Link from "next/link";

interface WorkflowState {
  currentBranch: string;
  isDraft: boolean;
  isPublishing: boolean;
  isDiscarding: boolean;
}

/**
 * Draft Status Badge Component
 */
function DraftStatusBadge({ branch }: { branch: string }) {
  const isDraft = branch.startsWith("draft/");

  if (!isDraft) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      Draft
    </span>
  );
}

/**
 * Workflow Toolbar Component
 * Renders the draft status and action buttons in the TinaCMS sidebar
 */
export function WorkflowToolbar({
  branch,
  onPublish,
  onDiscard,
  isPublishing,
  isDiscarding,
}: {
  branch: string;
  onPublish: () => void;
  onDiscard: () => void;
  isPublishing: boolean;
  isDiscarding: boolean;
}) {
  const isDraft = branch.startsWith("draft/");

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Branch</span>
        <DraftStatusBadge branch={branch} />
      </div>

      <div
        className="text-xs text-gray-500 mb-4 font-mono truncate"
        title={branch}
      >
        {branch}
      </div>

      {isDraft && (
        <div className="space-y-2">
          <button
            onClick={onPublish}
            disabled={isPublishing || isDiscarding}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>

          <button
            onClick={onDiscard}
            disabled={isPublishing || isDiscarding}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDiscarding ? "Discarding..." : "Discard Draft"}
          </button>
        </div>
      )}

      {!isDraft && (
        <p className="text-xs text-gray-500">
          Create a new draft to make changes. Use the branch switcher to select
          or create a draft branch.
        </p>
      )}
    </div>
  );
}

/**
 * Publish Confirmation Modal
 */
export function PublishModal({
  isOpen,
  onClose,
  onConfirm,
  branch,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
  branch: string;
  isLoading: boolean;
}) {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(title || `Publish: ${branch}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Publish Content
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          This will create a pull request and merge it to the main branch,
          making your changes live.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Commit message (optional)
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Publish: ${branch}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Discard Confirmation Modal
 */
export function DiscardModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Discard Draft?
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          This will permanently delete all unpublished changes in this draft
          branch. This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Discarding..." : "Discard"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Logout Button Component
 */
export function LogoutButton() {
  return (
    <Link
      href="/admin/logout"
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
    >
      Sign Out
    </Link>
  );
}

/**
 * Create the workflow plugin for TinaCMS
 * This adds the workflow toolbar and modals to the admin interface
 */
export function createWorkflowPlugin() {
  return {
    __type: "screen",
    name: "Workflow",
    Component: WorkflowScreen,
    Icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    ),
  };
}

/**
 * Workflow Screen Component
 * Shows current drafts and allows management
 */
function WorkflowScreen() {
  const [drafts, setDrafts] = useState<
    Array<{ name: string; collection: string; slug: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/admin/api/drafts");
      const data = await response.json();

      if (data.success) {
        setDrafts(data.drafts || []);
      } else {
        setError(data.error || "Failed to load drafts");
      }
    } catch {
      setError("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Drafts</h1>
        <button
          onClick={loadDrafts}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {drafts.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p>No draft branches found.</p>
          <p className="mt-2 text-sm">
            Use the branch switcher to create a new draft branch.
          </p>
        </div>
      )}

      {drafts.length > 0 && (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.name}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{draft.slug}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {draft.collection}
                  </p>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {draft.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  );
}
