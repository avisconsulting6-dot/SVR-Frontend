import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icons'

/**
 * BannerCarousel — full-width auto-scrolling image banner for the homepage.
 * - auto-advances (pauses on hover / when tab hidden)
 * - prev/next arrows, clickable dots
 * - swipe on touch devices
 * - text + CTA overlay per slide
 * Respects prefers-reduced-motion (no auto-advance).
 */
export default function BannerCarousel({ slides, interval = 5500 }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const touch = useRef({ x: 0, dx: 0 })
  const n = slides.length

  const go = useCallback((next) => setI((cur) => (next + n) % n), [n])

  useEffect(() => {
    if (paused || n <= 1) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = setInterval(() => setI((c) => (c + 1) % n), interval)
    return () => clearInterval(id)
  }, [paused, n, interval])

  // pause when tab not visible
  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  function onTouchStart(e) { touch.current = { x: e.touches[0].clientX, dx: 0 } }
  function onTouchMove(e) { touch.current.dx = e.touches[0].clientX - touch.current.x }
  function onTouchEnd() {
    if (touch.current.dx > 50) go(i - 1)
    else if (touch.current.dx < -50) go(i + 1)
  }

  return (
    <section
      className="banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="banner__track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, idx) => (
          <div className="banner__slide" key={idx} aria-hidden={idx !== i}>
            <img src={s.image} alt={s.title} loading={idx === 0 ? 'eager' : 'lazy'} />
            <div className="banner__scrim" />
            <div className="container banner__content">
              {s.eyebrow && <span className="banner__eyebrow">{s.eyebrow}</span>}
              <h2 className="banner__title">{s.title}</h2>
              {s.text && <p className="banner__text">{s.text}</p>}
              {s.cta && (
                <div className="banner__cta">
                  <Link to={s.cta.to} className="btn btn--primary btn--lg">{s.cta.label}</Link>
                  {s.cta2 && <Link to={s.cta2.to} className="btn btn--lg banner__btn-ghost">{s.cta2.label}</Link>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button className="banner__arrow banner__arrow--prev" aria-label="Previous slide" onClick={() => go(i - 1)}>
            <Icon.chevron width={24} height={24} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <button className="banner__arrow banner__arrow--next" aria-label="Next slide" onClick={() => go(i + 1)}>
            <Icon.chevron width={24} height={24} style={{ transform: 'rotate(-90deg)' }} />
          </button>
          <div className="banner__dots" role="tablist">
            {slides.map((_, idx) => (
              <button key={idx} className={`banner__dot ${idx === i ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`} aria-selected={idx === i}
                onClick={() => setI(idx)} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
