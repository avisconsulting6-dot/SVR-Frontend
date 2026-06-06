import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icons'

/**
 * Reusable scaffold for pages that share an established pattern.
 * Keeps every nav link working and documents what each page contains.
 */
export default function Stub({ title, lead, icon = 'grid', features = [], cta }) {
  const I = Icon[icon] || Icon.grid
  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>{title}</span></div>
            <h1>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
          </div>
        </div>
      </header>
      <section className="section">
        <div className="container">
          <div className="stub">
            <div className="stub__icon"><I width={34} height={34} /></div>
            <h3>This page is scaffolded and ready to build out</h3>
            <p className="muted" style={{ maxWidth: '52ch' }}>
              It reuses the shared layout, design tokens and components already in the project.
              Planned sections:
            </p>
            {features.length > 0 && (
              <ul>
                {features.map((f) => <li key={f}><Icon.check width={18} height={18} /> {f}</li>)}
              </ul>
            )}
            {cta && <Link to={cta.to} className="btn btn--primary" style={{ marginTop: 8 }}>{cta.label} <Icon.arrowRight width={16} height={16} /></Link>}
          </div>
        </div>
      </section>
    </>
  )
}
