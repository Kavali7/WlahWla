import React from 'react'

type Variant = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

const variantStyles: Record<Variant, { soft: string; solid: string }> = {
  neutral: {
    soft: 'border-surface-outline bg-surface-badge text-secondary-600',
    solid: 'border-secondary-500 bg-secondary-500 text-secondary-foreground',
  },
  info: {
    soft: 'border-info/40 bg-info/10 text-info-700',
    solid: 'border-info bg-info text-info-foreground',
  },
  success: {
    soft: 'border-success/40 bg-success/10 text-success-700',
    solid: 'border-success bg-success text-success-foreground',
  },
  warning: {
    soft: 'border-warning/40 bg-warning/15 text-warning-700',
    solid: 'border-warning bg-warning text-warning-foreground',
  },
  danger: {
    soft: 'border-highlight/40 bg-highlight/10 text-highlight-700',
    solid: 'border-highlight bg-highlight text-highlight-foreground',
  },
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
      'inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-badge',
      soft ? variantStyles[variant].soft : variantStyles[variant].solid,
      className,
    )}
    {...rest}
  >
    {children}
  </span>
)

Badge.displayName = 'Badge'
