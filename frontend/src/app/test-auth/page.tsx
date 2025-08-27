'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function TestAuth() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Session Status</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Session:</strong> {session ? 'Authenticated' : 'Not authenticated'}</p>
          {session && (
            <div className="mt-4">
              <p><strong>User:</strong> {session.user?.name}</p>
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Image:</strong> {session.user?.image}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            {!session ? (
              <button
                onClick={() => signIn('twitter', { callbackUrl: '/dashboard' })}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign In with Twitter
              </button>
            ) : (
              <>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="font-semibold text-yellow-800">Debug Info</h3>
          <pre className="text-sm mt-2 text-yellow-700">
            {JSON.stringify({ status, session: !!session, user: session?.user }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}