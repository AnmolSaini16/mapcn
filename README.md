<h1 align="center">mapcn-react-native</h1>

<p align="center">
  React Native map components for Expo, forked from <a href="https://github.com/AnmolSaini16/mapcn">mapcn</a>.<br/>
  Built on <a href="https://maplibre.org/maplibre-react-native/">MapLibre React Native</a>, styled with <a href="https://www.nativewind.dev/">NativeWind</a>, and inspired by <a href="https://ui.shadcn.com/">shadcn/ui</a> patterns.
</p>

<p align="center">
  <a href="https://github.com/AnmolSaini16/mapcn">Upstream mapcn</a> ·
  <a href="https://mapcn.dev">mapcn.dev</a> ·
  <a href="ATTRIBUTION.md">Attribution</a>
</p>

<br />

## About this fork

This repository is a fork of [AnmolSaini16/mapcn](https://github.com/AnmolSaini16/mapcn), the web version of mapcn. It ports the component API and design language to React Native and Expo using `@maplibre/maplibre-react-native`.

Original project: [mapcn.dev](https://mapcn.dev)

## Features

- **Theme-aware** — Adapts to light and dark mode
- **Expo-ready** — Works with Expo Router and dev client
- **MapLibre powered** — Native maps via MapLibre React Native
- **Composable** — Map, markers, popups, routes, arcs, and controls
- **NativeWind** — Tailwind-style styling for React Native
- **Registry-compatible** — Component library lives in `src/registry/`

## Getting started

```bash
npm install
npx expo start
```

Run on a device or simulator:

```bash
npm run ios
npm run android
```

## Install into your project

Requires an Expo / React Native project with NativeWind and [React Native Reusables](https://reactnativereusables.com) set up.

```bash
npx shadcn@latest add unkn0wndfbx/mapcn-react-native/map
```

Or with the Reusables CLI:

```bash
npx @react-native-reusables/cli@latest add unkn0wndfbx/mapcn-react-native/map
```

Then import from `@/components/ui/map`:

```tsx
import { Map, MapControls } from "@/components/ui/map";

export function MyMap() {
  return (
    <View className="h-[320px] overflow-hidden rounded-lg">
      <Map center={[-74.006, 40.7128]} zoom={11}>
        <MapControls />
      </Map>
    </View>
  );
}
```

Blocks install the same way, for example:

```bash
npx shadcn@latest add unkn0wndfbx/mapcn-react-native/delivery-tracker
```

Build the distributable registry (docs site):

```bash
bun run registry:build
```

## Project structure

```
src/
├── app/              # Expo Router screens
├── components/       # Shared UI components
├── registry/         # Map component library (forked from mapcn)
│   ├── map.tsx       # Map, Marker, Popup, Route, Controls, etc.
│   └── blocks/       # Full-page block examples
├── lib/              # Utilities and theme
└── styles/           # Global styles
```

## Basemap terms of service

This project uses [CARTO Basemaps](https://docs.carto.com/faqs/carto-basemaps) which are based on OpenStreetMap data.

- **Commercial use**: Requires a CARTO Enterprise license. [Request a demo](https://carto.com/request-live-demo) for pricing details.
- **Non-commercial use**: Free for CARTO grantees under their [basemap terms](https://carto.com/legal/bmap).
- **Alternative**: Switch to [OpenStreetMap](https://www.openstreetmap.org/) tiles or any other MapLibre-compatible tile provider.

## Contributing

Contributions are welcome. Please open an issue or pull request on this repository.

For changes that belong in the upstream web project, consider contributing to [AnmolSaini16/mapcn](https://github.com/AnmolSaini16/mapcn) instead.

## License

MIT License — see [LICENSE](LICENSE) for details.

This fork includes code from the original [mapcn](https://github.com/AnmolSaini16/mapcn) project. See [ATTRIBUTION.md](ATTRIBUTION.md) for full attribution.
