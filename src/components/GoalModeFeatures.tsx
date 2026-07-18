'use client'

import { useState, useEffect } from 'react'

function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '', label }: { end: number; duration?: number; prefix?: string; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration])
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-[#d4a843]">{prefix}{count.toLocaleString()}{suffix}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function LiveActivityFeed({ activities }: { activities: string[] }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % activities.length), 3000)
    return () => clearInterval(t)
  }, [activities.length])
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Live Activity</span>
      </div>
      <p className="text-sm text-gray-300 transition-all duration-500" key={current}>
        {activities[current]}
      </p>
    </div>
  )
}

function ProgressTracker({ tasks }: { tasks: { label: string; progress: number; color: string }[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Goal Progress</div>
      {tasks.map((task, i) => (
        <div key={i} className="mb-2 last:mb-0">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-300">{task.label}</span>
            <span className="text-gray-400">{task.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: task.progress + '%', background: task.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function AIInsightPanel({ insights }: { insights: string[] }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % insights.length), 5000)
    return () => clearInterval(t)
  }, [insights.length])
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🧠</span>
        <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">AI Insight</span>
      </div>
      <p className="text-sm text-gray-300 transition-all duration-500" key={idx}>{insights[idx]}</p>
    </div>
  )
}

function QuickActions({ actions }: { actions: { icon: string; label: string; color: string }[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Quick Actions</div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => (
          <button key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95">
            <span>{a.icon}</span>
            <span className="text-gray-300">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function GoalModeFeatures({ page }: { page: string }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const defaultConfig = {
    stats: [
      { end: 500, suffix: '+', label: 'Total Views' },
      { end: 87, suffix: '%', label: 'Completion' },
      { end: 42, suffix: '', label: 'Tasks Done' },
      { end: 14, suffix: ' days', label: 'Streak' },
    ],
    activities: [
      '✅ New task completed',
      '📊 Report generated',
      '🎯 Milestone reached',
      '💬 New feedback received',
      '🔄 Data synced successfully',
    ],
    tasks: [
      { label: 'Primary Goal', progress: 72, color: '#10b981' },
      { label: 'Secondary Goal', progress: 58, color: '#3b82f6' },
      { label: 'In Progress', progress: 35, color: '#8b5cf6' },
      { label: 'Pending', progress: 15, color: '#f59e0b' },
    ],
    insights: [
      'Engagement is 35% higher on weekdays.',
      'Best performance in evening hours.',
      'Consider A/B testing for optimization.',
      'Response time improved by 40% this week.',
    ],
    actions: [
      { icon: '🚀', label: 'Boost', color: '#3b82f6' },
      { icon: '📋', label: 'Plan', color: '#8b5cf6' },
      { icon: '✅', label: 'Complete', color: '#10b981' },
      { icon: '🔔', label: 'Remind', color: '#f59e0b' },
    ],
  }

  const cfg = defaultConfig

  return (
    <div className="fixed right-4 top-24 z-40 w-72 max-h-[calc(100vh-120px)] overflow-y-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-3 top-2 w-6 h-6 rounded-full bg-[#1e3a5f] border border-[#d4a843]/30 flex items-center justify-center text-[#d4a843] text-xs hover:bg-[#2c5282] transition-colors z-50"
      >
        {isExpanded ? '›' : '‹'}
      </button>

      {isExpanded && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] rounded-xl p-3 border border-[#d4a843]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm font-bold text-white">Goal Mode</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400">LIVE</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Page: {page}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {cfg.stats.map((s, i) => (
              <AnimatedCounter key={i} {...s} />
            ))}
          </div>

          <LiveActivityFeed activities={cfg.activities} />
          <ProgressTracker tasks={cfg.tasks} />
          <AIInsightPanel insights={cfg.insights} />
          <QuickActions actions={cfg.actions} />
        </div>
      )}
    </div>
  )
}
