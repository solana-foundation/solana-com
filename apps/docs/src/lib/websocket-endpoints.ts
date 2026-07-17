import websocketSchema from "@/data/websocket_schema.json";
import responseSchema from "@/data/response_schema.json";
import { generateSampleFromSchema, type SchemaNode } from "./schema-parser";

// =================================================================================
// INTERFACE DEFINITIONS
// =================================================================================

export interface WebSocketEndpoint {
  method_name: string;
  description: string;
  category: "account" | "signature" | "slot" | "logs" | "program" | "block";
  subscribe_example: string;
  unsubscribe_example: string;
  notification_example: string;
  subscribe_response_example: string;
  unsubscribe_response_example: string;
  params: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

const websocketSchemaRoot = websocketSchema as unknown as SchemaNode;
const responseSchemaRoot = responseSchema as unknown as SchemaNode;

// =================================================================================
// INTERNAL HELPERS
// =================================================================================

function resolveSchemaReference(
  ref: string | undefined,
  schemaSource: SchemaNode,
): SchemaNode | null {
  if (!ref) return null;
  const refName = ref.split("/").pop();
  return refName ? (schemaSource.$defs?.[refName] ?? null) : null;
}

function extractParameters(
  requestSchema: SchemaNode | null | undefined,
): WebSocketEndpoint["params"] {
  if (!requestSchema?.properties) return [];

  const params: WebSocketEndpoint["params"] = [];
  const required = new Set(requestSchema.required || []);

  const sortedProperties = Object.entries(requestSchema.properties).sort(
    ([a], [b]) => (required.has(a) ? 0 : 1) - (required.has(b) ? 0 : 1),
  );

  for (const [propName, propDef] of sortedProperties) {
    let type = "any";
    const description = propDef.description || "No description provided.";
    const isRequired = required.has(propName);

    if (propDef.$ref) {
      type = propDef.$ref.split("/").pop() || "object";
    } else if (propDef.anyOf) {
      type = propDef.anyOf
        .map((o) => o.$ref?.split("/").pop() || o.type)
        .filter((t) => t !== "null")
        .join(" | ");
    } else if (propDef.oneOf) {
      type = propDef.oneOf
        .map((o) => o.$ref?.split("/").pop() || o.type)
        .join(" | ");
    } else if (propDef.type) {
      type = String(propDef.type);
    }

    params.push({
      name: propName,
      type: isRequired ? type : `${type} (optional)`,
      description,
      required: isRequired,
    });
  }

  return params;
}

function createWebSocketEndpoint(
  subscribeMethodName: string,
  category: "account" | "signature" | "slot" | "logs" | "program" | "block",
): WebSocketEndpoint | null {
  const wsDefs = websocketSchemaRoot.$defs;
  const respDefs = responseSchemaRoot.$defs;

  // Method definitions can come from either schema
  const subscribeMethodDef =
    resolveSchemaReference(
      wsDefs?.[`${capitalize(category)}SubscriptionEndpoints`]?.properties?.[
        subscribeMethodName
      ]?.$ref,
      websocketSchemaRoot,
    ) || respDefs?.WebSocketSubscriptions?.properties?.[subscribeMethodName];

  if (!subscribeMethodDef) return null;

  const unsubscribeMethodName = subscribeMethodName.replace(
    "Subscribe",
    "Unsubscribe",
  );

  // Schemas for request, response, and notification
  const subscribeRequestDef = resolveSchemaReference(
    subscribeMethodDef.properties?.request?.$ref,
    websocketSchemaRoot,
  );
  const notificationPayloadSchema =
    respDefs?.WebSocketSubscriptions?.properties?.[subscribeMethodName];

  // Helper functions to format JSON payloads
  const formatPayload = (method: string, params: unknown[]) =>
    JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }, null, 2);
  const formatResponse = (result: unknown) =>
    JSON.stringify({ jsonrpc: "2.0", id: 1, result }, null, 2);
  const formatNotification = (method: string, params: unknown) =>
    JSON.stringify({ jsonrpc: "2.0", method, params }, null, 2);

  // Generate sample parameters for the subscribe request
  const sampleParams = subscribeRequestDef?.properties
    ? Object.keys(subscribeRequestDef.properties).map((key) =>
        generateSampleFromSchema(
          subscribeRequestDef.properties?.[key],
          websocketSchemaRoot,
        ),
      )
    : [];

  return {
    method_name: subscribeMethodName,
    description: subscribeMethodDef.description || "No description available.",
    category,
    params: extractParameters(subscribeRequestDef),
    subscribe_example: formatPayload(subscribeMethodName, sampleParams),
    subscribe_response_example: formatResponse(12345),
    notification_example: formatNotification(
      `${category}Notification`,
      generateSampleFromSchema(notificationPayloadSchema, responseSchemaRoot),
    ),
    unsubscribe_example: formatPayload(unsubscribeMethodName, [12345]),
    unsubscribe_response_example: formatResponse(true),
  };
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function extractWebSocketEndpoints(): WebSocketEndpoint[] {
  const endpoints: WebSocketEndpoint[] = [];
  const wsProperties = websocketSchemaRoot.properties || {};

  const allMethods = {
    ...wsProperties,
    ...(responseSchemaRoot.$defs?.WebSocketSubscriptions?.properties || {}),
  };

  const categories: Record<
    string,
    "account" | "signature" | "slot" | "logs" | "program" | "block"
  > = {
    account: "account",
    signature: "signature",
    slot: "slot",
    logs: "logs",
    program: "program",
    block: "block",
  };

  for (const methodName in allMethods) {
    if (methodName.endsWith("Subscribe")) {
      const categoryKey = Object.keys(categories).find((key) =>
        methodName.toLowerCase().includes(key),
      );
      if (categoryKey) {
        const category = categories[categoryKey];
        if (category && !endpoints.some((e) => e.method_name === methodName)) {
          const endpoint = createWebSocketEndpoint(methodName, category);
          if (endpoint) {
            endpoints.push(endpoint);
          }
        }
      }
    }
  }
  return endpoints;
}

// =================================================================================
// EXPORTED DATA
// =================================================================================

export const websocketEndpoints = extractWebSocketEndpoints();
export const accountWebSocketEndpoints = websocketEndpoints.filter(
  (e) => e.category === "account",
);
export const signatureWebSocketEndpoints = websocketEndpoints.filter(
  (e) => e.category === "signature",
);
export const slotWebSocketEndpoints = websocketEndpoints.filter(
  (e) => e.category === "slot",
);
export const logsWebSocketEndpoints = websocketEndpoints.filter(
  (e) => e.category === "logs",
);
export const programWebSocketEndpoints = websocketEndpoints.filter(
  (e) => e.category === "program",
);
export const blockWebSocketEndpoints = websocketEndpoints.filter(
  (e) => e.category === "block",
);
