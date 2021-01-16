import { useState, useEffect, useRef, useCallback } from 'react'
import { supported } from './utils'

const COLOR_SCHEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  NONE: 'no-preference',
} as const

const values = Object.values(COLOR_SCHEMES)
const defaultScheme = COLOR_SCHEMES.NONE

type ColorScheme = typeof COLOR_SCHEMES[keyof typeof COLOR_SCHEMES]

const makeQuery = (scheme: ColorScheme): string => `(prefers-color-scheme: ${scheme})`

const matchColorSchemes = (scheme: ColorScheme): MediaQueryList =>
  window.matchMedia(makeQuery(scheme))

export const useColorScheme = (targetScheme?: ColorScheme): boolean | ColorScheme => {
  // Check browser support matchMedia API
  const isSupported = supported('matchMedia')

  // Create ref states
  const isMounted = useRef(false)
  const colorScheme = useRef<{ scheme: ColorScheme; query: MediaQueryList }>()

  // Create scheme state
  const [scheme, setColorScheme] = useState<ColorScheme>(defaultScheme)

  // Get current color scheme helper
  const getCurrentColorScheme = useCallback((): { scheme: ColorScheme; query: MediaQueryList } => {
    return values
      .map((value: ColorScheme) => ({
        scheme: value,
        query: matchColorSchemes(value),
      }))
      .filter((scheme) => scheme.query.matches)[0]
  }, [])

  // @ts-ignore
  useEffect(() => {
    // Event listener callback
    function schemeChangeHandler(e: MediaQueryListEvent): void {
      if (!e.matches) {
        // Remove old listener
        // @ts-ignore
        this.removeEventListener('change', schemeChangeHandler)
        // Update scheme ref
        const { query, scheme } = (colorScheme.current = getCurrentColorScheme())

        // Update scheme state
        isMounted.current && setColorScheme(scheme)
        // Add new listener
        query.addEventListener('change', schemeChangeHandler)
      }
    }

    if (isSupported) {
      // Update scheme ref
      const { query, scheme } = (colorScheme.current = getCurrentColorScheme())

      // Set scheme state
      setColorScheme(scheme)

      // Add listener
      query.addEventListener('change', schemeChangeHandler)
      isMounted.current = true

      return () => {
        // Get ref query
        // @ts-ignore
        const { query } = colorScheme.current
        // Remove listener
        query.removeEventListener('change', schemeChangeHandler)
        isMounted.current = false
      }
    }
  }, [isSupported, getCurrentColorScheme])

  return targetScheme ? scheme === targetScheme : scheme
}
