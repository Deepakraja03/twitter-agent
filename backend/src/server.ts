import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

// Simple in-memory cache for analytics to reduce upstream calls and avoid 429s
const ANALYTICS_TTL_MS = Number(process.env.ANALYTICS_TTL_MS ?? 60_000);

type AnalyticsPayload = {
  success: true;
  metrics: any;
  recentActivity: any;
};

const analyticsCache = new Map<string, { payload: AnalyticsPayload; expiresAt: number }>();

// CORS & JSON
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Basic rate limiting for API namespace
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Twitter Agent API' });
});

// Content generation (stubbed)
app.post('/api/content/generate', (req: Request, res: Response) => {
  const { prompt = '', tone = 'professional', contentType = 'tweet' } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  const maxLen = 240;
  const base = `[${tone}] ${prompt}`;
  const content = base.length > maxLen ? `${base.slice(0, maxLen - 3)}...` : base;
  res.json({ success: true, content, type: contentType, tone, characterCount: content.length, posted: false });
});

// Tweet post (stubbed — accepts content and optional accessToken)
app.post('/api/tweets/post', (req: Request, res: Response) => {
  const { content } = req.body || {};
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content is required' });
  }
  const fakeId = `${Date.now()}`;
  res.json({
    success: true,
    tweetId: fakeId,
    url: `https://twitter.com/i/web/status/${fakeId}`,
    content,
    timestamp: new Date().toISOString(),
  });
});

// Analytics overview (Twitter live using user access token)
app.get('/api/analytics/overview', async (req: Request, res: Response) => {
  let cacheKey = '';
  try {
    const auth = req.headers.authorization || '';
    const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const token = (req.query.accessToken as string) || bearer;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Twitter access token required' });
    }

    // Cache lookup before making upstream calls
    cacheKey = token;
    const cached = analyticsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.set('x-cache', 'HIT');
      return res.json(cached.payload);
    }

    const client = new TwitterApi(token);

    // Get current user profile
    const me = await client.v2.me({ 'user.fields': ['public_metrics', 'created_at', 'description', 'verified'] });
    const user = me.data;
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const userId = user.id;
    const followers = user.public_metrics?.followers_count || 0;
    const following = user.public_metrics?.following_count || 0;

    // Fetch recent tweets
    const timeline = await client.v2.userTimeline(userId, {
      max_results: 20,
      'tweet.fields': ['created_at', 'public_metrics'],
      exclude: ['replies', 'retweets'] as any,
    });

    const tweets = timeline.tweets || [];

    // Compute metrics
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let postsThisWeek = 0;
    let totalLikes = 0;
    let totalRetweets = 0;
    let totalReplies = 0;

    const recentActivity = tweets.slice(0, 5).map((t) => {
      const likes = t.public_metrics?.like_count || 0;
      const rts = t.public_metrics?.retweet_count || 0;
      const replies = t.public_metrics?.reply_count || 0;
      totalLikes += likes;
      totalRetweets += rts;
      totalReplies += replies;
      const created = t.created_at ? new Date(t.created_at) : new Date();
      if (created >= oneWeekAgo && created <= now) postsThisWeek += 1;
      return {
        id: t.id,
        content: t.text || '',
        timestamp: t.created_at || new Date().toISOString(),
        engagement: likes + rts + replies,
      };
    });

    const totalEngagements = totalLikes + totalRetweets + totalReplies;
    const engagementRate = tweets.length > 0 ? `${((totalEngagements / tweets.length) || 0).toFixed(1)}%` : '0.0%';

    const metrics = {
      totalFollowers: followers.toLocaleString(),
      followingCount: following.toLocaleString(),
      engagementRate,
      postsThisWeek,
      avgResponseTime: '—', // Not computed here
    };

    const payload: AnalyticsPayload = { success: true, metrics, recentActivity };
    analyticsCache.set(cacheKey, { payload, expiresAt: Date.now() + ANALYTICS_TTL_MS });
    res.set('x-cache', cached ? 'REFRESH' : 'MISS');
    return res.json(payload);
  } catch (err: any) {
    // Preserve upstream HTTP status when available (e.g., 401, 429) instead of always returning 500
    let status = 500;
    const codeNum = typeof err?.code === 'number' ? err.code : undefined;
    const statusNum = typeof err?.status === 'number' ? err.status : undefined;

    if (typeof statusNum === 'number') {
      status = statusNum;
    } else if (typeof codeNum === 'number' && codeNum >= 400 && codeNum < 600) {
      status = codeNum;
    }

    // If rate limited by Twitter, include Retry-After header and basic rate limit info if present
    if (status === 429 && err?.rateLimit) {
      const nowSec = Math.floor(Date.now() / 1000);
      const resetSec = Number(err.rateLimit.reset) || 0;
      const retryAfter = resetSec > nowSec ? resetSec - nowSec : 60;
      res.set('Retry-After', String(retryAfter));
    }

    // Serve stale cache on 429 to avoid breaking UX
    if (status === 429 && cacheKey) {
      const stale = analyticsCache.get(cacheKey);
      if (stale) {
        res.set('x-cache', 'STALE');
        res.set('x-upstream-status', '429');
        return res.status(200).json(stale.payload);
      }
    }

    const payload: any = { success: false, error: err?.message || 'Failed to fetch analytics' };
    if (status === 429 && err?.rateLimit) {
      payload.rateLimit = {
        limit: err.rateLimit.limit,
        remaining: err.rateLimit.remaining,
        reset: err.rateLimit.reset,
      };
    }

    return res.status(status).json(payload);
  }
});

