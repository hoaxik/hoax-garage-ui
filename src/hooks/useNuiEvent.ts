import { useEffect } from 'react'

interface NuiMessage {
  type: string
  [key: string]: any
}

export const useNuiEvent = <T = any>(action: string, handler: (data: T) => void) => {
  useEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessage>) => {
      const { type, ...data } = event.data

      if (type === action) {
        handler(data as T)
      }
    }

    window.addEventListener('message', eventListener)
    return () => window.removeEventListener('message', eventListener)
  }, [action, handler])
}