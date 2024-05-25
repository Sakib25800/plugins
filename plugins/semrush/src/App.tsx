import { useEffect, useRef } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Router } from "./router";
import { framer } from "framer-plugin";
import { useResizeObserver } from "usehooks-ts";

export function App() {
  const ref = useRef(null);
  const { width = 260, height = 272 } = useResizeObserver({
    ref,
    box: "content-box",
  });

  useEffect(() => {
    framer.showUI({
      title: "Semrush",
      width,
      height,
    });
  }, [width, height]);

  return (
    <div ref={ref}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary, error }) => (
              <div className="col-lg mx-auto px-15 pb-15 w-[260px]">
                <hr />
                <p className="text-framer-red">{error.message}</p>
                <button
                  className="bg-transparent hover:bg-transparent active:bg-transparent text-blue-600 outline-none"
                  onClick={() => resetErrorBoundary()}
                >
                  Try again
                </button>
              </div>
            )}
          >
            <Router />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
