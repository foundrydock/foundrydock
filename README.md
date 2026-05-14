# Foundrydock

A lightweight, code-first slide editor built with React. Slides are plain `.tsx` files — no proprietary formats, no lock-in.

## What it does

- **16:9 fixed canvas** — slides render at 1920×1080 and scale to any viewport
- **Code-based slides** — each slide is a React component, giving you full control
- **10 layout templates** — title, two-column, three-up cards, chart focus, timeline, quote, and more
- **Presenter mode** — full-screen presentation with keyboard navigation (`Shift+P`)
- **Presenter notes** — per-slide notes panel (`Shift+N`), optionally persisted via Supabase
- **Design token system** — consistent colors and typography across all slides
- **Dark mode** — built in
- **Drag-and-drop slide ordering** — via dnd-kit
- **Multiple decks** — switch between decks from the sidebar

## Tech stack

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/) for data visualizations
- [Supabase](https://supabase.com/) (optional — only for presenter notes persistence)
- [dnd-kit](https://dndkit.com/) for drag-and-drop

## Getting started

### Prerequisites

- Node.js 18+ and npm (or [bun](https://bun.sh/))

### Run locally

```bash
git clone https://github.com/foundrydock/foundrydock.git
cd foundrydock
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Optional: Supabase (presenter notes)

Presenter notes are stored locally by default. To persist them across sessions:

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` and fill in your credentials
3. Run the migrations in `supabase/migrations/`

## Creating slides

Each slide is a `.tsx` file in `src/slides/demo/`:

```tsx
// src/slides/demo/Slide03MySlide.tsx
import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide03MySlide() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <h1 className="type-h1 text-slide-gray-900">My slide</h1>
      </div>
    </MSSlideLayout>
  );
}
```

Then add it to `src/slides/demo/index.ts`.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / next slide |
| `Shift+P` | Toggle presentation mode |
| `Shift+N` | Toggle presenter notes |
| `Escape` | Exit presentation mode |

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
