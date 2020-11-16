import { useEffect, useRef } from 'react'

enum UserOS {
  MAC = 'macos',
  WIN = 'windows',
  UNIX = 'unix',
  LINUX = 'linux',
  MOBILE = 'mobile',
  IOS = 'ios',
  ANDROID = 'android',
  CHROMEOS = 'chromeos',
  UNKNOWN = 'unknown',
}

enum BrowserName {
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  SAFARI = 'safari',
  OPERA = 'opera',
  MSIE = 'IE',
  IE11 = 'IE11',
  LEGACYEDGE = 'legacy edge',
  EDGE = 'edge',
  UNKNOWN = 'unknown',
}

interface UserPlatformInfo {
  os: {
    name: UserOS
    version: string
  }
  browser: {
    name: BrowserName
    version: string
  }
  cookieEnabled: boolean
}

const supported = (): boolean => typeof navigator !== `undefined`

const detectOS = (): UserPlatformInfo['os'] => {
  const OS = {
    name: UserOS.UNKNOWN,
    version: '-',
  }

  const { appVersion } = navigator

  // Windows
  if (appVersion.indexOf('Win') !== -1) {
    const os = UserOS.WIN
    OS.name = os
    OS.version = /Windows ([\.\_\d]+)/.exec(appVersion)[1]
  }
  // MacOS
  if (/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/.test(appVersion)) {
    OS.name = UserOS.MAC
    OS.version = /Mac OS X (10[\.\_\d]+)/.exec(appVersion)[1]
  }
  // UNIX
  if (appVersion.indexOf('X11') !== -1) {
    OS.name = UserOS.UNIX
  }
  // Linux
  if (appVersion.indexOf('Linux') !== -1) {
    OS.name = UserOS.LINUX
  }
  // Mobile
  if (appVersion.indexOf('Mobi') !== -1) {
    OS.name = UserOS.MOBILE
  }
  // IOS
  if (/(iPhone|iPad|iPod)/.test(appVersion)) {
    OS.name = UserOS.IOS
    const osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(appVersion)
    OS.version = `${osVersion[1]}.${osVersion[2]}.${osVersion[3]}`
  }
  // Android
  if (appVersion.indexOf('Android') !== -1) {
    OS.name = UserOS.ANDROID
    OS.version = /Android ([\.\_\d]+)/.exec(appVersion)[1]
  }
  // Chrome OS
  if (appVersion.indexOf('CrOS') !== -1) {
    OS.name = UserOS.CHROMEOS
  }

  return OS
}

const detectBrowser = (): UserPlatformInfo['browser'] => {
  const browser = {
    name: BrowserName.UNKNOWN,
    version: '-',
  }

  const { appVersion } = navigator

  let verOffset

  // Opera
  if ((verOffset = appVersion.indexOf('Opera')) !== -1) {
    browser.name = BrowserName.OPERA
    browser.version = appVersion.substring(verOffset + 6)
  }
  // Microsoft Edge (legacy)
  if ((verOffset = appVersion.indexOf('Edge')) !== -1) {
    browser.name = BrowserName.LEGACYEDGE
  }
  // Microsoft Edge (Chromium)
  if ((verOffset = appVersion.indexOf('Edg')) !== -1) {
    browser.name = BrowserName.EDGE
  }
  // Microsoft Internet Explorer
  if ((verOffset = appVersion.indexOf('MSIE')) !== -1) {
    browser.name = BrowserName.MSIE
  }
  // Chrome
  if ((verOffset = appVersion.indexOf('Chrome')) !== -1) {
    browser.name = BrowserName.CHROME
  }
  // Safari
  if ((verOffset = appVersion.indexOf('Safari')) !== -1) {
    browser.name = BrowserName.SAFARI
  }
  // Firefox
  if ((verOffset = appVersion.indexOf('Firefox')) !== -1) {
    browser.name = BrowserName.FIREFOX
  }
  // Microsoft Internet Explorer 11+
  if ((verOffset = appVersion.indexOf('Trident/')) !== -1) {
    browser.name = BrowserName.IE11
  }

  return browser
}

export const usePlatformInfo = (): UserPlatformInfo => {
  const isSupported = supported()

  const stateRef = useRef({
    os: {
      name: UserOS.UNKNOWN,
      version: '-',
    },
    browser: {
      name: BrowserName.UNKNOWN,
      version: '-',
    },
    cookieEnabled: false,
  })

  useEffect(() => {
    if (isSupported) {
      stateRef.current = {
        os: detectOS(),
        browser: detectBrowser(),
        cookieEnabled: navigator.cookieEnabled ? true : false,
      }
    }
  }, [isSupported])

  return stateRef.current
}
