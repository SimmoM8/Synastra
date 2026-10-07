interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({
  error,
  resetErrorBoundary
}: ErrorFallbackProps) {
  return (
    <div>
      <h2>Signal disrupted</h2>
      <p>{error.message}</p>

      <button onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}

export default ErrorFallback