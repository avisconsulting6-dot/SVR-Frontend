import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, imgUrl } from '../lib/api'
import { Icon } from '../components/ui/Icons'
import { Reveal } from '../components/ui/Primitives'
import { formatDate } from '../lib/format'

export function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.getBlogs().then((b) => { setBlogs(b || []); setLoading(false) }).catch(() => setLoading(false)) }, [])

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <div className="breadcrumb"><Link to="/">Home</Link> / <span>Blog</span></div>
            <h1>Stories &amp; updates</h1>
            <p className="lead">Field notes, programme updates and stories from the communities we work with.</p>
          </div>
        </div>
      </header>
      <section className="section">
        <div className="container">
          {loading ? <p className="muted">Loading…</p> : blogs.length === 0 ? (
            <div className="stub"><div className="stub__icon"><Icon.doc width={32} height={32} /></div><h3>No posts yet</h3><p className="muted">Check back soon.</p></div>
          ) : (
            <div className="grid grid-3">
              {blogs.map((b, i) => (
                <Reveal key={b._id} delay={(i % 3) * 80}>
                  <article className="card card--hover story-card">
                    {b.image && (
                      <Link to={`/blog/${b._id}`} className="story-card__media"><img src={imgUrl(b.image)} alt={b.title} loading="lazy" /></Link>
                    )}
                    <div className="story-card__body">
                      <span className="muted" style={{ fontSize: '.82rem' }}>{formatDate(b.createdAt)} · {b.author}</span>
                      <h3 style={{ fontSize: '1.2rem' }}><Link to={`/blog/${b._id}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>{b.title}</Link></h3>
                      {b.excerpt && <p style={{ fontSize: '.92rem', color: 'var(--muted)', fontStyle: 'normal' }}>{b.excerpt}</p>}
                      <Link to={`/blog/${b._id}`} className="mega__viewall">Read more <Icon.arrowRight width={14} height={14} /></Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export function BlogDetail() {
  const { slug: id } = useParams()   // route param is the post id
  const [blog, setBlog] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    setErr(false); setBlog(null)
    api.getBlog(id).then((p) => p ? setBlog(p) : setErr(true)).catch(() => setErr(true))
  }, [id])

  if (err) return <div className="section container"><h2>Post not found</h2><Link to="/blog" className="btn btn--primary" style={{ marginTop: 16 }}>Back to blog</Link></div>
  if (!blog) return <div className="section container"><p className="muted">Loading…</p></div>

  return (
    <article className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="breadcrumb" style={{ marginBottom: 14 }}><Link to="/">Home</Link> / <Link to="/blog">Blog</Link> / <span>{blog.title}</span></div>
        <h1 style={{ fontSize: 'clamp(1.9rem,3.4vw,2.8rem)', marginBottom: 12 }}>{blog.title}</h1>
        <p className="muted" style={{ marginBottom: 22 }}>{formatDate(blog.createdAt)} · {blog.author}</p>
        {blog.image && <img src={imgUrl(blog.image)} alt={blog.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 28 }} />}
        {(blog.content || '').split('\n').filter(Boolean).map((para, i) => (
          <p key={i} style={{ marginBottom: 16, fontSize: '1.08rem', maxWidth: 'unset' }}>{para}</p>
        ))}
        <div style={{ marginTop: 32 }}><Link to="/donate" className="btn btn--primary"><Icon.heart width={17} height={17} /> Support our work</Link></div>
      </div>
    </article>
  )
}