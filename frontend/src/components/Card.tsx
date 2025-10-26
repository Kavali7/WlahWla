import React from 'react'

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export type CardProps = React.PropsWithChildren<{
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  contentClassName?: string
}> &
  React.HTMLAttributes<HTMLDivElement>

export const Card: React.FC<CardProps> = ({
  title,
  description,
  actions,
  className,
  contentClassName,
  children,
  ...rest
}) => (
  <div className={cx('card p-6', className)} {...rest}>
    {(title || description || actions) && (
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          {title && <h3 className="text-lg font-semibold text-surface-cardForeground">{title}</h3>}
          {description && <p className="text-sm text-neutral-300">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
    )}
    <div className={cx('grid gap-3 text-neutral-100', contentClassName)}>{children}</div>
  </div>
)

Card.displayName = 'Card'
