#!/usr/bin/env node
/**
 * generate-dtos.mjs
 *
 * Reads openapi.json and generates TypeScript DTO interfaces into
 * src/domain/dtos/<tag>.ts
 *
 * Usage:
 *   node scripts/generate-dtos.mjs
 *   node scripts/generate-dtos.mjs --input path/to/openapi.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const inputIdx = args.indexOf('--input')
const OPENAPI_PATH =
  inputIdx !== -1
    ? path.resolve(args[inputIdx + 1])
    : path.join(ROOT, 'openapi.json')
const OUTPUT_DIR = path.join(ROOT, 'src', 'dtos')

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert a string to PascalCase */
function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase())
}

/** Convert a tag name to a safe filename stem */
function tagToFileStem(tag) {
  return tag.toLowerCase().replace(/\s+/g, '-')
}

/** Convert a tag name to a TS namespace/prefix */
function tagToPrefix(tag) {
  return toPascalCase(tag.replace(/\s+/g, '_'))
}

/**
 * Map an OpenAPI schema type to a TypeScript type string.
 * Handles: primitives, arrays, objects, enums, allOf/anyOf/oneOf.
 */
function schemaToTs(schema, indent = 0, refs = new Map()) {
  if (!schema) return 'unknown'

  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)

  // $ref resolution
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop()
    return refs.get(refName) ?? toPascalCase(refName)
  }

  // enum
  if (schema.enum) {
    return schema.enum.map((v) => JSON.stringify(v)).join(' | ')
  }

  // allOf / anyOf / oneOf
  const combiner = schema.allOf ?? schema.anyOf ?? schema.oneOf
  if (combiner) {
    const op = schema.allOf ? ' & ' : ' | '
    return combiner.map((s) => schemaToTs(s, indent, refs)).join(op)
  }

  // array
  if (schema.type === 'array') {
    const itemType = schemaToTs(schema.items ?? {}, indent, refs)
    return `Array<${itemType}>`
  }

  // object (inline)
  if (schema.type === 'object' || schema.properties) {
    const props = schema.properties ?? {}
    const required = new Set(schema.required ?? [])
    const lines = Object.entries(props).map(([key, propSchema]) => {
      const opt = required.has(key) ? '' : '?'
      const tsType = schemaToTs(propSchema, indent + 1, refs)
      const comment = propSchema.description
        ? `${innerPad}/** ${propSchema.description} */\n`
        : ''
      return `${comment}${innerPad}${key}${opt}: ${tsType};`
    })

    if (lines.length === 0) return 'Record<string, unknown>'
    return `{\n${lines.join('\n')}\n${pad}}`
  }

  // primitives
  switch (schema.type) {
    case 'string':
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'null':
      return 'null'
    default:
      // no type — could be any
      return 'unknown'
  }
}

/**
 * Extract a flat list of named schemas from a single OpenAPI operation.
 * Returns { name, schema, kind } where kind is "Request" | "Response" | "ErrorResponse"
 */
function extractOperationSchemas(operationId, operation) {
  const results = []

  // Request body
  const bodySchema =
    operation.requestBody?.content?.['application/json']?.schema
  if (bodySchema) {
    results.push({
      name: `${operationId}Request`,
      schema: bodySchema,
      kind: 'Request',
    })
  }

  // Responses
  for (const [statusCode, response] of Object.entries(
    operation.responses ?? {},
  )) {
    const respSchema = response.content?.['application/json']?.schema
    if (!respSchema) continue

    const isError = parseInt(statusCode, 10) >= 400
    const suffix = isError ? 'ErrorResponse' : 'Response'
    results.push({
      name: `${operationId}${suffix}`,
      schema: respSchema,
      kind: suffix,
    })
  }

  return results
}

/**
 * Derive a clean operationId from HTTP method + path when the spec
 * doesn't provide one.
 *
 * e.g. GET /api/products/{productId} → GetProductByProductId
 */
