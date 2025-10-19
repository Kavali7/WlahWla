import React from 'react'

type Variant = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

const variantStyles: Record<Variant, string> = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-700',
  info: 'border-brand-200 bg-brand-50 text-brand-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
}

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant
  soft?: boolean
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', soft = true, className, children, ...rest }) => (
  <span
    className={cx(
      'inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      soft ? 'bg-opacity-90' : '',
      variantStyles[variant],
      className,
    )}
    {...rest}
  >
    {children}
  </span>
)

Badge.displayName = 'Badge'
