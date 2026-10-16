import { useCallback, useEffect, useRef, useState } from 'react'

const DRAG_THRESHOLD = 6 // px before a press becomes a drag (below that it's a tap)
const PX_PER_TURN = 1.1 // one full turn per ~1.1 widths of the helmet box
const DIRECTION = -1 // 1 or -1: which way a rightward drag turns the helmet
const FRICTION = 4.5 // momentum decay per second
const MIN_SPEED = 0.05 // turns/s where momentum stops
const WIGGLE = 1 / 16 // hint swing on load (turns); peaks at ~3/4 of this
const FRONT_MAGNET = 2.5 // frames: releasing this close to the front snaps to it

// Drag / swipe / arrow-key rotation for the helmet. `turns` is unbounded (1 = 360°).
export default function useHelmetDrag({ frames, reducedMotion, onDragStart }) {
  const [turns, setTurnsState] = useState(0)
  const [dragging, setDragging] = useState(false)
  const turnsRef = useRef(0)
  const anim = useRef(0)
  const drag = useRef(null)
  const suppressClick = useRef(false)
  const interacted = useRef(false)
  const onDragStartRef = useRef(onDragStart)
  onDragStartRef.current = onDragStart

  const setTurns = useCallback(v => {
    turnsRef.current = v
    setTurnsState(v)
  }, [])

  const stop = useCallback(() => {
    cancelAnimationFrame(anim.current)
    anim.current = 0
  }, [])

  useEffect(() => stop, [stop])

  const animateTo = useCallback((target, duration) => {
    stop()
    if (duration <= 0) return setTurns(target)
    const from = turnsRef.current
    const start = performance.now()
    const tick = now => {
      const t = Math.min(1, (now - start) / duration)
      setTurns(from + (target - from) * (1 - Math.pow(1 - t, 3)))
      anim.current = t < 1 ? requestAnimationFrame(tick) : 0
    }
    anim.current = requestAnimationFrame(tick)
  }, [stop, setTurns])

  // settle exactly on a frame so the helmet never rests between two photos;
  // close to the front it snaps all the way to the front (where the dots live)
  const snap = useCallback(() => {
    const t = turnsRef.current
    const front = Math.round(t)
    const target = Math.abs(t - front) * frames <= FRONT_MAGNET ? front : Math.round(t * frames) / frames
    animateTo(target, reducedMotion ? 0 : 220)
  }, [animateTo, frames, reducedMotion])

  const coast = useCallback(v0 => {
    stop()
    let v = v0
    let last = performance.now()
    const tick = now => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      v *= Math.exp(-FRICTION * dt)
      setTurns(turnsRef.current + v * dt)
      if (Math.abs(v) > MIN_SPEED) {
        anim.current = requestAnimationFrame(tick)
      } else {
        anim.current = 0
        snap()
      }
    }
    anim.current = requestAnimationFrame(tick)
  }, [stop, setTurns, snap])

  const step = useCallback(dir => {
    const cur = Math.round(turnsRef.current * frames)
    animateTo((cur + dir) / frames, reducedMotion ? 0 : 160)
  }, [animateTo, frames, reducedMotion])

  // one-off swing to show the helmet can be turned
  const wiggle = useCallback(() => {
    if (reducedMotion || interacted.current) return
    stop()
    const from = turnsRef.current
    const start = performance.now()
    const D = 1600
    const tick = now => {
      if (interacted.current) return (anim.current = 0)
      const t = Math.min(1, (now - start) / D)
      setTurns(from + WIGGLE * Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI))
      if (t < 1) anim.current = requestAnimationFrame(tick)
      else {
        anim.current = 0
        setTurns(from)
      }
    }
    anim.current = requestAnimationFrame(tick)
  }, [reducedMotion, stop, setTurns])

  function onPointerDown(e) {
    if (e.button !== 0) return
    stop()
    drag.current = {
      id: e.pointerId,
      el: e.currentTarget,
      startX: e.clientX,
      lastX: e.clientX,
      lastT: e.timeStamp,
      base: turnsRef.current,
      width: e.currentTarget.getBoundingClientRect().width,
      vel: 0,
      moved: false,
    }
    suppressClick.current = false
    if (e.pointerType === 'mouse') e.preventDefault() // no text selection / image ghost drag
  }

  function onPointerMove(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.startX
    if (!d.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return
      d.moved = true
      interacted.current = true
      setDragging(true)
      onDragStartRef.current?.()
      try { d.el.setPointerCapture(e.pointerId) } catch { /* pointer already gone */ }
    }
    const perTurn = d.width * PX_PER_TURN
    setTurns(d.base + (DIRECTION * dx) / perTurn)
    const dt = Math.max(1, e.timeStamp - d.lastT) / 1000
    d.vel = d.vel * 0.6 + ((DIRECTION * (e.clientX - d.lastX)) / perTurn / dt) * 0.4
    d.lastX = e.clientX
    d.lastT = e.timeStamp
  }

  function onPointerEnd(e) {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (!d.moved) return
    suppressClick.current = true
    setDragging(false)
    const heldStill = e.timeStamp - d.lastT > 80
    if (!reducedMotion && !heldStill && Math.abs(d.vel) > 0.15) coast(d.vel)
    else snap()
  }

  // a drag must not also count as a click (dots, popups, the tap easter egg)
  function onClickCapture(e) {
    if (!suppressClick.current) return
    suppressClick.current = false
    e.stopPropagation()
    e.preventDefault()
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      interacted.current = true
      step(e.key === 'ArrowRight' ? DIRECTION : -DIRECTION)
    } else if (e.key === 'Home') {
      e.preventDefault()
      interacted.current = true
      animateTo(Math.round(turnsRef.current), reducedMotion ? 0 : 400)
    }
  }

  return {
    turns,
    dragging,
    wiggle,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onClickCapture,
      onKeyDown,
    },
  }
}
