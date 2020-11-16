import { isClient } from '../src/utils'

describe('isClient utility', () => {
  it('should return true during tests', () => expect(isClient).toBe(true))
})
