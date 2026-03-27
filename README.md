<h1 align="center">mapcn</h1>

<p align="center">
  Free & open-source, ready-to-use, customizable map components for React.<br/>
  Zero config. One command setup. Built on <a href="https://maplibre.org/">MapLibre GL</a>, styled with <a href="https://tailwindcss.com/">Tailwind</a>, works seamlessly with <a href="https://ui.shadcn.com/">shadcn/ui</a>.
</p>

<p align="center">
  <a href="https://mapcn.dev/docs">Get Started</a> ·
  <a href="https://mapcn.dev/docs/installation">Installation</a> ·
  <a href="https://mapcn.dev/docs/basic-map">Components</a>
</p>

<br />

<p align="center">
  <a href="https://vercel.com/oss">
    <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
  </a>
</p>

<p align="center">
  <img src="public/banner.png" alt="mapcn banner" />
</p>

## Features

- 🎨 **Theme-aware** — Automatically adapts to light/dark mode
- 🎯 **Zero config** — Works out of the box with sensible defaults
- 📦 **shadcn/ui compatible** — Uses the same patterns and styling conventions
- 🗺️ **MapLibre GL powered** — Full access to MapLibre's powerful mapping capabilities
- 🧩 **Composable** — Build complex map UIs with simple, declarative components
- 📍 **Markers & Popups** — Rich marker system with popups, tooltips, and labels
- 🛤️ **Routes** — Draw routes and paths on your maps
- 🎮 **Controls** — Zoom, compass, locate, and fullscreen controls

## Basemap

This project uses [maps.guru](https://maps.guru) vector tiles by default, which provide India-compliant boundaries per Survey of India guidelines.

To use the default basemap, set the `NEXT_PUBLIC_MAPSGURU_API_KEY` environment variable:

```bash
# .env.local
NEXT_PUBLIC_MAPSGURU_API_KEY=your_api_key_here
```

Get your API key at [maps.guru](https://maps.guru).

You can also switch to any other [MapLibre-compatible](https://maplibre.org/) tile provider (MapTiler, Stadia Maps, OpenStreetMap, etc.) by passing custom `styles` to the `<Map>` component.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Star History

<a href="https://www.star-history.com/#AnmolSaini16/mapcn&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=AnmolSaini16/mapcn&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=AnmolSaini16/mapcn&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=AnmolSaini16/mapcn&type=date&legend=top-left" />
 </picture>
</a>
