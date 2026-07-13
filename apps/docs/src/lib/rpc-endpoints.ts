import rpcSchema from "@/data/rpc-schema.json";
import responseSchema from "@/data/response_schema.json";
import {
  extractParametersFromSchema,
  formatResponseSchema,
  generateSampleFromSchema,
  type SchemaNode,
} from "@/lib/schema-parser";

// =================================================================================
// INTERFACE DEFINITIONS
// =================================================================================

export interface ResultField {
  name: string;
  type: string;
  description: string;
  indent: number;
}

export interface Endpoint {
  method_name: string;
  description: string;
  example_request: string;
  example_response: string;
  canonical_documentation_url?: string;
  status: string;
  params: {
    name: string;
    type: string;
    description: string;
    isObjectHeader?: boolean;
    isNested?: boolean;
    parentName?: string;
    required: boolean;
  }[];
  resultFields: ResultField[];
}

const rpcSchemaRoot = rpcSchema as unknown as SchemaNode;
const responseSchemaRoot = responseSchema as unknown as SchemaNode;

function rpcDefByName(name: string | undefined): SchemaNode | undefined {
  return name ? rpcSchemaRoot.$defs?.[name] : undefined;
}

function responseDefByName(name: string | undefined): SchemaNode | undefined {
  return name ? responseSchemaRoot.$defs?.[name] : undefined;
}

function typeToString(
  type: string | string[] | undefined,
  fallback = "any",
): string {
  if (Array.isArray(type)) {
    return type.filter((t) => t !== "null").join(" | ");
  }
  return type || fallback;
}

// =================================================================================
// CONSTANTS AND MAPPINGS
// =================================================================================

// Generate cheatcode method mapping from response schema
const cheatcodesSchema = responseSchemaRoot.$defs?.SurfnetCheatcodesEndpoints;
const CHEATCODE_METHOD_MAPPING: Record<string, string> = Object.fromEntries(
  Object.keys(cheatcodesSchema?.properties || {}).map((method) => [
    method,
    `surfnet_${method}`,
  ]),
);

const schemaGroupMapping: Record<string, string> = {
  accounts: "AccountsDataEndpoints",
  accountsScan: "AccountsScanEndpoints",
  admin: "AdminEndpoints",
  bank: "BankDataEndpoints",
  full: "FullEndpoints",
  minimal: "MinimalEndpoints",
  cheatcodes: "SurfnetCheatcodesEndpoints",
};

const methodToGroupMap = new Map<string, string>();
for (const [groupName, defName] of Object.entries(schemaGroupMapping)) {
  const groupDef = responseDefByName(defName);
  if (groupDef?.properties) {
    for (const methodName of Object.keys(groupDef.properties)) {
      methodToGroupMap.set(methodName, groupName);
    }
  }
}

const endpointCategories: { [key: string]: string[] } = {
  network: [
    "getBlock",
    "getBlockCommitment",
    "getBlockHeight",
    "getBlockProduction",
    "getBlockTime",
    "getBlocks",
    "getBlocksWithLimit",
    "getEpochInfo",
    "getEpochSchedule",
    "getFirstAvailableBlock",
    "getGenesisHash",
    "getHighestSnapshotSlot",
    "getInflationGovernor",
    "getInflationRate",
    "getInflationReward",
    "getLatestBlockhash",
    "getLeaderSchedule",
    "getMaxRetransmitSlot",
    "getMaxShredInsertSlot",
    "getMinimumBalanceForRentExemption",
    "getRecentPerformanceSamples",
    "getRecentPrioritizationFees",
    "getRent",
    "getSlot",
    "getSlotLeader",
    "getSlotLeaders",
    "getSupply",
    "getTransactionCount",
    "getVersion",
    "isBlockhashValid",
    "minimumLedgerSlot",
  ],
  node: ["getClusterNodes", "getHealth", "getIdentity", "getVoteAccounts"],
  accounts: ["getBalance"],
  transaction: [
    "getFeeForMessage",
    "getSignatureStatuses",
    "getSignaturesForAddress",
    "getStakeMinimumDelegation",
    "getTransaction",
    "requestAirdrop",
    "sendTransaction",
    "simulateTransaction",
  ],
};

// =================================================================================
// HELPER FUNCTIONS
// =================================================================================

