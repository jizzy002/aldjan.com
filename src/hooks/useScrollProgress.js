import { useEffect, useState } from 'react'

// 0 → 1 progress of scrolling through a tall container whose child is `position: sticky`.
// 0 = container top at viewport top, 1 = container bottom reached viewport bottom.
export default function useScrollProgress(ref, enabled = true) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setProgress(0)
      return
    }
    let frame = 0

    function update() {
      frame = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
      setProgress(p)
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, enabled])

  return progress
}
