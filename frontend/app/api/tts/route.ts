import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Proxies Google Translate TTS so the browser can play lesson recite audio
 * when Web Speech API is missing, muted, or silently fails (common in Chromium).
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim().slice(0, 180)
  const tlRaw = (req.nextUrl.searchParams.get('tl') || 'en').toLowerCase()
  const tl = tlRaw.startsWith('es') ? 'es' : 'en'

  if (!q) {
    return NextResponse.json({ detail: 'Missing q' }, { status: 400 })
  }

  const upstream =
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}&q=` +
    encodeURIComponent(q)

  try {
    const res = await fetch(upstream, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
        Referer: 'https://translate.google.com/',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json(
        { detail: `TTS upstream failed (${res.status})` },
        { status: 502 },
      )
    }

    const buf = await res.arrayBuffer()
    if (!buf.byteLength) {
      return NextResponse.json({ detail: 'Empty TTS audio' }, { status: 502 })
    }

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { detail: err?.message || 'TTS fetch failed' },
      { status: 502 },
    )
  }
}
