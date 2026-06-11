import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { Icon } from '../components/ui/Icons'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [cat, setCat] = useState('All')
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getGallery()
      .then((g) => setImages(Array.isArray(g) ? g : []))   // never store a non-array
      .catch(() => setImages([]))
      .finally(() => setLoading(false))
  }, [])

  // guard every derived value so a bad payload can't crash the render
  const safe = Array.isArray(images) ? images : []
  const cats = ['All', ...new Set(safe.map((g) => g.album).filter(Boolean))]
  const list = useMemo(
    () => (cat === 'All' ? safe : safe.filter((g) => g.album === cat)),
    [safe, cat]
  )

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner" style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 'unset', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 720 }}>
              <div className="breadcrumb"><Link to="/">Home</Link> / <span>Photo Gallery</span></div>
              <h1>Moments from the field</h1>
              <p className="lead">Real photographs from our camps, classrooms and drives — managed from the admin panel.</p>
            </div>
            <Link to="/gallery/video" className="btn btn--ghost"><Icon.play width={18} height={18} /> Video gallery</Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading ? (
            <p className="muted">Loading…</p>
          ) : safe.length === 0 ? (
            <div className="stub"><div className="stub__icon"><Icon.image width={32} height={32} /></div><h3>No photos yet</h3><p className="muted">The team will add photos from the admin panel.</p></div>
          ) : (
            <>
              <div className="pill-row" style={{ marginBottom: 28 }}>
                {cats.map((c) => <button key={c} className={`filter-pill ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
              </div>
              <div className="masonry">
                {list.map((g, i) => (
                  <button key={g.id || i} className={`masonry__item masonry__item--${i % 3 === 0 ? 'tall' : 'short'}`} onClick={() => setActive(g)}>
                    <img src={imgUrl(g.url)} alt={g.title || g.album} loading="lazy" />
                    <span className="masonry__overlay">
                      <span className="badge badge--saffron">{g.album}</span>
                      {g.title && <span className="masonry__cap">{g.title}</span>}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <button className="lightbox__close" onClick={() => setActive(null)} aria-label="Close">×</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={imgUrl(active.url)} alt={active.title || active.album} />
            <figcaption><span className="badge badge--saffron">{active.album}</span> {active.title}</figcaption>
          </figure>
        </div>
      )}
    </>
  )
}