function deriveOperationId(method, urlPath) {
  const parts = urlPath
    .replace(/^\/api\//, '')
    .split('/')
    .map((seg) => {
      if (seg.startsWith('{') && seg.endsWith('}')) {
        return 'By' + toPascalCase(seg.slice(1, -1))
      }
      return toPascalCase(seg)
    })
  return toPascalCase(method) + parts.join('')
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(OPENAPI_PATH)) {
    console.error(`❌  openapi.json not found at: ${OPENAPI_PATH}`)
    process.exit(1)
  }

  const api = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'))

  // Group operations by tag
  /** @type {Map<string, Array<{operationId: string, schema: object, kind: string}>>} */
  const tagSchemas = new Map()

  for (const [urlPath, pathItem] of Object.entries(api.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (typeof operation !== 'object' || !operation.responses) continue

      const tags = operation.tags ?? ['Untagged']
      const operationId = operation.operationId
        ? toPascalCase(operation.operationId)
        : deriveOperationId(method, urlPath)

      const schemas = extractOperationSchemas(operationId, operation)

      for (const tag of tags) {
        if (!tagSchemas.has(tag)) tagSchemas.set(tag, [])
        tagSchemas.get(tag).push(...schemas)
      }
    }
  }

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const generatedFiles = []

  for (const [tag, schemas] of tagSchemas) {
    const prefix = tagToPrefix(tag)
    const fileStem = tagToFileStem(tag)
    const filePath = path.join(OUTPUT_DIR, `${fileStem}.ts`)

    // Deduplicate by name (keep first occurrence)
    const seen = new Set()
    const unique = schemas.filter(({ name }) => {
      if (seen.has(name)) return false
      seen.add(name)
      return true
    })

    const lines = [
      `// AUTO-GENERATED — DO NOT EDIT`,
      `// Source: openapi.json  |  Tag: ${tag}`,
      `// Run \`node scripts/generate-dtos.mjs\` to regenerate`,
      ``,
    ]

    for (const { name, schema } of unique) {
      const tsType = schemaToTs(schema, 0)

      if (tsType.startsWith('{')) {
        // Inline object → emit as interface
        const body = tsType
          .slice(1, -1) // strip outer { }
          .trim()
        lines.push(`export interface ${name} ${tsType}`)
      } else if (tsType.startsWith('Array<')) {
        // Top-level array → type alias
        lines.push(`export type ${name} = ${tsType};`)
      } else {
        // Primitive / union / intersection → type alias
        lines.push(`export type ${name} = ${tsType};`)
      }
      lines.push(``)
    }

    // Index type that re-exports all names for convenience
    lines.push(
      `// ─── Namespace re-export ────────────────────────────────────────────────────`,
    )
    lines.push(`export namespace ${prefix} {`)
    for (const { name } of unique) {
      lines.push(`  export type ${name} = import("./${fileStem}").${name};`)
    }
    lines.push(`}`)
    lines.push(``)

    fs.writeFileSync(filePath, lines.join('\n'), 'utf8')
    generatedFiles.push({
      tag,
      filePath: path.relative(ROOT, filePath),
      count: unique.length,
    })
    console.log(
      `✅  ${path.relative(ROOT, filePath)}  (${unique.length} types)`,
    )
  }

  // Generate barrel index
  const indexLines = [
    `// AUTO-GENERATED — DO NOT EDIT`,
    `// Run \`node scripts/generate-dtos.mjs\` to regenerate`,
    ``,
  ]
  for (const { tag, filePath } of generatedFiles) {
    const stem = tagToFileStem(tag)
    indexLines.push(`export * from "./${stem}";`)
  }
  indexLines.push(``)

  const indexPath = path.join(OUTPUT_DIR, 'index.ts')
  fs.writeFileSync(indexPath, indexLines.join('\n'), 'utf8')
  console.log(`✅  ${path.relative(ROOT, indexPath)}  (barrel index)`)
  console.log(
    `\n🎉  Done — ${generatedFiles.length} files generated in src/domain/dtos/`,
  )
}

main()
