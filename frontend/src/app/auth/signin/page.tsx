'use client'

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Twitter, Bot, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to home */}
        <Link 
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        {/* Sign in card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Bot className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to LazAI
            </h1>
            <p className="text-gray-600">
              Connect your Twitter account to get started with AI-powered automation
            </p>
          </div>

          {providers && (
            <div className="space-y-4">
              {Object.values(providers).map((provider: any) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Twitter className="w-5 h-5 mr-3" />
                  Continue with {provider.name}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-medium text-gray-900">AI Content</div>
            <div className="text-xs text-gray-600">Auto-generate tweets</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-900">Analytics</div>
            <div className="text-xs text-gray-600">Track performance</div>
          </div>
        </div>
      </div>
    </div>
  )
}