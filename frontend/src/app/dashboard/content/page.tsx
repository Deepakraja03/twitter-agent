'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { PenTool, Sparkles, Twitter, Hash, Image, Calendar, Send } from 'lucide-react'

export default function ContentPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [tone, setTone] = useState('professional')
  const [contentType, setContentType] = useState('tweet')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const sampleContent = {
        professional: "Excited to share insights on AI-driven content creation! The future of social media is here, and it's powered by intelligent automation. What are your thoughts on AI in marketing? #AI #ContentCreation #Innovation",
        casual: "Just discovered this amazing AI tool for content creation! 🤖✨ It's like having a creative assistant that never sleeps. Anyone else using AI for their social media? Drop your fav tools below! 👇",
        humorous: "Me: I need to post more consistently\nAlso me: *discovers AI content generator*\nMy Twitter: *suddenly becomes Shakespeare* 🎭\n\nWho else is living in 2024 with their AI writing buddy? 😂 #AILife #TwitterTips"
      }
      setGeneratedContent(sampleContent[tone as keyof typeof sampleContent])
      setIsGenerating(false)
    }, 2000)
  }

  const contentTypes = [
    { id: 'tweet', name: 'Single Tweet', icon: Twitter },
    { id: 'thread', name: 'Thread', icon: Hash },
    { id: 'reply', name: 'Reply', icon: PenTool }
  ]

  const tones = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual' },
    { id: 'humorous', name: 'Humorous' },
    { id: 'educational', name: 'Educational' }
  ]

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Content Generator</h1>
          <p className="text-gray-600 mt-1">Create engaging tweets with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Settings</h2>
              
              {/* Content Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        contentType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <type.icon className="h-4 w-4 mx-auto mb-1" />
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {tones.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Prompt */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to tweet about?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., AI trends in 2024, productivity tips, latest project update..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </button>
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
              <div className="space-y-2">
                {[
                  'Share a productivity tip',
                  'Announce a new feature',
                  'Ask for community feedback',
                  'Share industry insights',
                  'Behind-the-scenes content'
                ].map((template) => (
                  <button
                    key={template}
                    onClick={() => setPrompt(template)}
                    className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Content</h2>
              
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-900 whitespace-pre-wrap">{generatedContent}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        {generatedContent.length}/280 characters
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Edit
                        </button>
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                          Regenerate
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Send className="h-4 w-4 mr-2" />
                      Post Now
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <PenTool className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Enter a prompt and click generate to create content</p>
                </div>
              )}
            </div>

            {/* Recent Generations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Generations</h3>
              <div className="space-y-3">
                {[
                  'AI is revolutionizing how we create content...',
                  'Just shipped a new feature that will change...',
                  'What are your favorite productivity tools?...'
                ].map((content, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 truncate">{content}</p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}