// Analytics detailed (stubbed)
app.get('/api/analytics/detailed', (req: Request, res: Response) => {
  const { timeRange = '7d' } = req.query;
  const ranges: Record<string, number> = { '24h': 24, '7d': 7, '30d': 30 };
  const len = ranges[String(timeRange)] ?? 7;
  const engagement = Array.from({ length: len }, () => Math.floor(Math.random() * 100) + 10);
  const followers = Array.from({ length: Math.min(len, 10) }, (_, i) => 12000 + i * 10 + Math.floor(Math.random() * 20));
  const posts = Math.floor(Math.random() * 20) + 5;
  res.json({ success: true, timeRange, data: { engagement, followers, posts, growth: { followers: '+127', engagement: '+15.3%', posts: `${posts}` } } });
});

// Top posts (stubbed)
app.get('/api/analytics/top-posts', (req: Request, res: Response) => {
  const limit = Number(req.query.limit ?? 10);
  const posts = Array.from({ length: limit }).map((_, i) => ({
    id: `${Date.now()}-${i}`,
    content: `Top post #${i + 1} content`,
    timestamp: new Date(Date.now() - i * 86400_000).toISOString(),
    likes: Math.floor(Math.random() * 500),
    retweets: Math.floor(Math.random() * 200),
    replies: Math.floor(Math.random() * 50),
    views: Math.floor(Math.random() * 5000) + 1000,
    engagement: Math.floor(Math.random() * 700) + 50,
  }));
  res.json({ success: true, posts });
});

// Tweet search (stubbed)
app.get('/api/tweets/search', (req: Request, res: Response) => {
  const query = String(req.query.query || '').trim();
  const maxResults = Number(req.query.maxResults ?? 10);
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });
  const tweets = Array.from({ length: maxResults }).map((_, i) => ({
    id: `${Date.now()}-${i}`,
    text: `Result ${i + 1} for '${query}'`,
    authorId: `${1000 + i}`,
    createdAt: new Date(Date.now() - i * 60000).toISOString(),
    metrics: { like_count: Math.floor(Math.random() * 50) },
  }));
  res.json({ success: true, query, count: tweets.length, tweets });
});

// Scheduler posts (stubbed)
app.get('/api/scheduler/posts', (_req: Request, res: Response) => {
  const posts = [
    { id: '1', content: 'Weekly AI insights...', scheduledFor: new Date(Date.now() + 3 * 3600_000).toISOString(), status: 'scheduled' },
    { id: '2', content: 'Behind the scenes: Building our 𝕏 agent', scheduledFor: new Date(Date.now() + 24 * 3600_000).toISOString(), status: 'scheduled' },
    { id: '3', content: 'Thread: 10 tips for growth 🧵', scheduledFor: new Date(Date.now() + 48 * 3600_000).toISOString(), status: 'draft' },
  ];
  res.json({ success: true, posts });
});

// Schedule a post (stubbed)
app.post('/api/scheduler/schedule', (req: Request, res: Response) => {
  const { content, scheduledFor } = req.body || {};
  if (!content || !scheduledFor) return res.status(400).json({ error: 'Content and scheduledFor are required' });
  const post = { id: `${Date.now()}`, content, scheduledFor, status: 'scheduled', createdAt: new Date().toISOString() };
  res.json({ success: true, post, message: 'Post scheduled successfully' });
});

// Auth status (stubbed)
app.get('/api/auth/twitter/status', (_req: Request, res: Response) => {
  res.json({ success: true, authenticated: false, sessionsCount: 0, userId: null });
});

// 404
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`\n🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
