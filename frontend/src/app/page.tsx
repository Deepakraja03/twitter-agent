'use client'

import { Bot, Twitter, Zap, Shield, Clock, TrendingUp, Sparkles, Users, BarChart3 } from 'lucide-react'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LazAI Twitter Agent
              </span>
            </div>
            {session ? (
              <Link 
                href="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Dashboard
              </Link>
            ) : (
              <button 
                onClick={() => signIn('twitter', { callbackUrl: '/dashboard' })}
                className="px-6 py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-full font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Advanced AI
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Twitter Agent
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your Twitter presence with intelligent automation. Generate engaging content, 
            schedule posts optimally, and grow your audience with AI that understands your brand voice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => session ? window.location.href = '/dashboard' : signIn('twitter', { callbackUrl: '/dashboard' })}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Twitter className="inline-block mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
              {session ? 'Go to Dashboard' : 'Connect Twitter Account'}
            </button>
            <button className="px-8 py-4 bg-white/80 hover:bg-white border border-gray-200 rounded-full font-semibold text-lg text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
            <div className="text-gray-600">Tweets Generated</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
            <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
            <div className="text-gray-600">Engagement Increase</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Content Generation</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate engaging tweets automatically based on trending topics, your brand voice, and audience preferences.
            </p>
          </div>

          <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Scheduling</h3>
            <p className="text-gray-600 leading-relaxed">
              AI analyzes your audience activity patterns to schedule posts at optimal times for maximum engagement.
            </p>
          </div>

          <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics & Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Track performance metrics, audience growth, and get actionable insights to improve your Twitter strategy.
            </p>
          </div>

          <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Secure & Private</h3>
            <p className="text-gray-600 leading-relaxed">
              Your Twitter credentials are encrypted and stored securely with industry-standard OAuth 2.0 authentication.
            </p>
          </div>

          <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Intelligent Replies</h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically respond to mentions and engage with your community using context-aware AI responses.
            </p>
          </div>

          <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Account Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Manage multiple Twitter accounts from a single dashboard with personalized AI agents for each brand.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Supercharge Your Twitter?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of creators, businesses, and influencers who are already using AI to grow their Twitter presence exponentially.
            </p>
            <button 
              onClick={() => session ? window.location.href = '/dashboard' : signIn('twitter', { callbackUrl: '/dashboard' })}
              className="group px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Twitter className="inline-block mr-3 h-5 w-5 text-blue-500 group-hover:rotate-12 transition-transform" />
              {session ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Bot className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">LazAI Network</span>
            </div>
            <p className="text-gray-600 mb-6">
              Empowering creators with AI-driven social media automation
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              &copy; 2024 LazAI Network. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}