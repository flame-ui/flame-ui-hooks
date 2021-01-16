export const supported = (api: string): boolean => api in window

export const isClient = typeof window === 'object'

export const hasOwnProperty = (obj: object, prop: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, prop)
