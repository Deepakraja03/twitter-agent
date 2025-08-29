'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bot, 
  Home, 
  PenTool, 
  Calendar, 
  BarChart3, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X as XIcon,
  Twitter,
  Bell,
  ChevronRight
} from 'lucide-react'
import type { Session } from 'next-auth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Content Generator', href: '/dashboard/content', icon: PenTool },
  { name: 'Scheduler', href: '/dashboard/scheduler', icon: Calendar },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

// Extend Session type to optionally include username on user
type SessionWithUsername = Session & { user?: Session['user'] & { username?: string | null } }

const getUsername = (s: Session | null | undefined): string => {
const u = (s as SessionWithUsername | null | undefined)?.user
return (u?.username as string | undefined) || (u?.name as string | undefined) || 'username'
}

// Optional session extras
type SessionWithExtras = Session & { accessToken?: string }

function useBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    content: 'Content',
    analytics: 'Analytics',
    scheduler: 'Scheduler',
    settings: 'Settings',
  }

  const items = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/')
    return {
      label: labelMap[seg] || seg,
      href,
      isLast: idx === segments.length - 1,
    }
  })

  return items
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname() || '/dashboard'

  const breadcrumbs = useBreadcrumbs(pathname)

  const nav = useMemo(() => {
    return NAV_ITEMS.map((item) => {
      const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
      return { ...item, isActive }
    })
  }, [pathname])

  // Debug: log raw session/auth data in development (no transformations)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[next-auth][debug][SESSION]', { status, session })
      console.log('[next-auth][debug][SESSION.accessToken]', (session as SessionWithExtras | null | undefined)?.accessToken)
    }
  }, [session, status])

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-zinc-900 border-r border-zinc-800">
          <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-white" />
              <span className="text-lg font-bold text-white">LazAI 𝕏</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <XIcon className="h-6 w-6 text-zinc-400" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.isActive
                    ? 'bg-zinc-800 text-white border-r-2 border-white'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-black border-r border-zinc-800">
          <div className="flex h-16 items-center px-4 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-white" />
              <span className="text-lg font-bold text-white">LazAI 𝕏</span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.isActive
                    ? 'bg-zinc-800 text-white border-r-2 border-white'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-zinc-800 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                {session?.user?.image ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt={session?.user?.name || 'User'}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-zinc-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  @{getUsername(session)}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-black/90 border-b border-zinc-800">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-6 w-full">
              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center text-sm text-zinc-400">
                {breadcrumbs.map((bc, idx) => (
                  <div key={bc.href} className="flex items-center">
                    {idx > 0 && <ChevronRight className="h-4 w-4 mx-2 text-zinc-600" />}
                    {bc.isLast ? (
                      <span className="text-zinc-200 font-medium">{bc.label}</span>
                    ) : (
                      <Link href={bc.href} className="hover:text-zinc-200 transition-colors">{bc.label}</Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="ml-auto flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  <span>Connected as @{getUsername(session)}</span>
                </div>
                
                <button className="p-2 text-zinc-400 hover:text-white relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-blue-400 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-black min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
