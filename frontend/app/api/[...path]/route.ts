import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BACKEND = (process.env.BACKEND_API_URL || 'http://127.0.0.1:8001').replace(/\/$/, '')

async function proxy(req: NextRequest, path: string[]) {
  const sub = path.join('/')
  const url = new URL(req.url)
  const target = `${BACKEND}/api/${sub}${url.search}`

  const headers = new Headers()
  const contentType = req.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  const accept = req.headers.get('accept')
  if (accept) headers.set('accept', accept)

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: 'no-store',
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer()
  }

  try {
    const res = await fetch(target, init)
    const body = await res.arrayBuffer()
    const out = new NextResponse(body, { status: res.status })
    const resType = res.headers.get('content-type')
    if (resType) out.headers.set('content-type', resType)
    return out
  } catch (err: any) {
    return NextResponse.json(
      { detail: `Backend unreachable (${BACKEND}). ${err?.message || 'fetch failed'}` },
      { status: 502 },
    )
  }
}

type Ctx = { params: Promise<{ path: string[] }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params
  return proxy(req, path)
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params
  return proxy(req, path)
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params
  return proxy(req, path)
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params
  return proxy(req, path)
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params
  return proxy(req, path)
}
