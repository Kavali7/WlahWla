import React from 'react'

export default function LoadingScreen() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <span className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-brand-200 border-t-brand-500" />
        <p className="text-sm font-medium">Chargement...</p>
      </div>
    </div>
  )
}
