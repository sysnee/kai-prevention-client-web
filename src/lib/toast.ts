// src/lib/toast.ts
import { toast } from 'sonner'

interface ToastOptions {
  duration?: number
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, options)
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options)
  },
  loading: (message: string, options?: ToastOptions) => {
    toast.loading(message, options)
  },
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, messages)
  }
}
