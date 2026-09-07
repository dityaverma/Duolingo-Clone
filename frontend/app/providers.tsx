'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      // Avoid theme class mismatch between SSR HTML and first client paint
      storageKey="duo-theme"
    >
      {children}
    </ThemeProvider>
  )
}
