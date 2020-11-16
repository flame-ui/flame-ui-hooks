# flame-ui-hooks

flame-ui hooks package

## Install

using yarn

```bash
yarn add @flame-ui/hooks
```

or npm

```bash
npm i @flame-ui/hooks
```

## Available hooks

- `useColorScheme`: () => preferColorScheme | (targetColorScheme) => boolean
- `useEffectOnce`: (effectCallback) => void
- `useMedia`: (mediaQuery) => boolean
- `usePlatformInfo`: () => { os: { name, version }, browser: { name, version }, enabledCookies }
- `useRafState`: (initialState?) => [state, setRafState]
- `useUnmount`: (callback) => void
- `useWindowScroll`: () => { x, y }
