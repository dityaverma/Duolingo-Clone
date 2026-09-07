'use client'
import { useState, useEffect, useMemo, type MouseEvent } from 'react'
import { X, Volume2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import DuoOwl from './DuoOwl'
import { OfficialHeart } from './PathAssets'
import { speak, playFeedbackTone, unlockAudio, playClickSound, detectLang, loadVoices, canAutoSpeak } from '@/lib/audio'
import type { AnswerResult, Lesson } from '@/lib/types'

function SpeakerBtn({ text, lang, large }: { text: string; lang?: string; large?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const resolved = lang || detectLang(text)

  async function play(e?: MouseEvent) {
    e?.stopPropagation()
    e?.preventDefault()
    unlockAudio()
    playClickSound()
    setPlaying(true)
    try {
      await speak(String(text || ''), resolved)
    } finally {
      setPlaying(false)
    }
  }

  return (
    <button
      type="button"
      onClick={play}
      title="Play audio"
      aria-label="Play audio"
      className={cn(
        'inline-flex items-center justify-center rounded-xl text-white bg-duo-blue hover:brightness-110 duo-press shrink-0',
        large ? 'w-10 h-10' : 'w-8 h-8',
        playing && 'ring-2 ring-duo-blue ring-offset-2 animate-pulse',
      )}
    >
      <Volume2 className={large ? 'w-5 h-5' : 'w-4 h-4'} />
    </button>
  )
}

function MultipleChoice({ exercise, selected, setSelected, disabled }: any) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-black ink flex-1">{exercise.prompt}</h2>
        {exercise.prompt && <SpeakerBtn text={exercise.prompt} lang="en-US" large />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {exercise.options.map((opt: any, i: number) => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => {
              playClickSound()
              setSelected(opt.text)
              void speak(String(opt.text), 'es-ES')
            }}
            className={cn('option-card flex flex-col items-center py-5 sm:py-6 text-center', selected === opt.text && 'selected')}
          >
            <div className="text-5xl sm:text-6xl mb-3">{opt.img}</div>
            <div className="flex items-center gap-2">
              <span>{opt.text}</span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Hear ${opt.text}`}
                onClick={(e) => { e.stopPropagation(); unlockAudio(); void speak(String(opt.text), 'es-ES') }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); void speak(String(opt.text), 'es-ES') } }}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-duo-blue/15 text-duo-blue"
              >
                <Volume2 className="w-4 h-4" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function TranslateWordBank({ exercise, answer, setAnswer, disabled }: any) {
  const placed = answer.placed
  const used = answer.used
  const addWord = (word: string, srcIdx: number) => {
    if (disabled) return
    playClickSound()
    void speak(word, 'es-ES')
    setAnswer({ placed: [...placed, { word, srcIdx }], used: [...used, srcIdx] })
  }
  const removeWord = (idx: number) => {
    if (disabled) return
    const removed = placed[idx]
    setAnswer({
      placed: placed.filter((_: any, i: number) => i !== idx),
      used: used.filter((u: number) => u !== removed.srcIdx),
    })
  }
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-black mb-4 ink">Translate this sentence</h2>
      <div className="flex items-center gap-3 sm:gap-4 mb-8 surface-2 p-4 rounded-2xl">
        <div className="hidden sm:block"><DuoOwl size={80} emotion="idle" /></div>
        <div className="surface rounded-2xl p-3 flex-1 font-bold text-lg border-2 border-outline ink flex items-center justify-between gap-2">
          <span>{exercise.prompt}</span>
          <SpeakerBtn text={exercise.prompt} lang="en-US" />
        </div>
      </div>
      <div className="border-b-2 border-outline min-h-[52px] mb-8 pb-2 flex flex-wrap gap-2">
        {placed.map((p: any, i: number) => (
          <button key={i} type="button" onClick={() => removeWord(i)} className="word-chip placed">{p.word}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {exercise.wordBank.map((w: string, i: number) => (
          <button
            key={i}
            type="button"
            onClick={() => addWord(w, i)}
            disabled={disabled || used.includes(i)}
            className={cn('word-chip', used.includes(i) && 'used')}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  )
}

function FillBlank({ exercise, selected, setSelected, disabled }: any) {
  const parts = exercise.sentence.split('___')
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-black mb-6 ink flex items-center gap-2 flex-wrap">
        Fill in the blank
        <SpeakerBtn text={exercise.sentence.replace('___', selected || '')} lang="es-ES" />
      </h2>
      <div className="text-xl sm:text-2xl font-bold mb-2 flex flex-wrap items-center gap-2 ink">
        <span>{parts[0]}</span>
        <span className={cn('inline-block min-w-[100px] border-b-4 pb-1 text-center', selected ? 'border-duo-blue text-duo-blue' : 'border-outline text-transparent')}>
          {selected || 'blank'}
        </span>
        <span>{parts[1]}</span>
      </div>
      {exercise.translation && <div className="ink-3 text-sm mb-6 italic">{exercise.translation}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {exercise.options.map((o: string, i: number) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              playClickSound()
              setSelected(o)
              void speak(o, 'es-ES')
            }}
            disabled={disabled}
            className={cn('option-card py-4', selected === o && 'selected')}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function TypeAnswer({ exercise, answer, setAnswer, disabled }: any) {
  const promptLang = detectLang(exercise.prompt || '', 'en-US')
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-black ink">{exercise.prompt}</h2>
        {exercise.prompt && <SpeakerBtn text={exercise.prompt} lang={promptLang} large />}
      </div>
      {exercise.hint && <div className="ink-3 text-sm mb-4 italic">Hint: {exercise.hint}</div>}
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer…"
        className="w-full text-xl font-bold border-2 border-outline surface ink rounded-2xl px-4 py-4 focus:outline-none focus:border-duo-blue"
        autoFocus
      />
    </div>
  )
}

function MatchPairs({ exercise, matches, setMatches, disabled }: any) {
  const [pickedLeft, setPickedLeft] = useState<string | null>(null)
  const [pickedRight, setPickedRight] = useState<string | null>(null)
  const [correctSet, setCorrectSet] = useState<any[]>([])

  useEffect(() => {
    if (pickedLeft && pickedRight) {
      setMatches([...matches, { left: pickedLeft, right: pickedRight }])
      setCorrectSet((cs) => [...cs, { left: pickedLeft, right: pickedRight }])
      setPickedLeft(null)
      setPickedRight(null)
    }
  }, [pickedLeft, pickedRight])

  const isUsedLeft = (l: string) => correctSet.find((c) => c.left === l)
  const isUsedRight = (r: string) => correctSet.find((c) => c.right === r)

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-black mb-6 ink">Tap the matching pairs</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="flex flex-col gap-3">
          {exercise.lefts.map((l: string) => (
            <button
              key={l}
              type="button"
              disabled={disabled || !!isUsedLeft(l)}
              onClick={() => { setPickedLeft(l); playClickSound(); void speak(l, 'es-ES') }}
              className={cn('option-card py-4', pickedLeft === l && 'selected', isUsedLeft(l) && 'correct disabled')}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {exercise.rights.map((r: string) => (
            <button
              key={r}
              type="button"
              disabled={disabled || !!isUsedRight(r)}
              onClick={() => { setPickedRight(r); playClickSound(); void speak(r, detectLang(r, 'en-US')) }}
              className={cn('option-card py-4', pickedRight === r && 'selected', isUsedRight(r) && 'correct disabled')}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="text-sm ink-3 mt-4 text-center font-bold">Matched {correctSet.length} / {exercise.pairsCount}</div>
    </div>
  )
}

function FollowPattern({ exercise, selected, setSelected, disabled }: any) {
  const rows: { left: string[]; right: string }[] = exercise.rows || []
  const options: string[] = exercise.options || []
  const isOp = (t: string) => ['+', '−', '-', '×', '÷', '*', '/'].includes(t)
  const prompt = exercise.prompt || 'Follow the pattern'

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-start justify-center gap-3 mb-8 w-full max-w-md">
        <h2 className="text-xl sm:text-3xl font-black ink text-center flex-1">{prompt}</h2>
        <SpeakerBtn text={prompt} lang="en-US" large />
      </div>
      <div className="w-full max-w-md border-2 border-outline rounded-2xl overflow-hidden mb-8">
        {rows.map((row, ri) => {
          const isActive = row.right === '?'
          return (
            <div key={ri} className={cn('grid grid-cols-2 border-outline', ri < rows.length - 1 && 'border-b-2')}>
              <div className="flex items-center justify-center gap-2 py-5 px-4 border-r-2 border-outline text-2xl md:text-3xl font-black">
                {row.left.map((tok, ti) => (
                  <span key={ti} className={isOp(tok) ? 'text-duo-blue' : 'ink'}>{tok}</span>
                ))}
              </div>
              <div className="flex items-center justify-center py-4 px-4">
                {isActive ? (
                  <div className="w-14 h-14 rounded-xl border-2 border-duo-blue flex items-center justify-center text-3xl font-black text-duo-blue bg-duo-blue/10">
                    {selected || '?'}
                  </div>
                ) : (
                  <span className="text-2xl md:text-3xl font-black ink">{row.right}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="w-full max-w-md flex flex-col gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => { playClickSound(); setSelected(opt) }}
            className={cn('option-card py-5 text-2xl font-black text-center', selected === opt && 'selected')}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function FeedbackBar({ result, exercise, onContinue, onExplain, explaining, explanation, duoEmotion }: any) {
  if (!result) return null
  const correct = result.correct
  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={cn(
        'fixed left-0 right-0 bottom-0 z-[60]',
        correct ? 'bg-[#d7ffb8] dark:bg-duo-green/15' : 'bg-[#ffdfe0] dark:bg-duo-red/15',
        'border-t-2',
        correct ? 'border-duo-green' : 'border-duo-red',
      )}
    >
      <div className="max-w-3xl mx-auto p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 16 }}
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center text-4xl shrink-0 shadow-sm border-2',
                correct ? 'bg-white border-duo-green' : 'bg-white border-duo-red',
              )}
            >
              {correct ? '✅' : '❌'}
            </motion.div>
            <div className="min-w-0">
              <div className={cn('text-xl sm:text-2xl font-black', correct ? 'text-duo-green-dark dark:text-duo-green' : 'text-duo-red-dark dark:text-duo-red')}>
                {correct ? (['Excellent!', 'Amazing!', 'Nice!', 'You got it!'][Math.floor((exercise?.id?.length || 0) % 4)] || 'Excellent!') : 'Correct answer:'}
              </div>
              {!correct && (
                <div className="font-bold text-duo-red-dark dark:text-duo-red">
                  {Array.isArray(result.correctAnswer)
                    ? result.correctAnswer.map((p: any) => `${p.left} → ${p.right}`).join(', ')
                    : result.correctAnswer}
                </div>
              )}
              {correct && exercise?.translation && (
                <div className="text-duo-green-dark dark:text-duo-green font-bold text-sm italic">{exercise.translation}</div>
              )}
            </div>
            <div className="hidden sm:block shrink-0 ml-2">
              <DuoOwl size={72} emotion={duoEmotion || (correct ? 'cheer' : 'sad')} />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!correct && !explanation && (
              <button type="button" onClick={onExplain} disabled={explaining} className="duo-btn duo-btn-purple px-4 py-3 text-sm flex items-center gap-2 flex-1 sm:flex-none justify-center">
                <Sparkles className="w-4 h-4" /> {explaining ? 'Thinking…' : 'Ask Duo Max'}
              </button>
            )}
            <button type="button" onClick={onContinue} className={cn('duo-btn text-white px-8 py-3 flex-1 sm:flex-none', correct ? 'duo-btn-green' : 'duo-btn-red')}>
              Continue
            </button>
          </div>
        </div>
        {explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-3 flex items-start gap-3 surface rounded-2xl p-4 border-2 border-duo-purple overflow-hidden"
          >
            <DuoOwl size={60} emotion="thinking" />
            <div className="text-sm font-bold ink whitespace-pre-wrap">{explanation}</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function LessonPlayer({ lesson, user, mode = 'lesson', onAnswer, onExplain, onComplete, onQuit, onPracticeFromHearts }: {
  lesson: Lesson; user: any; mode?: 'lesson' | 'practice' | 'legendary';
  onAnswer: (exerciseId: string, answer: any) => Promise<AnswerResult>;
  onExplain: (params: { prompt: string; userAnswer: string; correctAnswer: string; exerciseType: string }) => Promise<string>;
  onComplete: (payload: { xpEarned: number; mistakes: number; timeSec: number; mode: string }) => void;
  onQuit: () => void;
  onPracticeFromHearts?: () => void;
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<any>(null)
  const [typed, setTyped] = useState('')
  const [wbAnswer, setWbAnswer] = useState<any>({ placed: [], used: [] })
  const [matches, setMatches] = useState<any[]>([])
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [hearts, setHearts] = useState(user?.hearts ?? 5)
  const [mistakes, setMistakes] = useState(0)
  const [outOfHearts, setOutOfHearts] = useState(false)
  const [startedAt] = useState(Date.now())
  const [duoEmotion, setDuoEmotion] = useState<'idle' | 'happy' | 'sad' | 'cheer'>('idle')
  const [explaining, setExplaining] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(mode === 'legendary' ? 60 : 0)
  const [checking, setChecking] = useState(false)

  const total = lesson.exercises.length
  const exercise = lesson.exercises[index]

  useEffect(() => {
    unlockAudio()
    void loadVoices()
  }, [])

  useEffect(() => {
    unlockAudio()
    setSelected(null)
    setTyped('')
    setWbAnswer({ placed: [], used: [] })
    setMatches([])
    setResult(null)
    setExplanation(null)
    setDuoEmotion('idle')
    setChecking(false)
    if (mode === 'legendary') setTimeLeft(60)

    // Auto-recite after audio unlock
    if (!canAutoSpeak()) return
    const t = window.setTimeout(() => {
      if (exercise?.type === 'fill_blank' && exercise.sentence) {
        void speak(String(exercise.sentence).replace('___', ''), 'es-ES')
      } else if (exercise?.prompt) {
        const lang =
          exercise.type === 'translate_wordbank' || exercise.type === 'follow_pattern' || exercise.type === 'multiple_choice'
            ? 'en-US'
            : detectLang(String(exercise.prompt), 'en-US')
        void speak(String(exercise.prompt), lang)
      }
    }, 320)
    return () => window.clearTimeout(t)
  }, [index])

  // Recite Spanish answer aloud on correct feedback
  useEffect(() => {
    if (!result?.correct) return
    const ans = result.correctAnswer
    if (typeof ans === 'string' && ans.trim()) {
      void speak(ans, detectLang(ans, 'es-ES'))
    }
  }, [result])

  useEffect(() => {
    if (mode !== 'legendary' || result || checking) return
    if (timeLeft <= 0) {
      void handleCheck(true)
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, result, mode, checking])

  const canCheck = useMemo(() => {
    if (!exercise || checking) return false
    if (exercise.type === 'multiple_choice' || exercise.type === 'fill_blank' || exercise.type === 'follow_pattern') return !!selected
    if (exercise.type === 'type_answer') return typed.trim().length > 0
    if (exercise.type === 'translate_wordbank') return wbAnswer.placed.length > 0
    if (exercise.type === 'match_pairs') return matches.length === (exercise.pairsCount || 0)
    return false
  }, [exercise, selected, typed, wbAnswer, matches, checking])

  async function handleCheck(auto = false) {
    if (checking || result) return
    let answer: any = null
    if (exercise.type === 'multiple_choice' || exercise.type === 'fill_blank' || exercise.type === 'follow_pattern') answer = selected
    else if (exercise.type === 'type_answer') answer = typed
    else if (exercise.type === 'translate_wordbank') answer = wbAnswer.placed.map((p: any) => p.word)
    else if (exercise.type === 'match_pairs') answer = matches
    if (auto && (answer === null || answer === '' || (Array.isArray(answer) && answer.length === 0))) answer = ''

    setChecking(true)
    try {
      const res = await onAnswer(exercise.id, answer)
      setResult(res)
      playFeedbackTone(res.correct)
      if (res.correct) {
        setDuoEmotion('cheer')
        setTimeout(() => setDuoEmotion('happy'), 700)
      } else {
        setDuoEmotion('sad')
        setMistakes((m) => m + 1)
        setHearts(res.hearts)
        if (mode !== 'practice' && res.hearts <= 0) setTimeout(() => setOutOfHearts(true), 900)
      }
    } finally {
      setChecking(false)
    }
  }

  async function handleExplain() {
    if (!result || result.correct) return
    setExplaining(true)
    try {
      const userAnswer = Array.isArray(wbAnswer.placed) && exercise.type === 'translate_wordbank'
        ? wbAnswer.placed.map((p: any) => p.word).join(' ')
        : (selected || typed || JSON.stringify(matches))
      const correctAnswer = Array.isArray(result.correctAnswer)
        ? result.correctAnswer.map((p: any) => `${p.left} → ${p.right}`).join(', ')
        : String(result.correctAnswer)
      const text = await onExplain({
        prompt: exercise.prompt || exercise.sentence || 'Match the pairs',
        userAnswer: String(userAnswer),
        correctAnswer,
        exerciseType: exercise.type,
      })
      setExplanation(text)
    } catch {
      setExplanation('Duo Max is having trouble right now. Try again later!')
    } finally {
      setExplaining(false)
    }
  }

  function handleContinue() {
    if (mode !== 'practice' && hearts <= 0) {
      setOutOfHearts(true)
      return
    }
    if (index + 1 >= total) {
      const baseXp = mode === 'legendary' ? 40 : (mode === 'practice' ? 5 : 15)
      const xpEarned = Math.max(5, baseXp - mistakes * 2)
      onComplete({ xpEarned, mistakes, timeSec: Math.round((Date.now() - startedAt) / 1000), mode })
    } else {
      setIndex((i) => i + 1)
    }
  }

  // Keyboard: 1/2/3 select options, Enter to check / continue
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      const inField = tag === 'INPUT' || tag === 'TEXTAREA'
      if (inField && e.key !== 'Enter') return
      if (e.key === 'Enter') {
        e.preventDefault()
        if (outOfHearts) return
        if (result) handleContinue()
        else if (canCheck) void handleCheck()
        return
      }
      if (inField || result || checking || outOfHearts) return
      const num = Number(e.key)
      if (num >= 1 && num <= 9) {
        if (exercise?.type === 'multiple_choice' && Array.isArray(exercise.options)) {
          const opt = exercise.options[num - 1]
          if (opt && typeof opt === 'object' && 'text' in opt) {
            playClickSound()
            setSelected((opt as any).text)
            void speak(String((opt as any).text), 'es-ES')
          }
        } else if ((exercise?.type === 'fill_blank' || exercise?.type === 'follow_pattern') && Array.isArray(exercise.options)) {
          const opt = exercise.options[num - 1]
          if (opt != null) {
            playClickSound()
            setSelected(String(opt))
          }
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const progress = ((index + (result?.correct ? 1 : 0)) / total) * 100

  return (
    <div className="fixed inset-0 z-50 surface flex flex-col">
      <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-8 py-3 sm:py-4">
        <button type="button" onClick={onQuit} className="ink-3 hover:ink" aria-label="Quit">
          <X className="w-7 h-7" strokeWidth={3} />
        </button>
        <div className="flex-1 h-3.5 sm:h-4 bg-outline rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: mode === 'legendary'
                ? 'linear-gradient(180deg,#ce82ff,#a560e8)'
                : 'linear-gradient(180deg,#61e002 0%,#58cc02 100%)',
            }}
          >
            <div className="h-1/3 bg-white/40 rounded-full mx-1" />
          </div>
        </div>
        {mode === 'legendary' && (
          <div className={cn('font-black text-lg px-2 py-1 rounded', timeLeft <= 10 ? 'bg-duo-red text-white' : 'text-duo-purple')}>{timeLeft}s</div>
        )}
        {mode !== 'practice' && (
          <div className="flex items-center gap-1">
            <OfficialHeart size={26} />
            <span className="font-black text-lg text-duo-red">{hearts}</span>
          </div>
        )}
        {mode === 'practice' && <div className="text-xs font-black uppercase text-duo-green px-2 py-1 rounded bg-duo-green/10">Practice</div>}
        {mode === 'legendary' && <div className="text-xs font-black uppercase text-duo-purple px-2 py-1 rounded bg-duo-purple/10">Legendary</div>}
      </div>

      <div className="hidden md:block fixed bottom-28 right-8 z-40 pointer-events-none">
        <DuoOwl size={100} emotion={duoEmotion} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 md:p-8 pb-44">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              {exercise.type === 'multiple_choice' && <MultipleChoice exercise={exercise} selected={selected} setSelected={setSelected} disabled={!!result} />}
              {exercise.type === 'translate_wordbank' && <TranslateWordBank exercise={exercise} answer={wbAnswer} setAnswer={setWbAnswer} disabled={!!result} />}
              {exercise.type === 'fill_blank' && <FillBlank exercise={exercise} selected={selected} setSelected={setSelected} disabled={!!result} />}
              {exercise.type === 'type_answer' && <TypeAnswer exercise={exercise} answer={typed} setAnswer={setTyped} disabled={!!result} />}
              {exercise.type === 'match_pairs' && <MatchPairs exercise={exercise} matches={matches} setMatches={setMatches} disabled={!!result} />}
              {exercise.type === 'follow_pattern' && <FollowPattern exercise={exercise} selected={selected} setSelected={setSelected} disabled={!!result} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {!result && (
        <div className="border-t-2 border-outline p-4 md:p-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <button type="button" onClick={onQuit} className="duo-btn duo-btn-white px-6 py-3 text-sm">Skip</button>
            <button
              type="button"
              onClick={() => handleCheck()}
              disabled={!canCheck}
              className={cn('duo-btn px-8 py-3', canCheck ? 'duo-btn-green' : '')}
            >
              {checking ? '…' : 'Check'}
            </button>
          </div>
        </div>
      )}
      <FeedbackBar result={result} exercise={exercise} onContinue={handleContinue} onExplain={handleExplain} explaining={explaining} explanation={explanation} duoEmotion={duoEmotion} />

      <AnimatePresence>
        {outOfHearts && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 12 }} animate={{ scale: 1, y: 0 }} className="surface rounded-3xl max-w-md w-full p-6 text-center border-2 border-outline">
              <div className="flex justify-center mb-3">
                <DuoOwl size={96} emotion="sad" />
              </div>
              <div className="text-7xl mb-2">💔</div>
              <div className="text-2xl font-black text-duo-red mb-2">Out of hearts!</div>
              <div className="ink-3 font-bold mb-2">You can&apos;t continue this lesson without hearts.</div>
              <div className="ink-3 font-bold text-sm mb-6">Practice a finished skill for +1 heart, refill with gems, or wait for regen.</div>
              <div className="space-y-3">
                {onPracticeFromHearts && (
                  <button
                    type="button"
                    onClick={() => { onQuit(); onPracticeFromHearts() }}
                    className="duo-btn duo-btn-green w-full py-3"
                  >
                    Practice for +1 heart
                  </button>
                )}
                <button type="button" onClick={onQuit} className="duo-btn duo-btn-white w-full py-3">
                  Exit lesson
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
