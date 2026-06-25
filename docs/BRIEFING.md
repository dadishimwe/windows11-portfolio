# Windows 11 Portfolio — Technical & Design Briefing

> **Purpose:** Onboard a senior engineer or experienced product/UI designer. Use this to understand the project deeply and propose ideas, improvements, and next features.
>
> **Owner:** Dadi Ishimwe (`dadishimwe`)  
> **Portfolio:** https://dadishimwe.com  
> **Blog:** https://blog.dadishimwe.com  
> **Repo:** https://github.com/dadishimwe/windows11-portfolio

---

## What this project is

**A personal portfolio website disguised as a Windows 11 desktop.**

Instead of a traditional scrollable portfolio, visitors land on a faux desktop with wallpaper, draggable windows, a centered taskbar, and a Start menu. Portfolio content lives inside “apps” and “folders”: File Explorer, Notepad, Terminal, Firefox, Pictures, Videos, and more.

**Owner profile:** Network engineer, data scientist, Fortinet-certified (NSE, FCF, FCA, FortiGate Operator).

**Fork origin:** [KasperiP/windows11-portfolio](https://github.com/KasperiP/windows11-portfolio) (MIT), heavily customized.

**Positioning:** The site *is* the portfolio; the blog is long-form writing. The apex domain hosts the interactive Windows experience; the blog lives on a subdomain.

---

## Design intent

| Principle | What it means |
|-----------|----------------|
| **Nostalgia + craft** | Windows 11 Fluent UI mimicry — dark chrome, acrylic-ish panels, window animations |
| **Content through metaphor** | Résumé ≈ Notepad, projects ≈ GitHub folder, certs ≈ Documents, socials ≈ Links |
| **Playful but professional** | Easter eggs (terminal commands, Recycle Bin) without undermining credibility |
| **Desktop-first** | Primary experience is ≥881px wide; mobile is a simplified alternate shell |
| **Real URLs under the hood** | Routes are crawlable (`/explorer/projects`, `/notepad/about`) for SEO |

---

## Technical stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 12** (Pages Router) | Not App Router |
| UI | **React 17** | |
| Language | **TypeScript** | |
| Styling | **CSS Modules** | Per-component `.module.css` |
| Window drag/resize | **react-rnd** | Draggable, resizable windows |
| Animations | **Framer Motion 6** | Open/close, maximize |
| Icons | **react-icons** | Mixed with custom PNG/SVG in `/public` |
| Desktop selection | **react-selecto** | Marquee-select desktop icons |
| Images | **next/image** + **sharp** | Cloudinary + local fallbacks |
| Hosting | **Vercel** | ISR on some routes (60s) |
| Media | **Cloudinary Admin API** | Dynamic folder mode (`asset_folder`) |
| State | **React Context** | No Redux/Zustand |

**Not used:** databases, auth, CMS, Tailwind, App Router, WebSockets.

---

## Architecture

### 1. Dual rendering model

The app has **two parallel UX layers**:

**A. Desktop shell (parent page)**

- `Layout.tsx` → wallpaper, `DesktopWindows`, taskbar (`Footer`)
- Windows: Explorer, Notepad, Terminal, Firefox, Media Player
- State in `ContextProvider`: open windows, z-index, positions, minimize, explorer path, Firefox tabs, media player

**B. Route pages (Next.js pages)**

- Each folder/app has a real route: `/explorer/projects`, `/notepad/about`, etc.
- Used for SEO, deep links, and **iframe embeds** inside File Explorer

### 2. File Explorer = iframe embed pattern

File Explorer is a window whose content pane is an **iframe** loading routes with `?embed=true`.

```
Desktop (parent)
 └── FileExplorer window
      └── <iframe src="/explorer/desktop?embed=true" />
           └── ExplorerPage → ExplorerEmbedShell (dark bg, no wallpaper)
```

**Why:** Explorer content is real Next.js pages without duplicating list UIs.

**Bridge pattern:** Actions that must open **desktop-level windows** (Notepad, media player) cannot navigate inside the iframe. They use `postMessage` to the parent:

| Message | Opens |
|---------|--------|
| `portfolio:open-media` | Photos/Videos viewer window |
| `portfolio:open-window` | Notepad, Terminal, Firefox, Explorer |

Helpers: `EmbedAppLink`, `ExplorerLink`, `useEmbedBridge`.

### 3. Window manager

- `openWindowsState`: `{ fileExplorer, notepad, terminal, firefox }` booleans
- `mediaPlayerState`: separate (photos/videos viewer)
- `useWindowManager()`: open, close, toggle, focus, navigate explorer path
- `windowPriorityState`: z-index stacking
- `positionState` / `maximizedState` / `minimizedState`: per-window chrome

Desktop shortcuts use `DesktopLink` → `openWindow()` (not route navigation).

### 4. Mobile (≤880px)

`MobileLayout` replaces the desktop: card grid (About, Certifications, Projects, Links, Blog, Source) + slide-up panels. Desktop routes still exist but are hidden; the old BSOD gate was removed.

### 5. Config-driven content

Most copy and data lives in `/config`:

| File | Purpose |
|------|---------|
| `site.ts` | Identity, URLs, SEO |
| `certifications.ts` | Credly badges + images |
| `taskbar.ts` | Pinned apps, Firefox home = blog |
| `explorerRoutes.ts` | Folder metadata (title, icon, topNav) |
| `notepadContent.ts` | About text |
| `cloudinary.ts` | Gallery folder prefixes |
| `filesystem.ts` | Virtual FS for Terminal `ls`/`cd`/`cat` |
| `sitemapRoutes.ts` | SEO sitemap |

---

## Feature inventory

### Shipped and working

| Feature | Behavior |
|---------|----------|
| **Desktop icons** | Marquee select, Delete key → Recycle Bin visual (cosmetic) |
| **File Explorer** | Sidebar (Quick access, This PC), back/forward, path bar, iframe folders |
| **Multi-window** | Explorer + Notepad + Terminal + Firefox + Media simultaneously |
| **Notepad** | About text from config; opens from desktop or Explorer via embed bridge |
| **Terminal** | Multi-tab, `help`, `ls`/`cd`/`cat`, virtual FS, `certs`, `contact`, `skills`, simulated `ping`/`traceroute`/`nslookup`/`netstat`, real public IP via ipify |
| **Firefox** | Tabs, back/forward/reload, DuckDuckGo search, auto-opens blog on desktop load |
| **Projects** | GitHub API (`dadishimwe` repos, no forks) in Explorer list |
| **Certifications** | 6 Fortinet Credly badges, grid UI, links to public badge pages |
| **Pictures / Videos** | Cloudinary galleries; click → desktop media player + taskbar icon |
| **Links** | LinkedIn, GitHub, Instagram, email shortcuts |
| **Taskbar** | Start menu (socials), pinned Explorer/Terminal/Pictures/Firefox, dynamic media icon |
| **Mobile layout** | Responsive portfolio without desktop chrome |
| **SEO** | `robots.txt`, `sitemap.xml`, OG/Twitter meta, JSON-LD on home |
| **Domain split** | Portfolio apex + blog subdomain |

### Partial / placeholder

| Feature | Current state |
|---------|----------------|
| **Tools** | Static shortcuts (VS Code, GitHub Desktop) — not personalized |
| **Podcasts** | Empty folder |
| **Downloads** | Empty folder |
| **Music** | Empty folder |
| **Recycle Bin** | Visual only (empty/full icon) |
| **Drives C:/D:** | Shell pages; D: links to Documents/Certs |
| **OG image** | `programmer.png` — not a custom 1200×630 social card |
| **Search (Explorer)** | UI only, non-functional |
| **Some Explorer toolbar** | New/Cut/Copy/etc. — decorative |

### Known technical constraints

- **Next.js 12 / React 17** — upgrade is non-trivial
- **iframe embeds** — need `postMessage` bridges for desktop-level actions
- **Cloudinary** — uses `by_asset_folder` API (dynamic folders; `public_id` ≠ folder path)
- **Firefox iframe** — many sites block embedding (X-Frame-Options); blog must allow it or fallback to “open in new tab”
- **SEO vs. client windows** — crawlers see route pages; window chrome is client-side
- **880px breakpoint** — hard switch, not fluid desktop scaling
- **No persistence** — window positions don’t survive refresh

---

## Content & brand

**Professional focus:** Network engineering, cybersecurity (Fortinet stack), data science / ML.

**Certifications (live):** NSE 1–2, NSE 4 (FortiGate Operator), FCF, FCA — all on Credly with badge artwork.

**Tone:** Friendly, competent, slightly playful (Windows metaphor, terminal easter eggs). Not corporate-stiff; not meme-heavy.

**Audience:** Recruiters, hiring managers, peers in netsec/infra/data, curious developers who appreciate the UI craft.

---

## Planned / iterative roadmap

See **`docs/internal/ROADMAP.md`** (gitignored) for the full phased plan. Summary:

| Phase | Focus |
|-------|--------|
| **2 (next)** | Polish: Wi‑Fi/volume tray, dead-link audit, consistency — **before big apps** |
| **3** | Content folders (Podcasts, Tools, Downloads, Links) |
| **4** | Tier 1 apps: Mail contact, FortiGate viewer, themed Snake |
| **5** | Tier 2: Monaco VSCode, static notebook, Wireshark, NOC dashboard |
| **6** | One ML flagship (ONNX anomaly or dadi-gpt) |

**Vision:** Show artifacts of real work (netsec, ML, deployments) as interactive windows — not just describe them in copy.

---

## Key file map

```
pages/                    # Next.js routes (explorer/*, notepad/*, terminal)
components/
  DesktopWindows/         # Overlay windows on desktop
  windows/                # FileExplorer, Firefox, Terminal, Notepad, MediaPlayer
  explorer/               # ExplorerPage, embed shell, ExplorerLink, EmbedAppLink
  layouts/                # Layout, MobileLayout
  modules/                # Icons, Footer, taskbar, Start menu
context/ContextProvider.tsx
hooks/                    # useWindowManager, useMediaPlayer, useEmbedBridge
config/                   # All content + routes metadata
lib/                      # cloudinary, terminalCommands, seo, embed bridges
```

---

## Questions for collaborators

### For experienced designers

1. **First 10 seconds:** Does the desktop read immediately as “portfolio” or only as a Windows clone? What’s missing in the hero moment?
2. **Information hierarchy:** Is the path to “who is Dadi + why hire him” obvious within 30 seconds? (About, Certs, Projects order)
3. **Windows authenticity vs. portfolio clarity:** Where should we bend the metaphor for usability? (e.g. auto-open About Notepad on first visit?)
4. **Mobile:** Card grid vs. scaled desktop vs. hybrid — what fits the brand?
5. **Visual identity:** Custom wallpaper, icon set, accent color (#55FFFF taskbar hints), typography — cohesive system recommendations?
6. **Social sharing:** What should the OG card communicate visually? (face, certs, Windows chrome, tagline?)
7. **Empty folders:** Show “coming soon” vs. hide icons until content exists?
8. **Motion:** Window animations — delightful or slow? Recommendations for reduced-motion path?
9. **Credly badge grid:** More “trophy case” vs. minimal list?
10. **Accessibility:** Color contrast on dark explorer chrome, focus states on desktop icons?

### For senior engineers

1. **iframe + postMessage architecture:** Sustainable or refactor to a single content tree without iframes?
2. **State management:** Context is getting heavy — reducer, Zustand, or Jotai worth it?
3. **Next.js upgrade path:** Pages Router → App Router migration strategy?
4. **ISR vs. SSR** for Cloudinary/GitHub-backed pages — caching strategy?
5. **Embed security:** `postMessage` origin checks — sufficient?
6. **Performance:** LCP on wallpaper + font loading; bundle size with framer-motion + react-rnd
7. **Testing strategy:** What to E2E (Playwright) vs. unit test (terminal commands, window manager)?
8. **Firefox iframe:** Fallback UX when sites block embeds?
9. **Deep linking:** URL reflects focused window? (`?explorer=/pictures`) Worth it?
10. **Extensibility:** Plugin pattern for new “apps” (Spotify, Discord were in original fork)?

### For product / growth

1. Is the Windows gimmick a **net positive** for recruiters in netsec, or friction?
2. What **one CTA** should dominate? (Email, LinkedIn, Credly, GitHub?)
3. Should **blog** be more integrated (RSS in Explorer, latest posts widget)?
4. Analytics events worth tracking? (window opens, cert clicks, terminal commands)

---

## How to run locally

```bash
npm install --legacy-peer-deps
npm run dev
# http://localhost:3000
```

Optional `.env.local`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BLOG_URL=https://blog.dadishimwe.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Desktop experience: viewport **> 880px**. Below that → mobile layout.

---

## Summary one-liner

*A Next.js portfolio that behaves like a Windows 11 desktop — draggable apps, File Explorer folders, a working terminal, and Fortinet certifications on Credly — aimed at showing Dadi Ishimwe as a network engineer / data scientist with enough UI craft to stand out from template portfolios.*

---

## Related docs

- `docs/internal/ROADMAP.md` — phased backlog, polish gate, app tiers, sprint checklists (gitignored)
