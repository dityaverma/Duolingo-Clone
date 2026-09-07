/** Math grades / topics catalog — maps onto seeded Math skills & lessons */

export type MathTopic = {
  id: string
  title: string
  skillId: string
  lessonId: string
}

export type MathGrade = {
  grade: number
  color: string
  topicCount: number
  topics: MathTopic[]
}

export const MATH_GRADES: MathGrade[] = [
  {
    grade: 2,
    color: '#58cc02',
    topicCount: 5,
    topics: [
      { id: 'g2-patterns', title: 'Number patterns', skillId: 'ms3', lessonId: 'ml4' },
      { id: 'g2-intro-add', title: 'Intro to addition and subtraction', skillId: 'ms1', lessonId: 'ml1' },
      { id: 'g2-multi-add', title: 'Add and subtract multiple numbers', skillId: 'ms1', lessonId: 'ml2' },
      { id: 'g2-add-500', title: 'Add and subtract up to 500', skillId: 'ms2', lessonId: 'ml3' },
      { id: 'g2-shapes', title: 'Shapes', skillId: 'ms4', lessonId: 'ml5' },
    ],
  },
  {
    grade: 3,
    color: '#1cb0f6',
    topicCount: 13,
    topics: [
      { id: 'g3-multiply', title: 'Intro to multiplication', skillId: 'ms4', lessonId: 'ml5' },
      { id: 'g3-patterns', title: 'Bigger number patterns', skillId: 'ms3', lessonId: 'ml4' },
      { id: 'g3-subtract', title: 'Subtraction strategies', skillId: 'ms2', lessonId: 'ml3' },
    ],
  },
  {
    grade: 4,
    color: '#ff9600',
    topicCount: 16,
    topics: [
      { id: 'g4-multiply', title: 'Multiplication facts', skillId: 'ms4', lessonId: 'ml5' },
      { id: 'g4-patterns', title: 'Advanced patterns', skillId: 'ms3', lessonId: 'ml4' },
    ],
  },
]

export const MATH_TOPIC_KEY = 'duo-math-topic-v1'

export type SelectedMathTopic = {
  grade: number
  topicId: string
  title: string
  skillId: string
  lessonId: string
  color: string
}

export function loadMathTopic(): SelectedMathTopic | null {
  try {
    const raw = localStorage.getItem(MATH_TOPIC_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveMathTopic(topic: SelectedMathTopic | null) {
  try {
    if (!topic) localStorage.removeItem(MATH_TOPIC_KEY)
    else localStorage.setItem(MATH_TOPIC_KEY, JSON.stringify(topic))
  } catch { /* ignore */ }
}
