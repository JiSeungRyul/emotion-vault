type LogMeta = Record<string, unknown> | undefined

export function logApiError(scope: string, message: string, meta?: LogMeta) {
  console.error(`[${scope}] ${message}`, meta ?? {})
}

export function logApiInfo(scope: string, message: string, meta?: LogMeta) {
  console.info(`[${scope}] ${message}`, meta ?? {})
}

export function buildErrorBody(code: string, message: string, meta?: LogMeta) {
  return {
    error: {
      code,
      message,
    },
    ...(meta ? { meta } : {}),
  }
}
