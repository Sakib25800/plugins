import * as v from "valibot";
import { framer } from "framer-plugin";

const apiErrorSchema = v.object(
  {
    message: v.string(),
  },
  v.unknown()
);

const projectSchema = v.object({
  project_id: v.number(),
  project_name: v.string(),
  url: v.string(),
  domain_unicode: v.string(),
  tools: v.array(
    v.object({
      tool: v.string(),
    })
  ),
  owner_id: v.number(),
  permission: v.array(v.string()),
});

const auditEnabledSchema = v.object(
  {
    status: v.string(),
  },
  v.unknown()
);

const projectsSchema = v.array(projectSchema);

const keywordRowSchema = v.object({
  Keyword: v.string(),
  Intent: v.string(),
  CPC: v.string(),
  Trends: v.string(),
  "Search Volume": v.string(),
  "Number of Results": v.string(),
  "Keyword Difficulty Index": v.string(),
});

const keywordsTableSchema = v.array(keywordRowSchema);

const auditSettingsSchema = v.object({
  domain: v.string(),
  scheduleDay: v.optional(v.number([v.minValue(0), v.maxValue(7)])),
  notify: v.optional(v.boolean()),
  allow: v.optional(v.array(v.string())),
  disallow: v.optional(v.array(v.string())),
  pageLimit: v.number([v.minValue(1), v.maxValue(1000)]),
  userAgentType: v.optional(v.number([v.minValue(2), v.maxValue(7)])),
  respectCrawlDelay: v.optional(v.boolean()),
});

const savedAuditSchema = v.object({
  mask_allow: v.array(v.string()),
  mask_disallow: v.array(v.string()),
  user_agent_type: v.number(),
  status: v.string(),
  scheduleDay: v.number(),
  respectCrawlDelay: v.boolean(),
  pages_limit: v.number(),
});

const auditRunSchema = v.object({
  snapshot_id: v.string(),
});

const issueSchema = v.object({
  id: v.number(),
  count: v.number(),
  delta: v.number(),
  checks: v.number(),
});

const issuesSchema = v.array(issueSchema);

const scoreSchema = v.object({
  value: v.number(),
  delta: v.number(),
});

const auditSchemaReport = v.object(
  {
    id: v.number(),
    pages_limit: v.number(),
    mask_allow: v.array(v.string()),
    mask_disallow: v.array(v.string()),
    user_agent_type: v.optional(v.number([v.minValue(2), v.maxValue(7)])),
    respectCrawlDelay: v.boolean(),
    scheduleDay: v.fallback(v.number(), 0),
    status: v.picklist(["RUNNING", "FINISHED", "CHECKING", "SAVING"]),
    current_snapshot: v.nullable(
      v.object(
        {
          thematicScores: v.object({
            https: scoreSchema,
            intSeo: scoreSchema,
            crawlability: scoreSchema,
            performance: scoreSchema,
            linking: scoreSchema,
            markups: scoreSchema,
          }),
          errors: issuesSchema,
          warnings: issuesSchema,
          notices: issuesSchema,
          snapshot_id: v.string(),
          pages_crawled: v.number(),
          finish_date: v.number(),
          quality: scoreSchema,
        },
        v.unknown()
      )
    ),
  },
  v.unknown()
);

const issueReportSchema = v.object({
  limit: v.number(),
  page: v.number(),
  total: v.number(),
  data: v.array(
    v.object({
      target_url: v.string(),
      page_id: v.string(),
      source_url: v.string(),
    })
  ),
  issue_id: v.number(),
});

interface RequestParamters<TSchema extends v.BaseSchema> {
  path: string;
  method: "get" | "post" | "delete";
  query?: Record<string, string | number | string[]> | URLSearchParams;
  body?: Record<string, unknown>;
  schema: TSchema | "string";
}

interface SemrushConfigurationOptions {
  apiKey: string;
  projectId: number;
}

export enum Columns {
  totalResults = "nr",
  keyword = "ph",
  searchVolume = "nq",
  cpc = "cp",
  difficulty = "kd",
}

export interface KeywordSearchSort {
  column: Columns;
  order: "asc" | "desc";
}

export type KeywordSearchType =
  | "phrase_related"
  | "phrase_fullsearch"
  | "phrase_questions";

export interface KeywordSearchOptions {
  keyword: string;
  database: string;
  offset: number;
  limit: number;
  type: KeywordSearchType;
  sort: KeywordSearchSort;
}

export type AuditSettings = v.Output<typeof auditSettingsSchema>;

export type Issue = v.Output<typeof issueSchema>;

