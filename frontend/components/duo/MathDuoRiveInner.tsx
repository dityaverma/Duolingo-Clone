'use client'
import { useEffect } from 'react'
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas'

/** Client-only Rive canvas for Math path Duo-on-clock */
export default function MathDuoRiveInner() {
  const { rive, RiveComponent } = useRive({
    src: '/assets/rive/math-path.riv',
    artboard: 'Math_Duo_Clock',
    stateMachines: 'Mega_Path_StateMachine',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  })

  useEffect(() => {
    if (!rive) return
    try {
      rive.resizeDrawingSurfaceToCanvas()
    } catch { /* ignore */ }
  }, [rive])

  return <RiveComponent style={{ width: '100%', height: '100%' }} />
}
