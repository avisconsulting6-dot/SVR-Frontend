import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { VIDEOS } from '../data/mock'
import { Icon } from '../components/ui/Icons'

const CATS = ['All', 'Documentary', 'Field', 'Stories', 'Events']

export default function VideoGallery() {
  const [cat, setCat] = useState('All')
  const [playing, setPlaying] = useState(null)
  const list = useMemo(() => cat === 'All' ? VIDEOS : VIDEOS.filter((v) => v.cat === cat), [cat])

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner" style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 'unset', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 720 }}>
              <div className="breadcrumb"><Link to="/">Home</Link> / <span>Video Gallery</span></div>
              <h1>Watch our work</h1>
              <p className="lead">Documentaries, field films and beneficiary stories. Hosted on YouTube — integrate Vimeo the same way.</p>
            </div>
            <Link to="/gallery" className="btn btn--ghost"><Icon.image width={18} height={18} /> Photo gallery</Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="pill-row" style={{ marginBottom: 28 }}>
            {CATS.map((c) => <button key={c} className={`filter-pill ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
          </div>

          <div className="grid grid-3">
            {list.map((v) => (
              <button key={v.id} className="card card--hover vcard" onClick={() => setPlaying(v)}>
                <div className="vcard__media">
                  <img src={v.thumb} alt={v.title} loading="lazy" />
                  <span className="vcard__play"><Icon.play width={30} height={30} /></span>
                  <span className="vcard__dur">{v.dur}</span>
                </div>
                <div className="vcard__body">
                  <span className="badge badge--blue">{v.cat}</span>
                  <h4 style={{ fontSize: '1.05rem', marginTop: 8 }}>{v.title}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {playing && (
        <div className="lightbox" onClick={() => setPlaying(null)}>
          <button className="lightbox__close" onClick={() => setPlaying(null)} aria-label="Close">×</button>
          <div className="lightbox__video" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${playing.id}?autoplay=1`}
              title={playing.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            <p style={{ color: '#fff', marginTop: 12, textAlign: 'center' }}>{playing.title}</p>
          </div>
        </div>
      )}
    </>
  )
}
