import { ArrowRight, Compass, Heart, MonitorSmartphone, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const reasons = [
  {
    icon: Compass,
    title: 'Find your kind of image',
    description: 'Search by subject, browse topics, or narrow the collection to the shape of your screen.',
  },
  {
    icon: Heart,
    title: 'Keep the ones you love',
    description: 'Save a wallpaper in this browser and come back to it whenever you like.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Made for your screen',
    description: 'Discover desktop, mobile, and tablet artwork without losing the original composition.',
  },
]

export default function About() {
  return (
    <div>
      <section className="container-page grid items-center gap-2xl py-3xl md:py-5xl lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)] lg:gap-4xl">
        <div>
          <p className="mb-md inline-flex items-center gap-xs text-label uppercase tracking-[0.12em] text-ink-soft">
            <Sparkles size={15} strokeWidth={1.8} aria-hidden="true" /> A little about us
          </p>
          <h1 className="mb-lg max-w-[680px] font-display text-display italic">A screen should feel like yours.</h1>
          <p className="mb-xl max-w-[560px] text-body text-ink-soft">
            HeyWalls is a small wallpaper discovery project built around one simple idea: finding the right image should feel easy, and keeping it should be even easier.
          </p>
          <div className="flex flex-wrap gap-sm">
            <Link to="/explore" className="inline-flex items-center gap-xs rounded-md bg-accent px-lg py-sm text-body-sm font-medium text-accent-contrast">
              Explore wallpapers <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <Link to="/categories" className="rounded-md border border-line bg-surface px-lg py-sm text-body-sm text-ink hover:border-ink-soft">
              Browse categories
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-sm md:gap-md" aria-label="HeyWalls discovery, saving, and browsing features">
          <div className="flex aspect-[4/5] flex-col justify-between rounded-md bg-accent p-lg text-accent-contrast shadow-hung md:p-xl">
            <span className="text-label uppercase tracking-[0.12em]">HeyWalls</span>
            <div>
              <p className="font-display text-display italic">Find a feeling.</p>
              <p className="mt-sm text-body-sm text-accent-contrast/80">A fresh image for every kind of day.</p>
            </div>
          </div>
          <div className="grid gap-sm md:gap-md">
            <div className="flex aspect-[4/3] flex-col justify-between rounded-md border border-line bg-surface p-lg md:p-xl">
              <Compass size={22} strokeWidth={1.6} className="text-accent" aria-hidden="true" />
              <div>
                <p className="font-display text-h3">Explore widely</p>
                <p className="mt-xs text-body-sm text-ink-soft">Nature, art, cities, quiet details, and more.</p>
              </div>
            </div>
            <div className="flex aspect-[4/3] flex-col justify-between rounded-md border border-line bg-bg p-lg md:p-xl">
              <Heart size={22} strokeWidth={1.6} className="text-accent" aria-hidden="true" />
              <div>
                <p className="font-display text-h3">Keep it close</p>
                <p className="mt-xs text-body-sm text-ink-soft">Your saved collection stays in this browser.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page border-t border-line py-3xl md:py-4xl" aria-labelledby="about-reasons-heading">
        <p className="mb-xs text-label uppercase tracking-[0.08em] text-ink-soft">The idea behind HeyWalls</p>
        <h2 id="about-reasons-heading" className="mb-xl max-w-[620px] font-display text-h2">Less hunting. More finding the one that feels right.</h2>
        <div className="grid gap-md md:grid-cols-3">
          {reasons.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-md border border-line bg-surface p-lg md:p-xl">
              <Icon size={21} strokeWidth={1.7} className="mb-lg text-accent" aria-hidden="true" />
              <h3 className="mb-xs font-display text-h3">{title}</h3>
              <p className="text-body-sm text-ink-soft">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-3xl md:pb-4xl" aria-labelledby="about-maker-heading">
        <div className="grid gap-md rounded-md border border-line bg-surface p-lg md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-2xl md:p-2xl">
          <div>
            <p className="mb-xs text-label uppercase tracking-[0.08em] text-ink-soft">A note from the maker</p>
            <h2 id="about-maker-heading" className="font-display text-h2 italic">Made by Samyak Nimsarkar</h2>
          </div>
          <p className="text-body text-ink-soft">
            HeyWalls began as my own little collection of wallpapers. I built it into a simple place to find images that feel right, save the ones I love, and share that discovery with you.
          </p>
        </div>
      </section>

      <section className="container-page pb-3xl md:pb-4xl">
        <div className="grid gap-lg rounded-md bg-surface p-lg md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-xl">
          <div>
            <p className="mb-xs text-label uppercase tracking-[0.08em] text-ink-soft">Image source</p>
            <h2 className="mb-xs font-display text-h3">Wallhaven, with the original source close by.</h2>
            <p className="max-w-[760px] text-body-sm text-ink-soft">
              HeyWalls browses Wallhaven’s SFW API. Images remain hosted by Wallhaven and belong to their creators; each wallpaper links to its original page. Saved wallpapers are stored locally in this browser and are not synced to an account.
            </p>
          </div>
          <a href="https://wallhaven.cc" target="_blank" rel="noreferrer" className="inline-flex items-center gap-xs text-body-sm text-ink underline underline-offset-4">
            Visit Wallhaven <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  )
}
