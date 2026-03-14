"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-4">
      <h2 className="text-lg font-semibold text-rose-400">Failed to load page</h2>
      <p className="text-sm text-slate-500 max-w-md">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
