import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  children: React.ReactNode;
}

export const PageErrorBoundaryFallback = ({ children }: Props) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary, error }) => (
          <>
            <p className="text-framer-red w-full line-clamp-6">
              {error.message}
            </p>
            <button className="w-full" onClick={() => resetErrorBoundary()}>
              Try again
            </button>
          </>
        )}
      >
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
