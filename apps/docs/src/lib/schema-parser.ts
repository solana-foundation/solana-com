import rpcSchema from "@/data/rpc-schema.json";
import responseSchema from "@/data/response_schema.json";
import type { Endpoint } from "@/lib/rpc-endpoints";

// =================================================================================
// TYPES
// =================================================================================

export interface SchemaNode {
  $ref?: string;
  $defs?: Record<string, SchemaNode>;
  type?: string | string[];
  format?: string;
  description?: string;
  properties?: Record<string, SchemaNode>;
  required?: string[];
  items?: SchemaNode | SchemaNode[];
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  oneOf?: SchemaNode[];
  anyOf?: SchemaNode[];
}

const rpcSchemaRoot = rpcSchema as unknown as SchemaNode;
const responseSchemaRoot = responseSchema as unknown as SchemaNode;

// =================================================================================
// INTERNAL HELPERS
// =================================================================================

function resolveSchemaReference(
  ref: string,
  schemaSource: SchemaNode,
): SchemaNode | null {
  const refName = ref.split("/").pop();
  return refName ? (schemaSource.$defs?.[refName] ?? null) : null;
}

/** One arm of a union that carries exactly one named field. */
interface UnionField {
  name: string;
  schema: SchemaNode;
  description: string;
}

/**
 * Splits a one-of union into its fields, but only when every arm is an object
 * holding exactly one property.
 *
 * That is the shape schemars emits for a Rust enum of single-field struct
 * variants — `TimeTravelConfig` becomes `{absoluteEpoch}` / `{absoluteSlot}` /
 * `{absoluteTimestamp}`. Those fields each deserve a row in the parameters
 * table. Any other union (mixed consts, primitives, refs to objects) reads
 * better as a type expression, so this returns null and the caller falls back
 * to `describeUnionType`.
 */
function splitSingleFieldUnion(
  def: SchemaNode | null | undefined,
): UnionField[] | null {
  const variants = def?.oneOf;
  if (!variants?.length) return null;

  const fields: UnionField[] = [];
  for (const variant of variants) {
    const properties = variant.properties;
    if (variant.type !== "object" || !properties) return null;

    const names = Object.keys(properties);
    if (names.length !== 1) return null;

    const schema = properties[names[0]];
    fields.push({
      name: names[0],
      schema,
      // schemars puts the doc comment on the variant, not on its field.
      description: variant.description || schema.description || "",
    });
  }

  return fields;
}

/** Renders a schema's own type as a display string, e.g. `integer` or `string | null`. */
function describeType(schema: SchemaNode | null | undefined): string {
  if (!schema?.type) return "any";
  if (!Array.isArray(schema.type)) return schema.type;

  const label = schema.type.filter((t) => t !== "null").join(" | ");
  return schema.type.includes("null") ? `${label} (optional)` : label;
}

/**
 * Renders a referenced definition as a display string: its own type, its enum
 * values, or — for a union — the alternatives joined with `|`.
 */
function describeUnionType(
  referencedDef: SchemaNode | null,
  refName: string | undefined,
): string {
  if (!referencedDef) return refName || "object";

  if (referencedDef.type) return describeType(referencedDef);

  if (referencedDef.enum) {
    return referencedDef.enum.map((e) => JSON.stringify(e)).join(" | ");
  }

  const variants = referencedDef.oneOf ?? referencedDef.anyOf;
  if (variants) {
    return variants
      .map((option) => {
        // A variant can carry both `const` and `type`; the literal is the
        // useful half.
        if (option.const !== undefined) return `"${String(option.const)}"`;
        if (option.type) return describeType(option);
        if (option.$ref) return option.$ref.split("/").pop();
        return "unknown";
      })
      .filter((label, index, all) => all.indexOf(label) === index)
      .join(" | ");
  }

  return refName || "object";
}

/**
 * Builds the parameter rows for a union that `splitSingleFieldUnion` accepted:
 * a header for the parameter itself, then one row per alternative. None of the
 * alternatives is individually required — the header says to pick one.
 */
