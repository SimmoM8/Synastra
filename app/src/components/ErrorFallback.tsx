import type { FallbackProps } from 'react-error-boundary'

function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const message =
    error instanceof Error
      ? error.message
      : 'An unknown error occurred'

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-8 h-3 w-3 rounded-full bg-red-300 shadow-[0_0_25px_rgba(252,165,165,.7)]" />

        <p className="text-[10px] uppercase tracking-[0.4em] text-red-300/70">
          Signal disrupted
        </p>

        <h1 className="mt-4 text-3xl font-light">
          Synastra lost connection.
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-500">
          {message}
        </p>

        <button
          type="button"
          onClick={resetErrorBoundary}
          className="mt-8 rounded-full border border-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-violet-300/30 hover:bg-violet-300/5 hover:text-white"
        >
          Reconnect
        </button>
      </div>
    </main>
  )
}

export default ErrorFallback