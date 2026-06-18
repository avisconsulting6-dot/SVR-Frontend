import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Donate from './pages/Donate'
import SetPassword from './pages/SetPassword'
import Store from './pages/Store'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Volunteer from './pages/Volunteer'
import VolunteerRegister from './pages/VolunteerRegister'
import Internship from './pages/Internship'
import InternshipRegister from './pages/InternshipRegister'
import Gallery from './pages/Gallery'
import VideoGallery from './pages/VideoGallery'
import Achievements from './pages/Achievements'
import CauseCategory from './pages/CauseCategory'
import CauseDetail from './pages/CauseDetail'
import { Blog, BlogDetail } from './pages/Blog'
import Events from './pages/Events'
import Stub from './pages/Stub'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ResourceManager from './pages/admin/ResourceManager'
import { RESOURCE_CONFIG } from './pages/admin/resourceConfig'
import InternshipModule from './pages/admin/InternshipModule'
import AdminVolunteers from './pages/admin/AdminVolunteers'
import AdminDonations from './pages/admin/AdminDonations'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'
import AdminWithdrawals from './pages/admin/AdminWithdrawals'
import AdminOrders from './pages/admin/AdminOrders'

export default function App() {
  return (
    <Routes>
      {/* ---------- Public site ---------- */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="donate" element={<Donate />} />
        <Route path="set-password" element={<SetPassword />} />

        <Route path="store" element={<Store />} />
        <Route path="store/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />

        <Route path="what-we-do" element={<Navigate to="/what-we-do/medical" replace />} />
        <Route path="what-we-do/:cat" element={<CauseCategory />} />
        <Route path="what-we-do/:cat/:id" element={<CauseDetail />} />

        <Route path="internship" element={<Internship />} />
        <Route path="internship/register" element={<InternshipRegister />} />
        <Route path="volunteer" element={<Volunteer />} />
        <Route path="volunteer/register" element={<VolunteerRegister />} />

        <Route path="gallery" element={<Gallery />} />
        <Route path="gallery/video" element={<VideoGallery />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="campaigns" element={<Events />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="contact" element={<Contact />} />

        <Route path="login" element={<Login />} />
        <Route path="dashboard/:role" element={<Dashboard />} />
        <Route path="*" element={<Stub title="Page not found" icon="search" lead="The page you're looking for doesn't exist." cta={{ to: '/', label: 'Go home' }} />} />
      </Route>

      {/* ---------- Admin ---------- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="causes" element={<ResourceManager resource="causes" title="Causes" icon="heart" config={RESOURCE_CONFIG.causes} />} />
        <Route path="products" element={<ResourceManager resource="products" title="Products" icon="cart" config={RESOURCE_CONFIG.products} />} />
        <Route path="blogs" element={<ResourceManager resource="blogs" title="Blog posts" icon="doc" config={RESOURCE_CONFIG.blogs} />} />
        <Route path="campaigns" element={<ResourceManager resource="campaigns" title="Campaigns" icon="bell" config={RESOURCE_CONFIG.events} />} />
        <Route path="gallery" element={<ResourceManager resource="gallery" title="Gallery" icon="grid" config={RESOURCE_CONFIG.gallery} />} />
        <Route path="donations" element={<AdminDonations />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="withdrawals" element={<AdminWithdrawals />} />
         <Route path="orders" element={<AdminOrders />} />

        <Route path="referrals" element={<AdminWithdrawals />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="volunteers" element={<AdminVolunteers />} />
        <Route path="internships" element={<InternshipModule />} />
        <Route path="interns" element={<Navigate to="/admin/internships" replace />} />
      </Route>
    </Routes>
  )
}