function extractResultFieldsFromSchema(
  schema: SchemaNode | null | undefined,
  indent: number = 0,
  parentPath: string = "",
): ResultField[] {
  if (!schema) return [];

  const fields: ResultField[] = [];

  // Handle $ref
  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    const referencedSchema = responseDefByName(refName);
    if (referencedSchema) {
      return extractResultFieldsFromSchema(
        referencedSchema,
        indent,
        parentPath,
      );
    }
    return [];
  }

  // Handle anyOf - pick first non-null option
  if (schema.anyOf) {
    const nonNullOption = schema.anyOf.find((opt) => opt.type !== "null");
    if (nonNullOption) {
      return extractResultFieldsFromSchema(nonNullOption, indent, parentPath);
    }
    return [];
  }

  // Handle oneOf - pick first non-null option
  if (schema.oneOf) {
    const nonNullOption = schema.oneOf.find((opt) => opt.type !== "null");
    if (nonNullOption) {
      return extractResultFieldsFromSchema(nonNullOption, indent, parentPath);
    }
    return [];
  }

  // Handle object with properties
  if (schema.type === "object" && schema.properties) {
    Object.entries(schema.properties).forEach(([key, propSchema]) => {
      const description = propSchema.description || "";

      if (propSchema.$ref) {
        const refName = propSchema.$ref.split("/").pop();
        const referencedSchema = responseDefByName(refName);
        if (
          referencedSchema?.type === "object" &&
          referencedSchema.properties
        ) {
          fields.push({ name: key, type: "object", description, indent });
          fields.push(
            ...extractResultFieldsFromSchema(referencedSchema, indent + 1, key),
          );
        } else {
          const type = typeToString(
            referencedSchema?.type,
            refName || "object",
          );
          fields.push({ name: key, type, description, indent });
        }
      } else if (propSchema.anyOf || propSchema.oneOf) {
        const options = propSchema.anyOf || propSchema.oneOf || [];
        const nonNullOption = options.find((opt) => opt.type !== "null");
        if (nonNullOption?.$ref) {
          const refName = nonNullOption.$ref.split("/").pop();
          const referencedSchema = responseDefByName(refName);
          if (
            referencedSchema?.type === "object" &&
            referencedSchema.properties
          ) {
            fields.push({ name: key, type: "object", description, indent });
            fields.push(
              ...extractResultFieldsFromSchema(
                referencedSchema,
                indent + 1,
                key,
              ),
            );
          } else {
            fields.push({
              name: key,
              type: refName || "any",
              description,
              indent,
            });
          }
        } else if (
          nonNullOption?.type === "object" &&
          nonNullOption.properties
        ) {
          fields.push({ name: key, type: "object", description, indent });
          fields.push(
            ...extractResultFieldsFromSchema(nonNullOption, indent + 1, key),
          );
        } else {
          const types = options
            .map((o) => o.type)
            .filter((t): t is string | string[] => !!t && t !== "null")
            .map((t) => typeToString(t, ""))
            .filter(Boolean);
          fields.push({
            name: key,
            type: types.join(" | ") || "any",
            description,
            indent,
          });
        }
      } else if (propSchema.type === "object" && propSchema.properties) {
        fields.push({ name: key, type: "object", description, indent });
        fields.push(
          ...extractResultFieldsFromSchema(propSchema, indent + 1, key),
        );
      } else if (propSchema.type === "array" && propSchema.items) {
        const items = Array.isArray(propSchema.items)
          ? undefined
          : propSchema.items;
        const itemType =
          typeToString(items?.type, "") ||
          items?.$ref?.split("/").pop() ||
          "any";
        fields.push({
          name: key,
          type: `array<${itemType}>`,
          description,
          indent,
        });
        if (items?.$ref) {
          const refName = items.$ref.split("/").pop();
          const referencedSchema = responseDefByName(refName);
          if (
            referencedSchema?.type === "object" &&
            referencedSchema.properties
          ) {
            fields.push({
              name: "[]",
              type: "object",
              description: "Array item",
              indent: indent + 1,
            });
            fields.push(
              ...extractResultFieldsFromSchema(
                referencedSchema,
                indent + 2,
                "[]",
              ),
            );
          }
        }
      } else {
        const type = typeToString(propSchema.type, "any");
        fields.push({ name: key, type, description, indent });
      }
    });
  }

  // Handle array at root level
  if (schema.type === "array" && schema.items) {
    const items = Array.isArray(schema.items) ? undefined : schema.items;
    const itemType =
      typeToString(items?.type, "") || items?.$ref?.split("/").pop() || "any";
    fields.push({
      name: "result",
      type: `array<${itemType}>`,
      description: schema.description || "",
      indent,
    });
    if (items?.$ref) {
      const refName = items.$ref.split("/").pop();
      const referencedSchema = responseDefByName(refName);
      if (referencedSchema?.type === "object" && referencedSchema.properties) {
        fields.push({
          name: "[]",
          type: "object",
          description: "Array item",
          indent: indent + 1,
        });
        fields.push(
          ...extractResultFieldsFromSchema(referencedSchema, indent + 2, "[]"),
        );
      }
    }
  }

  // Handle primitive types at root
  if (
    schema.type &&
    schema.type !== "object" &&
    schema.type !== "array" &&
    !schema.properties
  ) {
    const type = typeToString(schema.type, "any");
    fields.push({
      name: "result",
      type,
      description: schema.description || "",
      indent,
    });
  }

  return fields;
}

