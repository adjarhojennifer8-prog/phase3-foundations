"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <section
          role="alert"
          className="w-full rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Something went wrong
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            We couldn&apos;t load this page.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-zinc-600">
            An unexpected error occurred. You can try loading the page again.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700"
          >
            Try again
          </button>
        </section>
      </div>
    </main>
  );
}