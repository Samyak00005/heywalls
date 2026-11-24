import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('HeyWalls encountered a rendering error.', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="container-page grid min-h-screen place-content-center py-3xl" role="alert" aria-labelledby="app-error-title">
          <section className="max-w-[520px] rounded-md border border-line bg-surface p-xl text-center">
            <p className="mb-xs text-label uppercase tracking-[0.08em] text-ink-soft">Something went wrong</p>
            <h1 id="app-error-title" className="font-display text-h2">HeyWalls could not finish loading this page.</h1>
            <p className="mt-sm text-body-sm text-ink-soft">Your saved wallpapers stay in this browser. Reload the page to try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-lg rounded-md bg-accent px-lg py-sm text-body-sm font-medium text-accent-contrast"
            >
              Reload HeyWalls
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
