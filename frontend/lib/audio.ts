/** Lesson voice (TTS) + feedback tones. Web Speech API + /api/tts audio fallback. */

let audioCtx: AudioContext | null = null
let voicesCache: SpeechSynthesisVoice[] = []
let speakToken = 0
let keepAliveTimer: ReturnType<typeof setInterval> | null = null
let fallbackAudio: HTMLAudioElement | null = null
let userUnlocked = false

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  if (!audioCtx) audioCtx = new Ctx()
  return audioCtx
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function isChromium() {
  if (typeof navigator === 'undefined') return false
  return /Chrome|Chromium|Edg|CriOS/i.test(navigator.userAgent)
}

function refreshVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return []
  const list = window.speechSynthesis.getVoices()
  if (list.length) voicesCache = list
  return list.length ? list : voicesCache
}

/** Load / refresh system voices (Chrome often returns [] until voiceschanged). */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([])
  }
  const existing = refreshVoices()
  if (existing.length) return Promise.resolve(existing)

  return new Promise((resolve) => {
    const done = () => resolve(refreshVoices())
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true })
    let tries = 0
    const poll = setInterval(() => {
      tries += 1
      const list = refreshVoices()
      if (list.length || tries > 40) {
        clearInterval(poll)
        done()
      }
    }, 50)
  })
}

/** Call from any user gesture so browsers allow TTS + WebAudio later. */
export function unlockAudio() {
  userUnlocked = true
  try {
    const ctx = getCtx()
    if (ctx?.state === 'suspended') void ctx.resume()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      void loadVoices()
      try { window.speechSynthesis.resume() } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
}

function looksSpanish(text: string) {
  return /[áéíóúñü¿¡]/i.test(text) || /\b(hola|gracias|yo|soy|el|la|los|las|un|una|es|niño|manzana|mujer|hombre|niña)\b/i.test(text)
}

export function detectLang(text: string, fallback = 'en-US') {
  return looksSpanish(text) ? 'es-ES' : fallback
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  const want = lang.toLowerCase()
  const base = want.slice(0, 2)

  const scored = voices
    .map((v) => {
      const vl = (v.lang || '').toLowerCase()
      let score = 0
      if (vl === want) score += 50
      else if (vl.startsWith(base)) score += 30
      else return { v, score: -1 }
      const name = (v.name || '').toLowerCase()
      if (name.includes('google')) score += 20
      if (name.includes('natural') || name.includes('enhanced') || name.includes('premium')) score += 15
      if (name.includes('samantha') || name.includes('paulina') || name.includes('jorge') || name.includes('monica')) score += 8
      if (v.localService) score += 5
      return { v, score }
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score)

  return scored[0]?.v || null
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer)
    keepAliveTimer = null
  }
}

function startKeepAlive() {
  stopKeepAlive()
  keepAliveTimer = setInterval(() => {
    try {
      if (window.speechSynthesis.speaking) window.speechSynthesis.resume()
      else stopKeepAlive()
    } catch {
      stopKeepAlive()
    }
  }, 250)
}

function stopFallbackAudio() {
  if (fallbackAudio) {
    try {
      fallbackAudio.pause()
      fallbackAudio.removeAttribute('src')
      fallbackAudio.load()
    } catch { /* ignore */ }
    fallbackAudio = null
  }
}

/** Proxied TTS audio — works when Web Speech is blocked/silent. */
function speakViaAudioFallback(text: string, lang: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      stopFallbackAudio()
      const tl = lang.toLowerCase().startsWith('es') ? 'es' : 'en'
      const url = `/api/tts?tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(text.slice(0, 180))}`
      const audio = new Audio(url)
      fallbackAudio = audio
      let settled = false
      const done = (ok: boolean) => {
        if (settled) return
        settled = true
        resolve(ok)
      }
      audio.onended = () => done(true)
      audio.onerror = () => done(false)
      void audio.play().then(() => {
        // play started — treat as success; onended will also fire later
        done(true)
      }).catch(() => done(false))
    } catch {
      resolve(false)
    }
  })
}

