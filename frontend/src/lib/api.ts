const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Throttle map for endpoints that require minimum intervals between calls
const MIN_INTERVALS: Record<string, number> = {
  '/api/analytics/overview': 3000,
}

const endpointChains = new Map<string, Promise<number>>()

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function throttleEndpoint(endpoint: string): Promise<void> {
  const min = MIN_INTERVALS[endpoint]
  if (!min) return
  const prev = endpointChains.get(endpoint) || Promise.resolve(0)
  const next = prev.then(async (last) => {
    const lastTime = typeof last === 'number' ? last : 0
    const now = Date.now()
    const wait = lastTime ? Math.max(0, min - (now - lastTime)) : 0
    if (wait > 0) await sleep(wait)
    return Date.now()
  })
  endpointChains.set(endpoint, next.catch(() => Date.now()))
  await next
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

export const analyticsApi = {
  async overview(accessToken?: string) {
    const headers: Record<string, string> = {}
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
    return apiRequest<{ success: boolean; metrics: { totalFollowers: string; followingCount: string; engagementRate: string; postsThisWeek: number; avgResponseTime: string }; recentActivity: Array<{ id: string; content: string; timestamp: string; engagement: number }> }>(
      '/api/analytics/overview',
      { headers }
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