export type Project = v.Output<typeof projectSchema>;

export default class SemrushClient {
  static readonly proxyUrl =
    "https://framer-semrush-proxy.sakibulislam25800.workers.dev/?";
  static readonly apiBaseUrl = `${SemrushClient.proxyUrl}https://api.semrush.com`;
  static readonly baseUrl = `${SemrushClient.proxyUrl}https://www.semrush.com`;

  // Issues a Framer user cannot fix e.g. uncached JS
  private static readonly excludedAuditIssues = [
    4, 9, 10, 16, 17, 18, 27, 28, 43, 27, 29, 41, 131, 132, 133, 134, 145, 127,
  ];

  private apiKey!: string;
  private projectId!: number;

  public constructor({ apiKey, projectId }: SemrushConfigurationOptions) {
    this.configure({ apiKey, projectId });
  }

  public configure({
    apiKey,
    projectId,
  }: Partial<SemrushConfigurationOptions>) {
    if (apiKey !== undefined) {
      this.apiKey = apiKey;
    }

    if (projectId !== undefined) {
      this.projectId = projectId;
    }
  }

  /**
   * Send a request to the Semrush V3 Projects API
   */
  private async request<
    TSchema extends v.BaseSchema,
    R = TSchema extends v.BaseSchema ? v.Output<TSchema> : string
  >({
    path,
    method,
    query,
    body,
    schema,
  }: RequestParamters<TSchema>): Promise<R> {
    // If the body is empty, don't send the body in the HTTP request
    const bodyAsJsonString =
      !body || Object.entries(body).length === 0
        ? undefined
        : JSON.stringify(body);

    let url = `${SemrushClient.apiBaseUrl}${path}?key=${this.apiKey}`;
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        let encodedValue = value;

        if (typeof value === "string") {
          // Replace spaces with +
          encodedValue = value.replace(/\s/gu, "+");
        }

        url += `&${key}=${encodedValue}`;
      });
    }

    const headers: Record<string, string> = {};

    if (bodyAsJsonString) {
      headers["content-type"] = "application/json";
    }

    /**
     * Both JSON and text can be either data or error message
     * So we need to handle all 4 cases
     */
    try {
      const res = await fetch(url, {
        method: method.toUpperCase(),
        body: bodyAsJsonString,
        headers,
      });

      if (res.ok && method === "delete") return null as R;

      const textRes = await res.text();

      if (typeof schema === "string") {
        // Error message returned as text
        if (!res.ok) throw new Error(textRes);

        // Data returned as text
        return textRes as R;
      }

      /**
       * At this point the success data is JSON
       * But the error message could be either JSON or text
       */
      try {
        const jsonRes = JSON.parse(textRes);

        if (!res.ok) {
          const errorResult = v.safeParse(apiErrorSchema, jsonRes);

          if (errorResult.success) {
            throw new Error(errorResult.output.message);
          }
        }

        const successResult = v.safeParse(schema, jsonRes);
        if (successResult.success) return successResult.output;
      } catch (e) {
        if (e instanceof SyntaxError) {
          const textResMessage = this.utils.capitalizeFirstLetter(textRes);

          throw new Error(textResMessage);
        }
      }

      throw new Error("Response could not be parsed");
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }

      throw new Error("Failed to fetch Semrush API");
    }
  }

  public readonly projects = {
    /**
     * Create a new project
     */
    create: (projectName: string, hostname: string) => {
      return this.request({
        path: "/management/v1/projects",
        method: "post",
        body: {
          project_name: projectName,
          url: hostname,
        },
        schema: projectSchema,
      });
    },

    /**
     * Get all projects for the associated account
     */
    getAll: () => {
      return this.request({
        path: "/management/v1/projects",
        method: "get",
        schema: projectsSchema,
      });
    },

    /**
     * Delete the connected Semrush project
     */
    delete: () => {
      return this.request({
        path: `/management/v1/projects/${this.projectId}`,
        method: "delete",
        schema: v.null_(),
      });
    },

    getOrCreate: async () => {
      const projects = await this.projects.getAll();
      const { hostname } = await this.utils.getStagingInfo();
      let connectedProject = projects.find((p) => p.url === hostname);
      let siteAuditToolEnabled = false;

      if (!connectedProject) {
        // Create a new project since one doesn't exist
        connectedProject = await this.projects.create(hostname, hostname);
      } else {
        // Check if the site audit tool is enabled for the existing project
        siteAuditToolEnabled = connectedProject.tools.some(
          (tool) => tool.tool === "siteaudit"
        );
      }

      this.configure({ projectId: connectedProject.project_id });

      // Enable the site audit tool if it's not already enabled
      if (!siteAuditToolEnabled) {
        await this.audit.enable({ pageLimit: 100 });
      }

      return connectedProject;
    },
  };

  public readonly audit = {
    /**
     * Get the project's latest audit report and its settings
     */
    get: () => {
      return this.request({
        path: `/reports/v1/projects/${this.projectId}/siteaudit/info`,
        method: "get",
        schema: auditSchemaReport,
      });
    },

    /**
     * Enable the project's site audit tool feature
     */
    enable: async (settings: Omit<AuditSettings, "domain">) => {
      const { hostname } = await this.utils.getStagingInfo();

      return this.request({
        path: `/management/v1/projects/${this.projectId}/siteaudit/enable`,
        method: "post",
        schema: auditEnabledSchema,
        body: {
          ...settings,
          domain: hostname,
          excludedChecks: SemrushClient.excludedAuditIssues,
        },
      });
    },

    /**
     * Update the project's site audit settings
     */
    update: async (settings: Omit<AuditSettings, "domain">) => {
      const { hostname } = await this.utils.getStagingInfo();

      return this.request({
        path: `/management/v1/projects/${this.projectId}/siteaudit/save`,
        method: "post",
        schema: savedAuditSchema,
        body: {
          ...settings,
          domain: hostname,
          excludedChecks: SemrushClient.excludedAuditIssues,
        },
      });
    },

    /**
     * Run a site audit
     */
    run: () => {
      return this.request({
        path: `/reports/v1/projects/${this.projectId}/siteaudit/launch`,
        method: "post",
        schema: auditRunSchema,
      });
    },

    /**
     * Get a detailed report of an issue
     */
    getIssueReport: (snapshotId: string, issueId: number) => {
      return this.request({
        path: `/reports/v1/projects/{ID}/siteaudit/snapshot/${snapshotId}/issue/${issueId}`,
        method: "get",
        schema: issueReportSchema,
      });
    },
  };

  /**
   * Validate the provided API key
   */
  public async validateApiKey(apiKey: string) {
    try {
      // This endpoint returns 200 even if the API key is invalid
      const res = await fetch(
        `${SemrushClient.baseUrl}/users/countapiunits.html?key=${apiKey}`
      );

      const contentType = res.headers.get("content-type");

      // Error object returned
      if (contentType && contentType.includes("application/json")) {
        throw new Error("Invalid API key.");
      }

      const textRes = await res.text();
      const apiUnitCount = Number(textRes);

      if (apiUnitCount === 0) {
        throw new Error("Insufficient API units.");
      }

      this.apiKey = apiKey;

      return apiKey;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to fetch Semrush API");
    }
  }

  /**
   * Get keyphrases related to a keyword
   */
  public async keywordSearch({
    keyword,
    database,
    offset,
    limit,
    type,
    sort,
  }: KeywordSearchOptions) {
    const keywordsTableResults = await this.request({
      path: "/",
      method: "get",
      schema: "string",
      query: {
        type,
        database,
        phrase: keyword,
        display_limit: limit,
        display_offset: offset,
        export_columns: "Nr,Ph,In,Nq,Cp,Td,Kd",
        display_sort: `${sort.column}_${sort.order}`,
      },
    });

    if (keywordsTableResults.includes("ERROR")) {
      if (keywordsTableResults.includes("ERROR 50")) {
        return [];
      }

      throw new Error(keywordsTableResults);
    }

    const keywordsJSON = this.utils.convertCSVToJSON(keywordsTableResults);
    const result = v.safeParse(keywordsTableSchema, keywordsJSON);

    if (!result.success) {
      throw new Error("Failed to parse keywords CSV.");
    }

    return result.output;
  }

  private utils = {
    convertCSVToJSON: (data: string) => {
      const rows = data.split("\n");
      const headers = rows[0].split(";");
      rows.shift();

      return rows.map((row) => {
        const rowData = row.split(";");
        const obj: Record<string, string> = {};

        headers.forEach((header, index) => {
          obj[header.trim()] = rowData[index].trim();
        });

        return obj;
      });
    },
    capitalizeFirstLetter: (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    getStagingInfo: async () => {
      const publishInfo = await framer.getPublishInfo();
      const stagingInfo = publishInfo.staging;

      if (!stagingInfo) {
        throw new Error("This project must be published to staging.");
      }

      return {
        ...stagingInfo,
        hostname: new URL(stagingInfo.url).hostname,
      };
    },
  };
}
