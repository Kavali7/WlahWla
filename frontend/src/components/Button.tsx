import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-floating hover:bg-primary-600 active:bg-primary-700',
  secondary:
    'border border-surface-outline bg-surface text-secondary-600 shadow-sm hover:bg-surface-subtle hover:border-surface-outlineStrong active:bg-surface-subtle',
  ghost: 'border border-transparent bg-transparent text-secondary-600 hover:bg-surface-subtle/80 active:bg-surface-subtle',
  outline:
    'border border-surface-outline bg-transparent text-secondary-700 hover:border-primary/40 hover:bg-surface-subtle active:bg-surface-subtle/80',
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
