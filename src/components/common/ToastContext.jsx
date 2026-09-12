import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, options = {}) => {
    const id = Date.now()
    setToast({
      id,
      message,
      type: options.type || 'success',
      duration: options.duration || 3200,
    })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), toast.duration)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      {toast && (
        <div
          className="fixed inset-x-4 bottom-4 z-[200] flex justify-center pointer-events-none sm:inset-x-auto sm:right-6 sm:left-auto sm:max-w-[380px]"
          role="status"
          aria-live="polite"
        >
          <div className="toast-enter pointer-events-auto flex w-full items-center gap-sm border border-line bg-surface px-md py-sm shadow-hung rounded-md">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast">
              <Check size={15} strokeWidth={2} />
            </span>
            <p className="min-w-0 flex-1 text-body-sm text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={dismissToast}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-sm p-xs text-ink-soft hover:text-ink hover:bg-bg"
            >
              <X size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