function createEndpointFromSchema(
  methodKey: string,
  methodDef: SchemaNode,
  endpoint: SchemaNode,
  isCheatcode = false,
): Endpoint {
  let methodName = methodKey;
  if (isCheatcode) {
    const surfnetMethodName = CHEATCODE_METHOD_MAPPING[methodKey];
    if (surfnetMethodName) {
      methodName = surfnetMethodName;
    }
  }

  if (typeof endpoint === "object" && endpoint.const) {
    methodName = String(endpoint.const);
    const responseSchemaForMethod = getResponseSchema(methodName);
    return {
      method_name: methodName,
      description: endpoint.description || `${methodName} method`,
      example_request: JSON.stringify(
        {
          jsonrpc: "2.0",
          id: 1,
          method: methodName,
          params: [],
        },
        null,
        2,
      ),
      example_response: formatResponseSchema(
        responseSchemaForMethod,
        methodName,
      ),
      status: "implemented",
      params: [],
      resultFields: extractResultFieldsFromSchema(responseSchemaForMethod),
    };
  }

  const schemaRef = methodDef.$ref?.split("/").pop();
  const actualMethodDef = schemaRef ? rpcDefByName(schemaRef) : methodDef;
  const params = extractParametersFromSchema(actualMethodDef, methodKey, "", 0);
  const exampleParams = actualMethodDef?.properties
    ? Object.keys(actualMethodDef.properties).map((key) =>
        generateSampleFromSchema(
          actualMethodDef.properties?.[key],
          rpcSchemaRoot,
          key,
        ),
      )
    : [];
  const responseSchemaForMethod = getResponseSchema(methodName);

  return {
    method_name: methodName,
    description: endpoint.description || `${methodName} method`,
    example_request: JSON.stringify(
      {
        jsonrpc: "2.0",
        id: 1,
        method: methodName,
        params: exampleParams,
      },
      null,
      2,
    ),
    example_response: formatResponseSchema(responseSchemaForMethod, methodName),
    status: "implemented",
    params,
    resultFields: extractResultFieldsFromSchema(responseSchemaForMethod),
  };
}

function extractEndpointsFromGroup(
  endpointGroupName: string,
  isCheatcode = false,
): Endpoint[] {
  const endpointGroup = rpcDefByName(endpointGroupName);

  if (!endpointGroup || !endpointGroup.oneOf) {
    return [];
  }

  const endpoints: Endpoint[] = [];

  endpointGroup.oneOf.forEach((endpoint) => {
    if (endpoint.type === "string" && endpoint.const) {
      endpoints.push(
        createEndpointFromSchema(
          String(endpoint.const),
          {},
          endpoint,
          isCheatcode,
        ),
      );
    } else if (endpoint.type === "object" && endpoint.properties) {
      Object.entries(endpoint.properties).forEach(([methodKey, methodDef]) => {
        endpoints.push(
          createEndpointFromSchema(methodKey, methodDef, endpoint, isCheatcode),
        );
      });
    }
  });

  return endpoints;
}

