import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { framer } from "framer-plugin";
import auth from "./auth";

export interface HSAccount {
  portalId: number;
  uiDomain: string;
  dataHostingLocation: string;
}

export interface HSUser {
  token: string;
  user: string;
  hub_domain: string;
  scopes: string[];
  signed_access_token: {
    expiresAt: number;
    scopes: string;
    hubId: number;
    userId: number;
    appId: number;
    signature: string;
    scopeToScopeGroupPks: string;
    newSignature: string;
    hublet: string;
    trialScopes: string;
    trialScopeToScopeGroupPks: string;
    isUserLevel: boolean;
  };
  hub_id: number;
  app_id: number;
  expires_in: number;
  user_id: number;
  token_type: string;
}

export interface HSInbox {
  id: string;
  name: string;
  createdAt: string;
  archived: boolean;
}

export interface HSInboxesResponse {
  results: HSInbox[];
  total: number;
}

export interface HSEvent {
  labels: {
    singular: string;
  };
  description: string;
  archived: boolean;
  trackingType: string;
  name: string;
  id: string;
  primaryObjectId: string;
  properties: HSProperty[];
}

export interface FramerHSEvent extends HSEvent {
  nodeId: string;
  properties: (HSProperty & { lowercaseNodeId: string })[];
}

interface HSEventsResponse {
  total: number;
  results: HSEvent[];
}

interface HSForm {
  id: string;
  name: string;
  // Add more properties as needed
}

interface HSFormsResponse {
  total: number;
  results: HSForm[];
}

export enum HSType {
  string = "string",
  number = "number",
  enumeration = "enumeration",
  datetime = "datetime",
}

export interface HSProperty {
  hidden?: boolean;
  name: string;
  label: string;
  description?: string;
  type: HSType;
  options?: {
    label: string;
    value: string;
  }[];
}

export enum HSObject {
  Contact = "CONTACT",
  Company = "COMPANY",
  Deal = "DEAL",
  Ticket = "TICKET",
}

export interface HSCreateEvent {
  label: string;
  name: string;
  description: string;
  primaryObject: HSObject;
  propertyDefinitions?: HSProperty[];
}

export enum HSObjectId {
  Contacts = "0-1",
  Companies = "0-2",
  Deals = "0-3",
  Tickets = "0-4",
  Products = "0-5",
  LineItems = "0-6",
  Custom = "0-10",
}

export interface HSCreatedEvent {
  labels: {
    singular: string;
    plural: null;
  };
  description?: string;
  archived: false;
  primaryObjectId: HSObjectId;
  name: string;
  id: string;
}

const PROXY_URL =
  "https://framer-semrush-proxy.sakibulislam25800.workers.dev/?";
const API_URL = "https://api.hubapi.com";

interface RequestOptions {
  path: string;
  method?: string;
  query?: Record<string, string | number | string[]> | URLSearchParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

const request = async <T = unknown>({
  path,
  method,
  query,
  body,
}: RequestOptions): Promise<T> => {
  try {
    const tokens = auth.tokens.get();
    if (!tokens) {
      throw new Error("Failed to make request with valid auth.");
    }

    const url = new URL(`${PROXY_URL}${API_URL}${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((val) =>
              url.searchParams.append(key, decodeURIComponent(val)),
            );
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      }
    }

    const res = await fetch(url.toString(), {
      method: method?.toUpperCase() ?? "GET",
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    if (method === "delete" && res.status === 204) {
      return {} as T;
    }

    if (!res.ok) {
      throw new Error("Failed to fetch HubSpot API: " + res.status);
    }

    const json = await res.json();

    return json;
  } catch (e) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    throw new Error(
      (e as any)?.body?.message ??
        (e as any).message ??
        "Something went wrong. That's all we know.",
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
};

export const useUserQuery = () => {
  return useQuery<HSUser>({
    queryKey: ["user"],
    queryFn: () => {
      const tokens = auth.tokens.get();
      if (!tokens) throw new Error("No tokens.");

      return request({
        method: "get",
        path: `/oauth/v1/access-tokens/${tokens.accessToken}`,
      });
    },
  });
};

export const useAccountQuery = () => {
  return useQuery<HSAccount>({
    queryKey: ["account"],
    queryFn: () =>
      request({
        method: "get",
        path: "/account-info/v3/details",
      }),
  });
};

export const useInboxesQuery = () => {
  return useQuery<HSInboxesResponse, Error, HSInbox[]>({
    queryKey: ["inboxes"],
    queryFn: () =>
      request({
        method: "GET",
        path: "/conversations/v3/conversations/inboxes/",
      }),
    select: (data) => data.results,
  });
};

export const useFormsQuery = () => {
  return useQuery<HSFormsResponse>({
    queryKey: ["forms"],
    queryFn: () =>
      request({
        method: "get",
        path: "/marketing/v3/forms/",
      }),
  });
};

export const useEventsQuery = () => {
  return useQuery<HSEventsResponse, Error, FramerHSEvent[]>({
    queryKey: ["events"],
    queryFn: () =>
      request({
        method: "get",
        path: "/events/v3/event-definitions",
      }),
    select: (data) => {
      const framerEvents = data.results.filter((e) =>
        e.name.includes("framer"),
      );

      return framerEvents.map((e) => {
        const framerNode = e.properties.find(
          (prop) => prop.name === "framer_node",
        );

        return {
          ...e,
          nodeId: framerNode?.options?.[0].value ?? "",
          properties: e.properties.map((prop) => ({
            ...prop,
            lowercaseNodeId: prop.name.split("_")[1] ?? "",
          })),
        };
      });
    },
  });
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<HSCreatedEvent, Error, HSCreateEvent>({
    mutationFn: async (body) =>
      request({
        method: "post",
        path: "/events/v3/event-definitions/",
        body,
      }),
    onSuccess: () => {
      framer.notify("Event created.", { variant: "success" });
      return queryClient.refetchQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventName }: { eventName: string }) =>
      request({
        method: "DELETE",
        path: `/events/v3/event-definitions/${eventName}`,
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
};
