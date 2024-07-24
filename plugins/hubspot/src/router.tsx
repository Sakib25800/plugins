import { AnimatePresence, motion } from "framer-motion";
import React, { cloneElement, useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { PluginPage } from "./components/PluginPage";
import { SetupPage } from "./pages";
import { AccountPage } from "./pages/Account";
import { ChatPage } from "./pages/Chat";
import { EventsPage } from "./pages/events";
import { NewEventPage } from "./pages/events/New";
import { ViewEventPage } from "./pages/events/View";
import { FormsPage } from "./pages/forms";
import { FormsInstallationPage } from "./pages/forms/installation";
import { MenuPage } from "./pages/Menu";
import { Tracking } from "./pages/tracking";
import { LearnMoreTrackingPage } from "./pages/tracking/learn-more";
import { WidgetsPage } from "./pages/Widgets";
import { PageErrorBoundaryFallback } from "./components/PageErrorBoundaryFallback";

interface PluginRoute {
  path: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
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
    component: SetupPage,
    displayAsSmall: true,
  },
  {
    path: "/menu",
    component: MenuPage,
    displayAsSmall: true,
  },
  {
    path: "/forms",
    component: FormsPage,
    displayAsSmall: true,
    title: "Forms",
    children: [
      {
        path: "/installation",
        component: FormsInstallationPage,
        displayAsSmall: true,
      },
    ],
  },
  {
    path: "/tracking",
    component: Tracking,
    displayAsSmall: true,
    title: "Tracking",
    children: [
      {
        path: "/learn-more",
        component: LearnMoreTrackingPage,
        displayAsSmall: true,
      },
    ],
  },
  {
    path: "/widgets",
    component: WidgetsPage,
    displayAsSmall: true,
    title: "Widgets",
  },
  {
    path: "/events",
    component: EventsPage,
    displayAsSmall: true,
    title: "Events",
    children: [
      {
        title: "Event",
        path: "/new",
        component: NewEventPage,
        displayAsSmall: true,
      },
      {
        title: "Event",
        path: "/:eventId",
        component: ViewEventPage,
        displayAsSmall: true,
      },
    ],
  },
  {
    path: "/account",
    component: AccountPage,
    displayAsSmall: true,
    title: "Account",
  },
  {
    path: "/chat",
    component: ChatPage,
    displayAsSmall: true,
    title: "Chat",
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
      "The length of `routes` array provided to `useRoutes` must be constant"
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
          duration: 0.28,
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
          <PageErrorBoundaryFallback>
            <Component params={params} />
          </PageErrorBoundaryFallback>
        </PluginPage>
      </motion.div>
    );
  }

  return null;
}

export function Router() {
  const page = useRoutes(pluginRoutes);

  return (
    <AnimatePresence>
      {page ? (
        cloneElement(page, { key: location.pathname })
      ) : (
        <PluginPage title="404">
          <p>Yikes! Looks like we lost that page, sorry!</p>
        </PluginPage>
      )}
    </AnimatePresence>
  );
}
