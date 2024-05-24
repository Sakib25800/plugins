import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Router } from "./router";
import { PluginContainer } from "./components/PluginContainer";

export function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => (
            <PluginContainer title="Error">
              <p className="text-framer-red text-center">{error.message}</p>
              <button
                className="bg-transparent hover:bg-transparent active:bg-transparent text-blue-600 outline-none"
                onClick={() => resetErrorBoundary()}
              >
                Try again
              </button>
            </PluginContainer>
          )}
        >
          <Router />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
