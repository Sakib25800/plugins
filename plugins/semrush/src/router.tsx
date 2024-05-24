import React, { useEffect } from "react";
import { Router as Wouter, Switch, Route } from "wouter";
import { AuditMenu } from "./pages/audit";
import { AuditReport } from "./pages/audit/report";
import { AuditSettings } from "./pages/audit/Settings";
import { KeywordsSearch } from "./pages/Search";
import { Menu } from "./pages/Menu";
import { Project } from "./pages/Project";
import { Setup } from "./pages";
import { PluginContainer } from "./components/PluginContainer";
import { framer } from "framer-plugin";
import { useResizeObserver } from "usehooks-ts";
import { AuditReportIssues } from "./pages/audit/report/issues";

interface PluginRoute {
  path: string;
  component: () => React.ReactNode;
  title?: string;
  displayAsSmall?: boolean;
  children?: PluginRoute[];
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

function usePluginResizeObserver(ref: React.RefObject<HTMLDivElement>) {
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

  return { width, height };
}

const Routes = ({ routes }: { routes: PluginRoute[] }) => {
  return routes.map((route, i) => {
    const {
      title,
      children,
      path,
      component: Component,
      displayAsSmall,
    } = route;

    return (
      <React.Fragment key={i}>
        {children ? (
          <Route path={path} nest>
            {children.map((route, i) => (
              <Routes key={i} routes={[route]} />
            ))}
          </Route>
        ) : (
          <Route path={path}>
            <PluginContainer title={title} isSmall={displayAsSmall}>
              <Component />
            </PluginContainer>
          </Route>
        )}
      </React.Fragment>
    );
  });
};

export function Router() {
  const ref = React.useRef(null);
  usePluginResizeObserver(ref);

  return (
    <div ref={ref} className="w-fit h-fit">
      <Wouter>
        <Switch>
          <Routes routes={pluginRoutes} />
          <Route>
            <div>404</div>
          </Route>
        </Switch>
      </Wouter>
    </div>
  );
}