function getEndpointsByCategory(categoryName: string): Endpoint[] {
  const methodNames = endpointCategories[categoryName];
  if (!methodNames) return [];

  const allOtherEndpoints = [
    ...extractEndpointsFromGroup("endpoints4"), // bankData
    ...extractEndpointsFromGroup("endpoints5"), // full
    ...extractEndpointsFromGroup("endpoints6"), // minimal
  ];

  const categoryEndpoints = allOtherEndpoints.filter((endpoint) =>
    methodNames.includes(endpoint.method_name),
  );

  return Array.from(
    new Map(categoryEndpoints.map((e) => [e.method_name, e])).values(),
  );
}

function extractCheatcodeEndpoints(): Endpoint[] {
  const cheatcodesSchema = responseSchemaRoot.$defs?.SurfnetCheatcodesEndpoints;
  if (!cheatcodesSchema?.properties) return [];

  const endpoints: Endpoint[] = [];
  const schemaEndpoints = extractEndpointsFromGroup("endpoints7", true);
  const schemaMethodNames = new Set(
    schemaEndpoints.map((e) => e.method_name.replace("surfnet_", "")),
  );

  // Add endpoints from rpc-schema first
  endpoints.push(...schemaEndpoints);

  // Add missing endpoints from response schema
  Object.entries(cheatcodesSchema.properties).forEach(
    ([methodName, methodSchema]) => {
      if (schemaMethodNames.has(methodName)) return; // Already added from rpc-schema

      const surfnetMethodName =
        CHEATCODE_METHOD_MAPPING[methodName] || `surfnet_${methodName}`;
      const description =
        methodSchema.description?.replace(`${methodName} - `, "") ||
        `${methodName} method`;

      endpoints.push({
        method_name: surfnetMethodName,
        description,
        example_request: JSON.stringify(
          {
            jsonrpc: "2.0",
            id: 1,
            method: surfnetMethodName,
            params: [],
          },
          null,
          2,
        ),
        example_response: formatResponseSchema(methodSchema, methodName),
        status: "implemented",
        params: [],
        resultFields: extractResultFieldsFromSchema(methodSchema),
      });
    },
  );

  return endpoints;
}

// =================================================================================
// PUBLIC HELPER FUNCTIONS
// =================================================================================

export function getResponseSchema(
  methodName: string,
  endpointCategory?: string,
): SchemaNode {
  let group = endpointCategory || methodToGroupMap.get(methodName);

  if (!group && methodName.startsWith("surfnet_")) {
    const baseMethodName = Object.keys(CHEATCODE_METHOD_MAPPING).find(
      (key) => CHEATCODE_METHOD_MAPPING[key] === methodName,
    );
    if (baseMethodName) {
      group = methodToGroupMap.get(baseMethodName);
    }
  }

  if (group && schemaGroupMapping[group]) {
    const schemaGroup = responseDefByName(schemaGroupMapping[group]);
    if (schemaGroup?.properties?.[methodName]) {
      return schemaGroup.properties[methodName];
    }

    if (methodName.startsWith("surfnet_")) {
      const baseMethodName = methodName.replace("surfnet_", "");
      if (schemaGroup?.properties?.[baseMethodName]) {
        return schemaGroup.properties[baseMethodName];
      }
    }
  }

  const allEndpointGroups = Object.values(schemaGroupMapping);
  for (const groupName of allEndpointGroups) {
    const schemaGroup = responseDefByName(groupName);
    if (schemaGroup?.properties?.[methodName]) {
      return schemaGroup.properties[methodName];
    }
  }

  return {
    result: {
      type: ["object", "array", "string", "integer", "boolean", "null"],
      description:
        "The result data returned by the RPC method depends on the specific implementation.",
    },
  } as unknown as SchemaNode;
}

// =================================================================================
// ENDPOINT DATA EXTRACTION & EXPORT
// =================================================================================

export const cheatcodeEndpoints = extractCheatcodeEndpoints();
export const accountsEndpoints = Array.from(
  new Map(
    [
      ...extractEndpointsFromGroup("endpoints"),
      ...extractEndpointsFromGroup("endpoints2"),
      ...getEndpointsByCategory("accounts"),
    ].map((e) => [e.method_name, e]),
  ).values(),
);
export const adminEndpoints = extractEndpointsFromGroup("endpoints3");
export const networkEndpoints = getEndpointsByCategory("network");
export const nodeEndpoints = getEndpointsByCategory("node");
export const transactionEndpoints = getEndpointsByCategory("transaction");
