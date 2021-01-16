import { useState, useEffect } from 'react'

export const useMediaQueries = <T>(queries: string[], values: T[], defaultValue: T): T => {
  // State and setter for matched value
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    // Array containing a media query list for each query
    const mediaQueryLists = queries.map((q) => window.matchMedia(q))

    // Function that gets value based on matching media query
    const getValue = (): T => {
      // Get index of first media query that matches
      const index = mediaQueryLists.findIndex((mql) => mql.matches)
      // Return related value or defaultValue if none
      return values?.[index] || defaultValue
    }

    setValue(getValue)

    // Event listener callback
    const handler = (): void => setValue(getValue)
    // Set a listener for each media query with above handler as callback.
    mediaQueryLists.forEach((mql) => mql.addEventListener('change', handler))
    // Remove listeners on cleanup
    return () => mediaQueryLists.forEach((mql) => mql.removeEventListener('change', handler))
  }, [queries, values, defaultValue])

  return value
}
