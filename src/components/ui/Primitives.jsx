import { useEffect, useRef, useState } from 'react'
import { formatNumberIN, pct } from '../../lib/format'

/* Reveal-on-scroll wrapper */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/* Section heading with eyebrow + optional action */
export function SectionHeading({ eyebrow, title, sub, action }) {
  return (
    <div className="shead">
      <div className="shead__text">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

/* Count-up number, triggered on scroll into view */
export function Counter({ value, suffix = '', format = 'number', duration = 1600 }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setN(Math.round(value * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value, duration])

  const display = format === 'number' ? formatNumberIN(n) : n
  return <span ref={ref} className="stat__num">{display}<span className="unit">{suffix}</span></span>
}

/* Progress bar with raised/goal row */
export function ProgressBar({ raised, goal, variant = '' }) {
  const p = pct(raised, goal)
  return (
    <div>
      <div className="progress">
        <div className={`progress__fill ${variant}`} style={{ width: `${p}%` }} />
      </div>
      <div className="progress__row">
        <span><b>{p}% funded</b></span>
        <span>{goal ? `Goal reached by ${p}%` : ''}</span>
      </div>
    </div>
  )
}
