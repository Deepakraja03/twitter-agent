import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

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

// Analytics overview (stubbed)
app.get('/api/analytics/overview', (_req: Request, res: Response) => {
  const metrics = {
    totalFollowers: (12847).toLocaleString(),
    followingCount: (321).toLocaleString(),
    engagementRate: '2.3%',
    postsThisWeek: 7,
    avgResponseTime: '2.4h',
  };
  const recentActivity = Array.from({ length: 5 }).map((_, i) => ({
    id: `${Date.now()}-${i}`,
    content: `Recent tweet #${i + 1} - example analytics content`,
    timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
    engagement: Math.floor(Math.random() * 200),
  }));
  res.json({ success: true, metrics, recentActivity });
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
