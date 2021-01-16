import { useEffect, useRef } from 'react'
import UAParser from 'ua-parser-js'

interface UserPlatformInfo {
  device: {
    model: string | undefined
    type: string | undefined
    vendor: string | undefined
  }
  os: {
    name: string | undefined
    version: string | undefined
  }
  browser: {
    name: string | undefined
    version: string | undefined
    major: string | undefined
  }
  cookieEnabled: boolean
}

const supported = (): boolean => typeof navigator !== `undefined`

export const usePlatformInfo = (): UserPlatformInfo => {
  const isSupported = supported()

  const stateRef = useRef<UserPlatformInfo>({
    device: {
      model: '-',
      type: '-',
      vendor: '-',
    },
    os: {
      name: 'Unknown',
      version: '-',
    },
    browser: {
      name: 'Unknown',
      version: '-',
      major: '-',
    },
    cookieEnabled: false,
  })

  useEffect(() => {
    if (isSupported) {
      const parser = new UAParser()

      const _device = parser.getDevice()
      const _os = parser.getOS()
      const _browser = parser.getBrowser()

      stateRef.current = {
        device: {
          model: _device.model,
          type: _device.type || 'desktop',
          vendor: _device.vendor,
        },
        os: _os,
        browser: _browser,
        cookieEnabled: navigator.cookieEnabled ? true : false,
      }
    }
  }, [isSupported])

  return stateRef.current
}
