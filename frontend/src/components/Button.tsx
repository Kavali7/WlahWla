import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white shadow-soft hover:bg-brand-600 active:bg-brand-700',
  secondary:
    'bg-white text-slate-700 border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  outline:
    'bg-transparent text-slate-800 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export type ButtonProps<T extends React.ElementType = 'button'> = {
  as?: T
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>

export const Button = <T extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  icon,
  children,
  ...rest
}: ButtonProps<T>) => {
  const Component = (as ?? 'button') as React.ElementType
  return (
    <Component className={cx(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...rest}>
      {icon && <span className="text-lg leading-none">{icon}</span>}
      <span>{children}</span>
    </Component>
  )
}

Button.displayName = 'Button'
