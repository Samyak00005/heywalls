const WALLHAVEN_API = 'https://wallhaven.cc/api/v1'

const SORTS = new Set(['date_added', 'relevance', 'views', 'favorites', 'toplist', 'hot', 'random'])
const API_CATEGORIES = { general: '100', anime: '010', people: '001' }

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Only GET requests are supported.' })
  }

  const id = String(request.query.id || '').trim()
  const upstreamUrl = id
    ? new URL(`${WALLHAVEN_API}/w/${encodeURIComponent(id)}`)
    : new URL(`${WALLHAVEN_API}/search`)

  if (!id) {
    const query = String(request.query.q || '').trim().slice(0, 100)
    const page = Number.parseInt(request.query.page, 10)
    const sorting = String(request.query.sorting || 'date_added')

    upstreamUrl.searchParams.set('purity', '100')
    const apiCategory = String(request.query.apiCategory || '').trim().toLowerCase()
    const categoriesMask = Object.hasOwn(API_CATEGORIES, apiCategory) ? API_CATEGORIES[apiCategory] : '111'
    upstreamUrl.searchParams.set('categories', categoriesMask)
    upstreamUrl.searchParams.set('page', String(Number.isFinite(page) ? Math.max(1, Math.min(page, 100)) : 1))
    upstreamUrl.searchParams.set('sorting', SORTS.has(sorting) ? sorting : 'date_added')

    if (request.query.order === 'asc') upstreamUrl.searchParams.set('order', 'asc')
    if (sorting === 'toplist') upstreamUrl.searchParams.set('topRange', '1M')
    const seed = String(request.query.seed || '').trim()
    if (/^[a-zA-Z0-9]{6}$/.test(seed)) upstreamUrl.searchParams.set('seed', seed)
    if (query) upstreamUrl.searchParams.set('q', query)
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    })

    if (!upstream.ok) {
      response.setHeader('Cache-Control', 'no-store')
      const retryAfter = upstream.headers.get('Retry-After')
      if (retryAfter) response.setHeader('Retry-After', retryAfter)
      const status = upstream.status
      const error = status === 404 && id
        ? 'Wallpaper not found.'
        : status === 429
          ? 'Wallhaven rate limit reached (45 requests per minute). Wait about a minute, then try again.'
          : status === 401 || status === 403
            ? `Wallhaven rejected this request (HTTP ${status}).`
            : status >= 500
              ? `Wallhaven returned a temporary server error (HTTP ${status}). Try again shortly.`
              : `Wallhaven rejected this request (HTTP ${status}).`
      return response.status(status === 404 || status === 429 ? status : 502).json({
        error,
        upstreamStatus: status,
        retryAfter,
      })
    }

    const data = await upstream.json()
    if (id && data.data?.purity !== 'sfw') {
      response.setHeader('Cache-Control', 'no-store')
      return response.status(404).json({ error: 'Wallpaper not found in the SFW collection.' })
    }

    const cacheControl = id
      ? 'public, s-maxage=21600, stale-while-revalidate=86400'
      : request.query.sorting === 'random'
        ? 'no-store'
        : 'public, s-maxage=180, stale-while-revalidate=600'
    response.setHeader('Cache-Control', cacheControl)
    return response.status(200).json(data)
  } catch (error) {
    response.setHeader('Cache-Control', 'no-store')
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError'
    return response.status(timedOut ? 504 : 502).json({
      error: timedOut
        ? 'Wallhaven did not respond within 10 seconds. Please try again shortly.'
        : 'Could not reach Wallhaven or read its response. Please try again shortly.',
    })
  }
}
