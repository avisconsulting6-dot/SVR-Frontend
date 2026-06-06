import { Link } from 'react-router-dom'
import { ORG, WHATWEDO, FOOTER_POLICIES, FOOTER_ABOUT } from '../../data/mock'
import { Icon } from '../ui/Icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand + about */}
          <div className="footer__brand">
            <Link to="/" className="brand" style={{ marginBottom: 16 }}>
              <span className="brand__logo brand__logo--footer"><img src="/logo.png" alt="SVR Educational Society logo" /></span>
              <span>
                <span className="brand__name">{ORG.name}</span>
                <span className="brand__sub">{ORG.tagline}</span>
              </span>
            </Link>
            <p style={{ fontSize: '.92rem', color: '#aeb4bf', maxWidth: '36ch' }}>{FOOTER_ABOUT}</p>
            <div className="footer__regbox" style={{ marginTop: 18 }}>
              <div><b>{ORG.name}</b></div>
              <div>{ORG.regNo}</div>
              <div>80G: <b>{ORG.reg80G}</b> · 12A: <b>{ORG.reg12A}</b></div>
              <div>PAN: <b>{ORG.pan}</b></div>
            </div>
          </div>

          {/* What we do */}
          <div>
            <h4>What We Do</h4>
            <ul>
              {WHATWEDO.map((c) => (
                <li key={c.key}><Link to={`/what-we-do/${c.key}`}>{c.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Quick links + policies */}
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/store">Shop</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/internship">Career</Link></li>
              <li><Link to="/donate">Donate</Link></li>
            </ul>
            <h4 style={{ marginTop: 22 }}>Policies</h4>
            <ul>
              {FOOTER_POLICIES.map((p) => <li key={p}><Link to="/about">{p}</Link></li>)}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact Us</h4>
            <ul>
              <li style={{ display: 'flex', gap: 8 }}><Icon.pin width={18} height={18} /> {ORG.address}</li>
              <li><a href={`mailto:${ORG.email}`}><Icon.mail width={16} height={16} /> {ORG.email}</a></li>
              <li><a href={`tel:${ORG.phone}`}><Icon.phone width={16} height={16} /> {ORG.phone}</a></li>
            </ul>
            <div style={{ marginTop: 16 }}>
              <div className="footer__badges">
                <a className="badge" href={ORG.social.youtube} target="_blank" rel="noreferrer">YouTube</a>
                <a className="badge" href={ORG.social.instagram} target="_blank" rel="noreferrer">Instagram</a>
                <a className="badge" href={ORG.social.facebook} target="_blank" rel="noreferrer">Facebook</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {ORG.name}. All rights reserved. Donations are 50% tax-exempt under Section 80G.</span>
          <span className="footer__badges">
            <span className="badge">80G</span><span className="badge">12A</span><span className="badge">Reg. Society</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
