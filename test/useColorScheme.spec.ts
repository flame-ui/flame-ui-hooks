import { renderHook } from '@testing-library/react-hooks'
import { MatchMedia } from './_mocks/MatchMedia'

import { useColorScheme } from '../src/useColorScheme'

let matchMedia: MatchMedia

describe('useColorScheme hook', () => {
  beforeAll(() => {
    matchMedia = new MatchMedia()
  })

  afterEach(() => {
    matchMedia.clear()
  })

  it('should return colors-cheme if no target is passed', () => {
    matchMedia.useMediaQuery('(prefers-color-scheme: light)')
    const { result } = renderHook(() => useColorScheme())
    expect(typeof result.current).toBe('string')
    expect(result.current).toBe('light')
  })

  it('should return true if target dark and preferred color dark', () => {
    matchMedia.useMediaQuery('(prefers-color-scheme: dark)')
    const { result } = renderHook(() => useColorScheme('dark'))
    expect(typeof result.current).toBe('boolean')
    expect(result.current).toBe(true)
  })
})
