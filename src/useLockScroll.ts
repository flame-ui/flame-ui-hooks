import { RefObject, useEffect, useRef } from 'react'

export function getClosestBody(
  el: Element | HTMLElement | HTMLIFrameElement | null,
): HTMLElement | null {
  if (!el) {
    return null
  } else if (el.tagName === 'BODY') {
    return el as HTMLElement
  } else if (el.tagName === 'IFRAME') {
    const document = (el as HTMLIFrameElement).contentDocument
    return document ? document.body : null
  } else if (!(el as HTMLElement).offsetParent) {
    return null
  }

  return getClosestBody((el as HTMLElement).offsetParent!)
}

function preventDefault(rawEvent: TouchEvent): boolean {
  const e = rawEvent || window.event
  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  // @ts-ignore
  if (e.touches.length > 1) return true

  if (e.preventDefault) e.preventDefault()

  return false
}

export interface BodyInfoItem {
  counter: number
  initialOverflow: CSSStyleDeclaration['overflow']
}

const isIosDevice =
  typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.platform &&
  /iP(ad|hone|od)/.test(window.navigator.platform)

const bodies: Map<HTMLElement, BodyInfoItem> = new Map()

const doc: Document | undefined = typeof document === 'object' ? document : undefined

let documentListenerAdded = false

export const useLockScroll = !doc
  ? // eslint-disable-next-line @typescript-eslint/no-empty-function
    function useLockBodyMock() {}
  : function useLockBody(locked = true, elementRef?: RefObject<HTMLElement>) {
      const bodyRef = useRef(doc!.body)
      elementRef = elementRef || bodyRef

      const lock = (body: HTMLElement): void => {
        const bodyInfo = bodies.get(body)
        if (!bodyInfo) {
          bodies.set(body, { counter: 1, initialOverflow: body.style.overflow })
          if (isIosDevice) {
            if (!documentListenerAdded) {
              document.addEventListener('touchmove', preventDefault, { passive: false })

              documentListenerAdded = true
            }
          } else {
            body.style.overflow = 'hidden'
          }
        } else {
          bodies.set(body, {
            counter: bodyInfo.counter + 1,
            initialOverflow: bodyInfo.initialOverflow,
          })
        }
      }

      const unlock = (body: HTMLElement): void => {
        const bodyInfo = bodies.get(body)
        if (bodyInfo) {
          if (bodyInfo.counter === 1) {
            bodies.delete(body)
            if (isIosDevice) {
              body.ontouchmove = null

              if (documentListenerAdded) {
                document.removeEventListener('touchmove', preventDefault)
                documentListenerAdded = false
              }
            } else {
              body.style.overflow = bodyInfo.initialOverflow
            }
          } else {
            bodies.set(body, {
              counter: bodyInfo.counter - 1,
              initialOverflow: bodyInfo.initialOverflow,
            })
          }
        }
      }

      useEffect(() => {
        const body = getClosestBody(elementRef!.current)
        if (!body) {
          return
        }
        if (locked) {
          lock(body)
        } else {
          unlock(body)
        }
      }, [locked, elementRef.current])

      // clean up, on un-mount
      useEffect(() => {
        const body = getClosestBody(elementRef!.current)
        if (!body) {
          return
        }
        return () => {
          unlock(body)
        }
      }, [])
    }
