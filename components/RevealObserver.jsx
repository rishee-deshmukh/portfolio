'use client'
import { useEffect } from 'react'

// Adds `.in` to `.reveal` elements as they scroll into view. Content is fully
// visible without JS, and CSS only hides it when motion is allowed.
export default function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
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
    return () => io.disconnect()
  }, [])
  return null
}
