'use server'

export type LinkPreview = {
  url: string
  title: string | null
  description: string | null
  image: string | null
  siteName: string | null
  favicon: string | null
}

function getMetaContent(html: string, attrName: string, attrValue: string): string | null {
  const re = new RegExp(
    `<meta\\b[^>]*?${attrName}=["']${attrValue}["'][^>]*?content=["']([^"'>]+)["']` +
    `|<meta\\b[^>]*?content=["']([^"'>]+)["'][^>]*?${attrName}=["']${attrValue}["']`,
    'i'
  )
  const m = html.match(re)
  return m ? (m[1] ?? m[2] ?? null) : null
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return m ? m[1].trim() : null
}

export async function fetchLinkPreview(url: string): Promise<LinkPreview> {
  const base: LinkPreview = { url, title: null, description: null, image: null, siteName: null, favicon: null }

  try {
    const u = new URL(url)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })
    clearTimeout(timeout)

    if (!res.ok) return base
    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) return base

    // Read at most 60 KB — enough to capture all <head> meta tags
    const reader = res.body?.getReader()
    if (!reader) return base
    const decoder = new TextDecoder()
    let html = ''
    let bytes = 0
    while (bytes < 60000) {
      const { done, value } = await reader.read()
      if (done) break
      html += decoder.decode(value, { stream: true })
      bytes += value.length
    }
    reader.cancel()

    const rawImage =
      getMetaContent(html, 'property', 'og:image') ??
      getMetaContent(html, 'property', 'og:image:secure_url') ??
      getMetaContent(html, 'name', 'twitter:image')

    const image = rawImage
      ? rawImage.startsWith('http') ? rawImage : `${u.origin}${rawImage}`
      : null

    return {
      url,
      title:
        getMetaContent(html, 'property', 'og:title') ??
        getMetaContent(html, 'name', 'twitter:title') ??
        extractTitle(html),
      description:
        getMetaContent(html, 'property', 'og:description') ??
        getMetaContent(html, 'name', 'description'),
      image,
      siteName: getMetaContent(html, 'property', 'og:site_name'),
      favicon: `${u.origin}/favicon.ico`,
    }
  } catch {
    return base
  }
}
