import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import SemrushClient, { Issue } from "./semrush";
import { useEffect, useState } from "react";
import { AUDIT_ISSUES } from "./constants";
import { framer } from "framer-plugin";

const semrushApiStorageKey = "semrushApiKey";
const semrushProjectIdStorageKey = "semrushProjectId";

const semrush = new SemrushClient({
  apiKey: localStorage.getItem(semrushApiStorageKey) ?? "",
  projectId: Number(localStorage.getItem(semrushProjectIdStorageKey)) ?? 0,
});

function formatNumWithMetricPrefix(num: number) {
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(num);
}

function timeAgo(isoDate: number) {
  const date = new Date(isoDate);
  const formatter = new Intl.RelativeTimeFormat("en");
  const ranges = [
    ["years", 3600 * 24 * 365],
    ["months", 3600 * 24 * 30],
    ["weeks", 3600 * 24 * 7],
    ["days", 3600 * 24],
    ["hours", 3600],
    ["minutes", 60],
    ["seconds", 1],
  ] as const;
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  for (const [rangeType, rangeVal] of ranges) {
    if (rangeVal < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / rangeVal;
      return formatter.format(Math.round(delta), rangeType);
    }
  }
}

// Removes unrelated issues and annotates the rest with their type and description
function annotateIssues(issues: Issue[], type: "error" | "warning" | "notice") {
  const applicableAuditIssues = issues.filter((issue) => issue.count > 0);
  return applicableAuditIssues.map((issue) => ({
    ...issue,
    type,
    description: AUDIT_ISSUES[issue.id].description ?? String(issue.id),
  }));
}

const transformKeywordRow = (
  cell: Awaited<ReturnType<typeof semrush.keywordSearch>>[0]
) => ({
  keyword: cell.Keyword,
  searchVolume: formatNumWithMetricPrefix(Number(cell["Search Volume"])),
  trends: cell.Trends.split(","),
  cpc: cell.CPC,
  difficulty: cell["Keyword Difficulty Index"],
  totalResults: formatNumWithMetricPrefix(Number(cell["Number of Results"])),
  // Intent is the only possible empty cell
  intentCodes: cell.Intent === "" ? null : cell.Intent.split(","),
});

export function useValidateApiKeyMutation({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apiKey: string) => semrush.validateApiKey(apiKey),
    onSuccess: async (validatedApiKey) => {
      // Persist API key
      localStorage.setItem(semrushApiStorageKey, validatedApiKey);

      queryClient.prefetchQuery({
        queryKey: ["project"],
        queryFn: async () => {
          const project = await semrush.projects.getOrCreate();

          // Persist project ID
          localStorage.setItem(
            semrushProjectIdStorageKey,
            String(project.project_id)
          );

          return project;
        },
      });

      onSuccess();
    },
  });
}

export function useProjectQuery() {
  return useQuery({
    queryKey: ["project"],
    queryFn: () => semrush.projects.getOrCreate(),
    throwOnError: true,
  });
}

export function useDeleteProjectMutation({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => semrush.projects.delete(),
    onSuccess: () => {
      queryClient.clear();
      onSuccess();
    },
  });
}

export function useInfiniteKeywordSearchQuery(
  args: Omit<Parameters<typeof semrush.keywordSearch>[0], "offset">
) {
  const { keyword, database, limit, type, sort } = args;

  return useInfiniteQuery({
    queryKey: ["keywords", { keyword, database, type, sort }],
    enabled: !!keyword,
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam }) => {
      const offset = pageParam * limit;
      return semrush.keywordSearch({
        ...args,
        offset,
        limit: offset + limit,
      });
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      return lastPage.length === 0 ? undefined : lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      return firstPageParam <= 1 ? undefined : firstPageParam - 1;
    },
    select: (data) => {
      return data.pages.flatMap((page) =>
        page.map((row) => transformKeywordRow(row))
      );
    },
  });
}

export function useAuditQuery({
  formatSnapshotData,
}: {
  formatSnapshotData: boolean;
}) {
  const [refetchInterval, setRefetchInterval] = useState(4500);
  const { data, ...rest } = useQuery({
    throwOnError: true,
    queryKey: ["audit"],
    queryFn: () => semrush.audit.get(),
    select: (data) => {
      // Don't format if no previous audit data exists or if not requested
      if (data.current_snapshot === null || !formatSnapshotData) {
        return {
          ...data,
          timeAgo: undefined,
          annotatedIssues: {
            errors: [],
            warnings: [],
            notices: [],
          },
        };
      }

      const { errors, warnings, notices } = data.current_snapshot;

      return {
        ...data,
        timeAgo: timeAgo(data.current_snapshot.finish_date),
        annotatedIssues: {
          errors: annotateIssues(errors, "error"),
          warnings: annotateIssues(warnings, "warning"),
          notices: annotateIssues(notices, "notice"),
        },
      };
    },
    refetchInterval,
  });
  const isAuditFinished = data?.status === "FINISHED";

  // Poll for audit status
  useEffect(() => {
    if (isAuditFinished || !data) {
      setRefetchInterval(0);
    } else {
      setRefetchInterval(4500);
    }
  }, [isAuditFinished, data]);

  return { data, ...rest };
}

export function useRunAuditMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => semrush.audit.run(),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ["audit"] }),
  });
}

export function useEditAuditMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (audit: Parameters<typeof semrush.audit.update>[0]) => {
      return semrush.audit.update(audit);
    },
    onSuccess: () => {
      framer.notify("Audit settings saved.", { variant: "success" });
      return queryClient.refetchQueries({ queryKey: ["audit"] });
    },
  });
}

export const usePrefetchAuditQuery = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ["audit"],
      queryFn: () => semrush.audit.get(),
    });
  };
};

export const useIssueReportQuery = (snapshotId: string, issueId: number) => {
  return useQuery({
    queryKey: ["issue", snapshotId, issueId],
    queryFn: () => semrush.audit.getIssueReport(snapshotId, issueId),
  });
};
