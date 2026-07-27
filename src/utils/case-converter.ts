type JsonPrimitive = string | number | boolean | null
type JsonArray = JsonValue[]
type JsonObject = { [key: string]: JsonValue }
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

function isPlainObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function convertSnakeToCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertSnakeToCamel)
  }

  if (isPlainObject(obj)) {
    const result: JsonObject = {}
    for (const key of Object.keys(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
      result[camelKey] = convertSnakeToCamel(obj[key]) as JsonValue
    }
    return result
  }

  return obj
}

export function convertCamelToSnake(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertCamelToSnake)
  }

  if (isPlainObject(obj)) {
    const result: JsonObject = {}
    for (const key of Object.keys(obj)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      result[snakeKey] = convertCamelToSnake(obj[key]) as JsonValue
    }
    return result
  }

  return obj
}
