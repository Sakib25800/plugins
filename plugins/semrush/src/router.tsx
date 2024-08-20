import React, { cloneElement, useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { AuditMenu } from "./pages/audit";
import { AuditReport } from "./pages/audit/report";
import { AuditSettings } from "./pages/audit/Settings";
import { KeywordsSearch } from "./pages/Search";
import { Menu } from "./pages/Menu";
import { Project } from "./pages/Project";
import { Setup } from "./pages";
import { PluginPage } from "./components/PluginPage";
import { AuditReportIssues } from "./pages/audit/report/issues";
import { ValidateKey } from "./pages/ValidateKey";

interface PluginRoute {
  path: string;
  component: () => React.ReactNode;
  title?: string;
  displayAsSmall?: boolean;
  children?: PluginRoute[];
}

interface Match {
  match: ReturnType<typeof useRoute>;
  route: PluginRoute;
}

const pluginRoutes: PluginRoute[] = [
  {
    path: "/",
    component: Setup,
    displayAsSmall: true,
  },
  {
    path: "/menu",
    component: Menu,
    displayAsSmall: true,
  },
  {
    path: "/keywords",
    component: KeywordsSearch,
    title: "Keywords",
  },
  {
    path: "/project",
    component: Project,
    title: "Project",
  },
  {
    path: "/validate-key",
    component: ValidateKey,
    title: "API",
    displayAsSmall: true,
  },
  {
    path: "/audit",
    component: AuditMenu,
    title: "Audit",
    children: [
      {
        path: "/settings",
        component: AuditSettings,
        displayAsSmall: true,
      },
      {
        path: "/report",
        component: AuditReport,
        children: [
          {
            path: "/issues/*",
            component: AuditReportIssues,
            title: "Issues",
          },
        ],
      },
    ],
  },
];

function useRoutes(routes: PluginRoute[]) {
  const [location] = useLocation();
  const [animateForward, setAnimateForward] = useState(true);
  // Save the length of the `routes` array that we receive on the first render
  const [routesLen] = useState(() => routes.length);

  // because we call `useRoute` inside a loop the number of routes can't be changed
  if (routesLen !== routes.length) {
    throw new Error(
      "The length of `routes` array provided to `useRoutes` must be constant",
    );
  }

  useEffect(() => {
    const originalHistoryBack = history.back;

    history.back = () => {
      setAnimateForward(false);
      originalHistoryBack.call(history);
    };

    return () => {
      history.back = originalHistoryBack;
    };
  }, []);

  useEffect(() => {
    setAnimateForward(true);
  }, [location]);

  const matches: Match[] = [];

  const addToMatch = (route: PluginRoute, parentPath = "") => {
    const fullPath = parentPath + route.path;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const match = useRoute(fullPath);
    matches.push({ match, route: { ...route, path: fullPath } });

    if (route.children) {
      for (const child of route.children) {
        addToMatch(child, fullPath);
      }
    }
  };

  for (const route of routes) {
    addToMatch(route);
  }

  for (const { match, route } of matches) {
    const [isMatch, params] = match;
    const { title, displayAsSmall, component: Component, path } = route;

    if (!isMatch) continue;

    return (
      <motion.div
        initial={
          path === "/"
            ? "stay"
            : animateForward
              ? "initialForward"
              : "initialBackward"
        }
        animate="stay"
        exit={animateForward ? "exitForward" : "exitBackward"}
        transition={{
          ease: "easeInOut",
          duration: 0.2,
        }}
        variants={{
          initialForward: {
            x: "100vw",
            opacity: 0,
            position: "absolute",
          },
          initialBackward: {
            x: "-100vw",
            opacity: 0,
            position: "absolute",
          },
          stay: {
            x: 0,
            opacity: 1,
            position: "relative",
          },
          exitForward: {
            x: "-100vw",
            opacity: 0,
            position: "absolute",
          },
          exitBackward: {
            x: "100vw",
            opacity: 0,
            position: "absolute",
          },
        }}
      >
        <PluginPage title={title} isSmall={displayAsSmall}>
          <Component {...params} />
        </PluginPage>
      </motion.div>
    );
  }

  return null;
}

export function Router() {
  const element = useRoutes(pluginRoutes);

  return (
    <AnimatePresence>
      {element ? (
        cloneElement(element, { key: location.pathname })
      ) : (
        <PluginPage title="404">
          <p>Whoops! You shouldn't be here.</p>
        </PluginPage>
      )}
    </AnimatePresence>
  );
}
