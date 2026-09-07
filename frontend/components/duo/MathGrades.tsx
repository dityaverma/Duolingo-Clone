'use client'
import { useMemo, useState } from 'react'
import { Search, ChevronRight, ChevronLeft, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MATH_GRADES, type MathGrade, type SelectedMathTopic } from '@/lib/mathGrades'
import type { Course } from '@/lib/types'

export default function MathGrades({
  course,
  onSelectTopic,
  onBack,
}: {
  course: Course | null
  onSelectTopic: (topic: SelectedMathTopic) => void
  onBack?: () => void
}) {
  const [tab, setTab] = useState<'grades' | 'topics'>('grades')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<number>(2)

  const progressFor = (g: MathGrade) => {
    if (!course) return 0
    let done = 0
    for (const t of g.topics) {
      const skill = course.units.flatMap((u) => u.skills).find((s) => s.id === t.skillId)
      if (skill?.lessons.some((l) => l.id === t.lessonId && l.completed)) done += 1
    }
    return done
  }

  const allTopics = useMemo(() => {
    return MATH_GRADES.flatMap((g) =>
      g.topics.map((t) => ({ ...t, grade: g.grade, color: g.color })),
    ).filter((t) => !query.trim() || t.title.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1 ink-3 font-bold mb-4 hover:ink">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
      )}

      <div className="relative mb-5">
        <Search className="w-5 h-5 ink-3 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like to learn?"
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-outline surface ink font-bold outline-none focus:border-duo-blue"
        />
      </div>

      <div className="surface-2 rounded-t-3xl border-2 border-outline border-b-0 overflow-hidden">
        <div className="flex border-b-2 border-outline">
          {(['grades', 'topics'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-4 font-black uppercase tracking-wider text-sm',
                tab === t ? 'text-duo-blue border-b-4 border-duo-blue -mb-0.5' : 'ink-3',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="surface px-2 py-2 min-h-[420px]">
          {tab === 'grades' && !query.trim() && MATH_GRADES.map((g) => {
            const done = progressFor(g)
            const open = expanded === g.grade
            return (
              <div key={g.grade} className="border-b-2 border-outline last:border-0">
                <button
                  onClick={() => setExpanded(open ? -1 : g.grade)}
                  className="w-full flex items-center gap-4 px-4 py-5 text-left hover:surface-2 transition"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shrink-0"
                    style={{ background: g.color, boxShadow: `0 4px 0 0 ${g.color}99` }}
                  >
                    {g.grade}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xl ink mb-2">Grade {g.grade}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 rounded-full bg-outline relative overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#52656d]"
                          style={{ width: `${Math.max(4, (done / g.topicCount) * 100)}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black ink-3">
                          {done} / {g.topicCount}
                        </span>
                      </div>
                      <Trophy className="w-5 h-5 ink-3 shrink-0" />
                    </div>
                  </div>
                </button>

                {open && (
                  <div className="pb-2">
                    {g.topics.map((t) => {
                      const skill = course?.units.flatMap((u) => u.skills).find((s) => s.id === t.skillId)
                      const completed = skill?.lessons.some((l) => l.id === t.lessonId && l.completed)
                      return (
                        <button
                          key={t.id}
                          onClick={() =>
                            onSelectTopic({
                              grade: g.grade,
                              topicId: t.id,
                              title: t.title,
                              skillId: t.skillId,
                              lessonId: t.lessonId,
                              color: g.color,
                            })
                          }
                          className={cn(
                            'w-full flex items-center justify-between px-6 py-4 font-bold border-y-2 text-left transition',
                            completed
                              ? 'border-duo-green/40 text-duo-green'
                              : 'border-transparent ink hover:border-duo-green hover:text-duo-green',
                          )}
                        >
                          <span>{t.title}</span>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {(tab === 'topics' || query.trim()) && (
            <div>
              {allTopics.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    onSelectTopic({
                      grade: t.grade,
                      topicId: t.id,
                      title: t.title,
                      skillId: t.skillId,
                      lessonId: t.lessonId,
                      color: t.color,
                    })
                  }
                  className="w-full flex items-center justify-between px-4 py-4 font-bold ink border-b-2 border-outline hover:text-duo-green text-left"
                >
                  <div>
                    <div>{t.title}</div>
                    <div className="text-xs ink-3 font-bold mt-0.5">Grade {t.grade}</div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ))}
              {allTopics.length === 0 && (
                <div className="text-center ink-3 font-bold py-16">No topics match “{query}”</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
