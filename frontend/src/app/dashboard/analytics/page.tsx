'use client'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart,
  Repeat2,
  Eye,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function AnalyticsPage() {
  const metrics = [
    {
      name: 'Total Impressions',
      value: '847K',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Eye
    },
    {
      name: 'Profile Visits',
      value: '23.4K',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      name: 'Engagement Rate',
      value: '4.2%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: Heart
    },
    {
      name: 'Follower Growth',
      value: '+1,247',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ]

  const topTweets = [
    {
      id: '1',
      content: 'Just launched our new AI-powered Twitter agent! 🚀 It can generate content, schedule posts, and engage with your audience automatically. The future of social media is here! #AI #TwitterBot #Automation',
      impressions: 45600,
      likes: 1247,
      retweets: 234,
      replies: 89,
      date: '2 days ago'
    },
    {
      id: '2',
      content: 'Thread: 10 essential tips for growing your Twitter audience organically 🧵\n\n1. Post consistently\n2. Engage authentically\n3. Share valuable insights\n4. Use relevant hashtags\n5. Join conversations...',
      impressions: 32100,
      likes: 892,
      retweets: 156,
      replies: 67,
      date: '4 days ago'
    },
    {
      id: '3',
      content: 'Behind the scenes: Building our Twitter AI with Next.js, OpenAI, and lots of coffee ☕️\n\nThe tech stack:\n- Frontend: Next.js + Tailwind\n- Backend: Node.js + Express\n- AI: OpenAI GPT-4\n- Database: MongoDB',
      impressions: 28900,
      likes: 743,
      retweets: 98,
      replies: 45,
      date: '1 week ago'
    }
  ]

  const engagementData = [
    { day: 'Mon', likes: 120, retweets: 45, replies: 23 },
    { day: 'Tue', likes: 89, retweets: 32, replies: 18 },
    { day: 'Wed', likes: 156, retweets: 67, replies: 34 },
    { day: 'Thu', likes: 203, retweets: 89, replies: 45 },
    { day: 'Fri', likes: 178, retweets: 76, replies: 38 },
    { day: 'Sat', likes: 134, retweets: 54, replies: 28 },
    { day: 'Sun', likes: 98, retweets: 41, replies: 19 }
  ]

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your Twitter performance and engagement metrics</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const ChangeIcon = metric.changeType === 'positive' ? ArrowUpRight : ArrowDownRight
            const changeColor = metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            
            return (
              <div key={metric.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      <ChangeIcon className={`h-4 w-4 ${changeColor} mr-1`} />
                      <span className={`text-sm font-medium ${changeColor}`}>{metric.change}</span>
                      <span className="text-sm text-gray-500 ml-1">vs last week</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <metric.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Engagement Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Engagement</h3>
            <div className="space-y-4">
              {engagementData.map((day) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-8 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(day.likes / 250) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{day.likes}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Likes</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Retweets</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Replies</span>
              </div>
            </div>
          </div>

          {/* Top Performing Tweets */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Tweets</h3>
            <div className="space-y-4">
              {topTweets.map((tweet) => (
                <div key={tweet.id} className="border border-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-900 line-clamp-3 mb-3">{tweet.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{tweet.date}</span>
                    <span>{tweet.impressions.toLocaleString()} impressions</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center text-red-600">
                      <Heart className="h-3 w-3 mr-1" />
                      {tweet.likes}
                    </div>
                    <div className="flex items-center text-green-600">
                      <Repeat2 className="h-3 w-3 mr-1" />
                      {tweet.retweets}
                    </div>
                    <div className="flex items-center text-blue-600">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {tweet.replies}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audience Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Posting Times</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">9:00 AM - 11:00 AM</span>
                <span className="text-sm font-medium text-green-600">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">1:00 PM - 3:00 PM</span>
                <span className="text-sm font-medium text-green-600">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">7:00 PM - 9:00 PM</span>
                <span className="text-sm font-medium text-yellow-600">Medium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">11:00 PM - 1:00 AM</span>
                <span className="text-sm font-medium text-red-600">Low</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Hashtags</h3>
            <div className="space-y-2">
              {['#AI', '#TwitterBot', '#Automation', '#TechTips', '#SocialMedia'].map((hashtag, index) => (
                <div key={hashtag} className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">{hashtag}</span>
                  <span className="text-sm text-gray-500">{Math.floor(Math.random() * 100) + 50} uses</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Tech Professionals</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Entrepreneurs</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}