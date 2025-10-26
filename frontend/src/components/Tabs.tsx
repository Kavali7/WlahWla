import React from 'react'

type TabsContextValue = {
  value: string
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>')
  }
  return context
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

export type TabsProps = React.PropsWithChildren<{
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}>

export const Tabs: React.FC<TabsProps> = ({ value, defaultValue, onValueChange, className, children }) => {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '')
  const currentValue = isControlled ? value : uncontrolledValue

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [isControlled, onValueChange],
  )

  React.useEffect(() => {
    if (currentValue === '' && defaultValue) {
      setValue(defaultValue)
    }
  }, [currentValue, defaultValue, setValue])

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({
      value: currentValue,
      setValue,
    }),
    [currentValue, setValue],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cx('flex flex-col gap-4', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>

export const TabsList: React.FC<TabsListProps> = ({ className, children, ...rest }) => (
  <div
    role="tablist"
    className={cx(
      'inline-flex items-center gap-1 rounded-pill border border-surface-outline bg-surface-subtle p-1 backdrop-blur-sm',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
)

export type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
  badge?: React.ReactNode
  icon?: React.ReactNode
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, badge, icon, className, children, ...rest }) => {
  const { value: activeValue, setValue } = useTabsContext()
  const isActive = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      id={`${value}-tab`}
      aria-controls={`${value}-panel`}
      className={cx(
        'group flex flex-1 items-center justify-center gap-2 rounded-[1.75rem] border border-transparent px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle',
        isActive
          ? 'bg-surface text-secondary-700 shadow-floating'
          : 'text-neutral-500 hover:text-secondary-600 hover:bg-surface',
        className,
      )}
      onClick={(event) => {
        rest.onClick?.(event)
        if (!event.defaultPrevented) {
          setValue(value)
        }
      }}
      {...rest}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      <span className="truncate">{children}</span>
      {badge && <span className="ml-auto inline-flex">{badge}</span>}
    </button>
  )
}

export type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className, children, ...rest }) => {
  const { value: activeValue } = useTabsContext()
  const isActive = activeValue === value

  if (!isActive) {
    return null
  }

  return (
    <div
      role="tabpanel"
      aria-labelledby={`${value}-tab`}
      id={`${value}-panel`}
      className={cx('rounded-3xl border border-surface-outline bg-surface p-6 shadow-floating', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

Tabs.displayName = 'Tabs'
TabsList.displayName = 'TabsList'
TabsTrigger.displayName = 'TabsTrigger'
TabsContent.displayName = 'TabsContent'