function unionFieldRows(
  fields: UnionField[],
  displayName: string,
  description: string,
  parentName: string,
  isOptional: boolean,
): Endpoint["params"] {
  const pickOne = "Provide exactly one of the fields below.";

  return [
    {
      name: displayName,
      type: isOptional ? "object (optional)" : "object",
      description: description ? `${description} ${pickOne}` : pickOne,
      isObjectHeader: true,
      parentName: parentName || undefined,
      required: !isOptional,
    },
    ...fields.map((field) => ({
      name: field.name,
      type: describeType(field.schema),
      description: field.description,
      isNested: true,
      parentName: displayName,
      required: false,
    })),
  ];
}
// =================================================================================
// EXPORTED SCHEMA PARSERS
// =================================================================================

/**
 * Recursively extracts and flattens parameters from a JSON schema definition for a method.
 * This function navigates through object properties, references ($ref), and other schema constructs
 * to produce a simple list of parameters for display.
 *
 * @param methodDef - The JSON schema definition for the method's parameters.
 * @param methodName - The name of the method, used for context in descriptions.
 * @param parentPath - The path of the parent object, for nested parameters.
 * @param nestingLevel - The current depth in the schema, for indentation and layout.
 * @param isParentOptional - Indicates if the parent parameter is optional.
 * @returns An array of parameter objects for the endpoint.
 */
