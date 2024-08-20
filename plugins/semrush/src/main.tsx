import "./globals.css";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { framer } from "framer-plugin";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      throwOnError: true,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      framer.notify(error.message, { variant: "error" });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      framer.notify(error.message, { variant: "error" });
    },
  }),
});

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
