'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart,
  BarChart3,
  Calendar,
  PenTool,
  Zap,
  Clock,
  Twitter,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
}

function MetricCard({ title, value, change, changeType, icon: Icon }: MetricCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType]

  const ChangeIcon = changeType === 'positive' ? ArrowUpRight : ArrowDownRight

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            <ChangeIcon className={`h-4 w-4 ${changeColor} mr-1`} />
            <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
            <span className="text-sm text-gray-500 ml-1">vs last week</span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  )
}

interface RecentActivityItem {
  id: string
  type: 'tweet' | 'reply' | 'like' | 'follow'
  content: string
  timestamp: string
  engagement?: number
}

function RecentActivity() {
  const activities: RecentActivityItem[] = [
    {
      id: '1',
      type: 'tweet',
      content: 'Just published: "The Future of AI in Social Media Marketing" - excited to share insights!',
      timestamp: '2 hours ago',
      engagement: 24
    },
    {
      id: '2',
      type: 'reply',
      content: 'Thanks for the great question! AI agents can definitely help with content consistency...',
      timestamp: '4 hours ago',
      engagement: 8
    },
    {
      id: '3',
      type: 'tweet',
      content: 'Building something amazing with @nextjs and @tailwindcss. The developer experience is incredible! 🚀',
      timestamp: '6 hours ago',
      engagement: 156
    },
    {
      id: '4',
      type: 'like',
      content: 'Liked a tweet about AI automation trends',
      timestamp: '8 hours ago'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tweet': return Twitter
      case 'reply': return MessageCircle
      case 'like': return Heart
      case 'follow': return Users
      default: return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'tweet': return 'text-blue-600 bg-blue-50'
      case 'reply': return 'text-green-600 bg-green-50'
      case 'like': return 'text-red-600 bg-red-50'
      case 'follow': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const colorClass = getActivityColor(activity.type)
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 line-clamp-2">{activity.content}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  {activity.engagement && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{activity.engagement} engagements</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activity
      </button>
    </div>
  )
}

function UpcomingPosts() {
  const upcomingPosts = [
    {
      id: '1',
      content: 'Weekly AI insights: How machine learning is transforming content creation...',
      scheduledFor: 'Today, 3:00 PM',
      status: 'scheduled'
    },
    {
      id: '2',
      content: 'Behind the scenes: Building our Twitter AI agent with Next.js and OpenAI',
      scheduledFor: 'Tomorrow, 9:00 AM',
      status: 'scheduled'
    },
    {
      id: '3',
      content: 'Thread: 10 tips for growing your Twitter audience organically 🧵',
      scheduledFor: 'Dec 29, 2:00 PM',
      status: 'draft'
    }
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Posts</h3>
      <div className="space-y-4">
        {upcomingPosts.map((post) => (
          <div key={post.id} className="border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-900 line-clamp-2 mb-2">{post.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{post.scheduledFor}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                post.status === 'scheduled' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {post.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        Manage schedule
      </button>
    </div>
  )
}

function QuickActions() {
  const actions = [
    {
      name: 'Generate Tweet',
      description: 'Create AI-powered content',
      icon: PenTool,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/dashboard/content'
    },
    {
      name: 'Schedule Post',
      description: 'Plan your content calendar',
      icon: Calendar,
      color: 'bg-green-500 hover:bg-green-600',
      href: '/dashboard/scheduler'
    },
    {
      name: 'View Analytics',
      description: 'Track your performance',
      icon: BarChart3,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/dashboard/analytics'
    },
    {
      name: 'Auto-Reply',
      description: 'Set up intelligent responses',
      icon: Zap,
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '/dashboard/settings'
    }
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.name}
            className={`${action.color} text-white p-4 rounded-lg transition-colors text-left group`}
          >
            <action.icon className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-sm">{action.name}</p>
            <p className="text-xs opacity-90">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export function DashboardOverview() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your Twitter presence.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Followers"
          value="12,847"
          change="+12.5%"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Engagement Rate"
          value="4.2%"
          change="+0.8%"
          changeType="positive"
          icon={Heart}
        />
        <MetricCard
          title="Posts This Week"
          value="23"
          change="+15.0%"
          changeType="positive"
          icon={Twitter}
        />
        <MetricCard
          title="Avg. Response Time"
          value="2.4h"
          change="-0.6h"
          changeType="positive"
          icon={Clock}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <UpcomingPosts />
        </div>
      </div>
    </div>
  )
}