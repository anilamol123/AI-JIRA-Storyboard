export class ApiError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export interface ApiStream {
  read(onChunk: (text: string) => void): Promise<string>
  cancel(): Promise<void>
}

export interface ApiClient {
  postStream(path: string, body: unknown, signal?: AbortSignal): Promise<ApiStream>
}

export function createClient(
  baseUrl = "",
  defaultHeaders: HeadersInit = {}
): ApiClient {
  return {
    async postStream(path, body, signal) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain, text/event-stream, application/json",
          ...defaultHeaders,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new ApiError(
          message || `Request failed with status ${response.status}`,
          response.status
        )
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new ApiError("Streaming response has no body")
      }

      return {
        async read(onChunk) {
          const decoder = new TextDecoder("utf-8")
          let buffer = ""
          let fullText = ""

          for (;;) {
            const { done, value } = await reader.read()
            if (done) break

            // TextDecoder's stream mode buffers partial multi-byte sequences
            // so a character split across chunks is decoded once complete.
            buffer += decoder.decode(value, { stream: true })
            if (buffer) {
              fullText += buffer
              onChunk(buffer)
              buffer = ""
            }
          }

          buffer += decoder.decode()
          if (buffer) {
            fullText += buffer
            onChunk(buffer)
          }

          return fullText
        },
        async cancel() {
          await reader.cancel()
        },
      }
    },
  }
}

export const client = createClient()