function buildUtterance(text: string, lang: string) {
  const voices = refreshVoices()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = lang.toLowerCase().startsWith('es') ? 0.88 : 0.95
  u.pitch = 1
  u.volume = 1
  const voice = pickVoice(voices, lang)
  if (voice) {
    u.voice = voice
    if (voice.lang) u.lang = voice.lang
  }
  return u
}

function speakWebSpeech(text: string, lang: string, token: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(false)
      return
    }

    let settled = false
    const finish = (ok: boolean) => {
      if (settled) return
      settled = true
      stopKeepAlive()
      resolve(ok)
    }

    const fire = () => {
      if (token !== speakToken) {
        finish(false)
        return
      }
      const u = buildUtterance(text, lang)
      u.onend = () => finish(true)
      u.onerror = () => finish(false)
      u.onstart = () => startKeepAlive()
      try { window.speechSynthesis.resume() } catch { /* ignore */ }
      window.speechSynthesis.speak(u)
      startKeepAlive()
    }

    try { window.speechSynthesis.cancel() } catch { /* ignore */ }

    // Chromium often needs a beat after cancel(); Safari prefers near-immediate speak
    const delayMs = isChromium() ? 90 : 0
    window.setTimeout(fire, delayMs)

    // If nothing is queued/speaking soon, fail so caller can use /api/tts
    window.setTimeout(() => {
      if (token !== speakToken) {
        finish(false)
        return
      }
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        finish(false)
      }
    }, delayMs + 450)
  })
}

/**
 * Recite text aloud. Safe from click handlers.
 * Uses proxied /api/tts first (reliable), then Web Speech as backup.
 */
export async function speak(text: string, lang?: string): Promise<boolean> {
  const cleaned = String(text || '').trim()
  if (!cleaned) return false

  const resolvedLang = lang || detectLang(cleaned, 'en-US')
  const token = ++speakToken
  stopFallbackAudio()
  unlockAudio()
  void loadVoices()

  if (typeof window === 'undefined') return false

  // Primary: real audio file via our TTS proxy (works even when speechSynthesis is silent)
  try {
    const audioOk = await speakViaAudioFallback(cleaned, resolvedLang)
    if (token !== speakToken) return false
    if (audioOk) return true
  } catch { /* fall through */ }

  if (!('speechSynthesis' in window)) return false

  try {
    let ok = await speakWebSpeech(cleaned, resolvedLang, token)
    if (token !== speakToken) return false
    if (!ok) {
      await wait(80)
      if (token !== speakToken) return false
      ok = await speakWebSpeech(cleaned, resolvedLang, token)
    }
    return ok
  } catch {
    return false
  }
}

/** Fire-and-forget recite for click handlers. */
export function speakNow(text: string, lang?: string) {
  unlockAudio()
  void speak(text, lang)
}

export function stopSpeaking() {
  speakToken += 1
  stopKeepAlive()
  stopFallbackAudio()
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  } catch { /* ignore */ }
}

export function canAutoSpeak() {
  return userUnlocked
}

function tone(freqs: number[], duration = 0.16, type: OscillatorType = 'sine', gain = 0.1) {
  try {
    const ctx = getCtx()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume()
    const now = ctx.currentTime
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.connect(g)
      g.connect(ctx.destination)
      osc.type = type
      osc.frequency.value = freq
      const start = now + i * 0.09
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(gain, start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      osc.start(start)
      osc.stop(start + duration + 0.02)
    })
  } catch { /* ignore */ }
}

export function playCorrectSound() {
  unlockAudio()
  tone([523.25, 659.25, 783.99], 0.14, 'sine', 0.09)
}

export function playWrongSound() {
  unlockAudio()
  tone([220, 185], 0.2, 'triangle', 0.08)
}

export function playClickSound() {
  unlockAudio()
  tone([660], 0.06, 'sine', 0.04)
}

export function playFeedbackTone(correct: boolean) {
  if (correct) playCorrectSound()
  else playWrongSound()
}
