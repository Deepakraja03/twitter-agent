const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(data?.error || data?.message || 'API request failed', response.status)
  }

  return data as T
}

export const contentApi = {
  async generate(params: { prompt: string; tone?: string; contentType?: string }) {
    return apiRequest<{ success: boolean; content: string; type: string; tone: string; characterCount: number; posted: boolean }>(
      '/api/content/generate',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    )
  },
}

export const tweetApi = {
  async post(content: string) {
    return apiRequest<{ success: boolean; tweetId: string; url: string; content: string; timestamp: string }>(
      '/api/tweets/post',
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      }
    )
  },
}

export type { ApiError }
