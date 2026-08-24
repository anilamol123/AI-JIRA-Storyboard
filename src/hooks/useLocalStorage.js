import { useCallback, useState } from "react"

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (valueOrUpdater) => {
      setValue((prev) => {
        const next =
          typeof valueOrUpdater === "function" ? valueOrUpdater(prev) : valueOrUpdater
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // storage may be unavailable; keep the value in memory only
        }
        return next
      })
    },
    [key]
  )

  return [value, setStoredValue]
}