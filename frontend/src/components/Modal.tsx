import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export type ModalProps = {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          'relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl',
          className,
        )}
      >
        <header className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
              {description && <p className="text-sm text-slate-500">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Fermer"
              type="button"
            >
              X
            </button>
          </div>
        </header>
        <div className="grid gap-4 px-6 py-5">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

Modal.displayName = 'Modal'
