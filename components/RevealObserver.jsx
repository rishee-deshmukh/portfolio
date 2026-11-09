'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Adds `.in` to `.reveal` elements as they scroll into view. Content is fully
// visible without JS, and CSS only hides it when motion is allowed.
//
// It re-runs on every route change: after client-side navigation (for example
// opening a project and pressing Back) the page's elements are brand new, so a
// one-time observer would never reveal them.
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )
    els.forEach((el) => io.observe(el))

    // Safety net: never leave content hidden if the observer misses something
    // (restored scroll position, bfcache, very tall viewports).
    const fallback = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 1.5) el.classList.add('in')
      })
    }, 1200)

    const onShow = (e) => {
      if (e.persisted) document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'))
    }
    window.addEventListener('pageshow', onShow)

    return () => {
      io.disconnect()
      clearTimeout(fallback)
      window.removeEventListener('pageshow', onShow)
    }
  }, [pathname])

  return null
}
