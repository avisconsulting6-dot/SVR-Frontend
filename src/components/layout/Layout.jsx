import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return (
    <>
      <Header />
      <main className="page-enter" key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
