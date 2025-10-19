import React from 'react'

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export const TableContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...rest
}) => (
  <div
    className={cx('overflow-x-auto rounded-2xl border border-slate-200 bg-surface shadow-soft', className)}
    {...rest}
  >
    {children}
  </div>
)

type NativeProps<T> = React.HTMLAttributes<T> & { className?: string }

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className, ...rest }) => (
  <table className={cx('min-w-full divide-y divide-slate-200 text-sm', className)} {...rest} />
)

export const TableHeader: React.FC<NativeProps<HTMLTableSectionElement>> = ({ className, ...rest }) => (
  <thead className={cx('bg-surface-muted', className)} {...rest} />
)

export const TableBody: React.FC<NativeProps<HTMLTableSectionElement>> = ({ className, ...rest }) => (
  <tbody className={cx('divide-y divide-slate-100', className)} {...rest} />
)

export const TableRow: React.FC<NativeProps<HTMLTableRowElement>> = ({ className, ...rest }) => (
  <tr className={cx('hover:bg-slate-50 transition-colors', className)} {...rest} />
)

export const TableHeadCell: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  ...rest
}) => (
  <th className={cx('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500', className)} {...rest} />
)

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, ...rest }) => (
  <td className={cx('px-4 py-3 text-sm text-slate-700', className)} {...rest} />
)