export function extractParametersFromSchema(
  methodDef: SchemaNode | null | undefined,
  methodName: string,
  parentPath: string = "",
  nestingLevel: number = 0,
  isParentOptional = false,
  parentName: string = "",
): Endpoint["params"] {
  if (!methodDef || typeof methodDef !== "object") return [];

  const properties: Record<string, SchemaNode> = methodDef.properties || {};
  const required = new Set(methodDef.required || []);

  const params: Endpoint["params"] = [];

  Object.entries(properties).forEach(([propName, propDef]) => {
    const isOptional = isParentOptional || !required.has(propName);
    const displayName = propName;

    function getBestDescription(
      def: SchemaNode | null,
      fallbackName: string,
    ): string {
      if (def && def.description) return def.description;
      if (def && def.$ref) {
        const referencedDef = resolveSchemaReference(def.$ref, rpcSchemaRoot);
        if (referencedDef && referencedDef.description)
          return referencedDef.description;
      }
      const baseName = fallbackName.split(".").pop()?.toLowerCase() || "";
      return `${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
    }

    if (propDef.$ref) {
      const referencedDef = resolveSchemaReference(propDef.$ref, rpcSchemaRoot);
      if (
        referencedDef &&
        referencedDef.type === "object" &&
        referencedDef.properties
      ) {
        params.push({
          name: displayName,
          type: isOptional ? "object (optional)" : "object",
          description:
            getBestDescription(propDef, displayName) ||
            getBestDescription(referencedDef, displayName) ||
            `Configuration object`,
          isObjectHeader: true,
          parentName: parentName || undefined,
          required: !isOptional,
        });
        const nestedParams = extractParametersFromSchema(
          referencedDef,
          methodName,
          parentPath,
          nestingLevel + 1,
          isOptional,
          displayName,
        );
        params.push(...nestedParams);
        return;
      } else {
        const refName = propDef.$ref.split("/").pop();
        const unionFields = splitSingleFieldUnion(referencedDef);
        if (unionFields) {
          params.push(
            ...unionFieldRows(
              unionFields,
              displayName,
              getBestDescription(propDef, displayName) ||
                getBestDescription(referencedDef, displayName),
              parentName,
              isOptional,
            ),
          );
          return;
        }
        params.push({
          name: displayName,
          type: describeUnionType(referencedDef, refName),
          description:
            getBestDescription(propDef, displayName) ||
            getBestDescription(referencedDef, displayName),
          isNested: nestingLevel > 0,
          parentName: parentName || undefined,
          required: !isOptional,
        });
        return;
      }
    }

    if (propDef.anyOf) {
      const nonNullOption = propDef.anyOf.find(
        (option) => option.type !== "null" && option.$ref,
      );
      if (nonNullOption && nonNullOption.$ref) {
        const referencedDef = resolveSchemaReference(
          nonNullOption.$ref,
          rpcSchemaRoot,
        );
        if (
          referencedDef &&
          referencedDef.type === "object" &&
          referencedDef.properties
        ) {
          params.push({
            name: displayName,
            type: "object",
            description:
              getBestDescription(propDef, displayName) ||
              getBestDescription(referencedDef, displayName) ||
              `Configuration object`,
            isObjectHeader: true,
            parentName: parentName || undefined,
            required: false,
          });
          const nestedParams = extractParametersFromSchema(
            referencedDef,
            methodName,
            parentPath,
            nestingLevel + 1,
            true,
            displayName,
          );
          params.push(...nestedParams);
          return;
        }

        // Not an object with properties — most likely a union. Falling through
        // here would land in the primitive tail below, which cannot see past
        // the `anyOf` wrapper and would label the parameter `string`.
        const description =
          getBestDescription(propDef, displayName) ||
          getBestDescription(referencedDef, displayName);
        const unionFields = splitSingleFieldUnion(referencedDef);
        if (unionFields) {
          params.push(
            ...unionFieldRows(
              unionFields,
              displayName,
              description,
              parentName,
              true,
            ),
          );
          return;
        }

        params.push({
          name: displayName,
          type: describeUnionType(
            referencedDef,
            nonNullOption.$ref.split("/").pop(),
          ),
          description,
          isNested: nestingLevel > 0,
          parentName: parentName || undefined,
          required: false,
        });
        return;
      }
    }

    if (propDef.type === "object" && propDef.properties) {
      params.push({
        name: displayName,
        type: "object",
        description:
          getBestDescription(propDef, displayName) || `Configuration object`,
        isObjectHeader: true,
        parentName: parentName || undefined,
        required: !isOptional,
      });
      const nestedParams = extractParametersFromSchema(
        propDef,
        methodName,
        parentPath,
        nestingLevel + 1,
        isOptional,
        displayName,
      );
      params.push(...nestedParams);
      return;
    }

    let type = "string";
    let description = getBestDescription(propDef, propName);

    if (propDef.type) {
      if (Array.isArray(propDef.type)) {
        type = propDef.type.filter((t) => t !== "null").join(" | ");
        if (propDef.type.includes("null")) {
          type += " (optional)";
        }
      } else {
        type = propDef.type;
        if (propDef.format) {
          type = propDef.type;
        }
        if (
          type === "array" &&
          propDef.items &&
          !Array.isArray(propDef.items)
        ) {
          const items = propDef.items;
          if (items.type) {
            type = `array[${items.type}]`;
            if (!description && items.description) {
              description = items.description;
            }
          } else if (items.$ref) {
            const refName = items.$ref.split("/").pop();
            type = `array[${refName}]`;
            const referencedDef = resolveSchemaReference(
              items.$ref,
              rpcSchemaRoot,
            );
            if (!description && referencedDef && referencedDef.description) {
              description = referencedDef.description;
            }
          } else {
            type = "array";
          }
        }
      }
    } else if (propDef.oneOf) {
      type = "union type";
      const unionTypes = propDef.oneOf.map((option) => {
        if (option.type) return option.type;
        if (option.const) return `"${String(option.const)}"`;
        if (option.$ref) return option.$ref.split("/").pop();
        return "unknown";
      });
      if (unionTypes.length > 0) {
        type = unionTypes.join(" | ");
      }
    }

    params.push({
      name: displayName,
      type,
      description,
      isNested: nestingLevel > 0,
      parentName: parentName || undefined,
      required: !isOptional,
    });
  });

  return params;
}

export function generateSampleFromSchema(
  schemaObj: SchemaNode | null | undefined,
  schemaSource: SchemaNode,
  fieldName?: string,
): unknown {
  if (!schemaObj) return null;

  // Handle $ref
  if (schemaObj.$ref) {
    const refPath = schemaObj.$ref.replace("#/$defs/", "");
    const referencedSchema = schemaSource.$defs?.[refPath];
    if (referencedSchema) {
      return generateSampleFromSchema(
        referencedSchema,
        schemaSource,
        refPath || fieldName,
      );
    }
    return null;
  }

  // Handle const values
  if (schemaObj.const !== undefined) {
    return schemaObj.const;
  }

  // Handle enums - return first value
  if (
    schemaObj.enum &&
    Array.isArray(schemaObj.enum) &&
    schemaObj.enum.length > 0
  ) {
    return schemaObj.enum[0];
  }

  // Handle anyOf - pick first non-null option
  if (schemaObj.anyOf) {
    const nonNullOption = schemaObj.anyOf.find((item) => item.type !== "null");
    if (nonNullOption) {
      return generateSampleFromSchema(nonNullOption, schemaSource, fieldName);
    }
    return null;
  }

  // Handle oneOf - pick first non-null option
  if (schemaObj.oneOf) {
    const nonNullOption = schemaObj.oneOf.find((item) => item.type !== "null");
    if (nonNullOption) {
      return generateSampleFromSchema(nonNullOption, schemaSource, fieldName);
    }
    return null;
  }

  // Handle objects
  if (schemaObj.type === "object" && schemaObj.properties) {
    const sample: Record<string, unknown> = {};
    Object.entries(schemaObj.properties).forEach(([key, value]) => {
      sample[key] = generateSampleFromSchema(value, schemaSource, key);
    });
    return sample;
  }

  // Handle arrays
  if (schemaObj.type === "array" && schemaObj.items) {
    if (Array.isArray(schemaObj.items)) {
      return schemaObj.items.map((item) =>
        generateSampleFromSchema(item, schemaSource, fieldName),
      );
    }
    if (
      fieldName === "accounts" ||
      fieldName === "constants" ||
      fieldName === "instructions" ||
      fieldName === "errors" ||
      fieldName === "events" ||
      fieldName === "types"
    ) {
      return [];
    }
    return [generateSampleFromSchema(schemaObj.items, schemaSource, fieldName)];
  }

  // Handle primitive types with realistic examples
  if (schemaObj.type) {
    const getIsTypeOptionalAndStripType = (
      typeDef: string | string[],
    ): [string, boolean] => {
      if (Array.isArray(typeDef)) {
        return [typeDef[0] || "string", typeDef.includes("null")];
      }
      return [typeDef, false];
    };
    const [typeStr] = getIsTypeOptionalAndStripType(schemaObj.type);
    switch (typeStr) {
      case "string":
        // Use field name to generate contextual examples
        if (fieldName) {
          const name = fieldName.toLowerCase();
          if (
            name.includes("pubkey") ||
            name.includes("address") ||
            name.includes("account")
          ) {
            return "83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri";
          }
          if (name.includes("signature") || name.includes("sig")) {
            return "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW";
          }
          if (name.includes("hash") || name.includes("blockhash")) {
            return "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N";
          }
          if (name.includes("encoding")) {
            return "base64";
          }
          if (name.includes("commitment")) {
            return "finalized";
          }
          if (name.includes("data")) {
            return "0x3b9aca00";
          }
          if (name.includes("owner")) {
            return "11111111111111111111111111111111";
          }
          if (name === "destinationprogramid") {
            return "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
          }
          if (name.includes("tokenprogram") || name.includes("programid")) {
            return "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
          }
          if (name === "depth") {
            return "instruction";
          }
          return `<some-${name}>`;
        }
        return "string";
      case "integer":
        if (fieldName) {
          const name = fieldName.toLowerCase();
          if (name.includes("slot")) return 123456789;
          if (
            name.includes("lamport") ||
            name.includes("balance") ||
            name.includes("amount")
          )
            return 1000000000;
          if (name.includes("epoch")) return 100;
        }
        return 0;
      case "number":
        return 0;
      case "boolean":
        return true;
      case "null":
        return null;
      case "array":
        return [];
      case "object":
        return {};
      default:
        return schemaObj.type;
    }
  }

  // If we have default value, use it
  if (schemaObj.default !== undefined) {
    return schemaObj.default;
  }

  return null;
}

export function formatResponseSchema(
  schema: SchemaNode | null | undefined,
  methodName?: string,
): string {
  if (!schema) {
    return JSON.stringify({ error: "Schema not found" }, null, 2);
  }

  const sampleResponse = generateSampleFromSchema(
    schema,
    responseSchemaRoot,
    methodName,
  );

  return JSON.stringify(
    {
      jsonrpc: "2.0",
      id: 1,
      result: sampleResponse,
    },
    null,
    2,
  );
}
