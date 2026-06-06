import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from '../lib/api'

const AuthContext = createContext(null)

function storedUser() {
  try { return JSON.parse(localStorage.getItem('svr_user')) || null } catch { return null }
}

export function AuthProvider({ children }) {
  // hydrate synchronously from localStorage so navigation right after
  // login (or a page reload) renders the dashboard without a flash
  const [user, setUser] = useState(storedUser)
  const [loading, setLoading] = useState(!!getToken())

  useEffect(() => {
    if (!getToken()) { setLoading(false); return }
    // verify the stored session against the backend in the background
    api.me()
      .then((u) => { setUser(u); localStorage.setItem('svr_user', JSON.stringify(u)) })
      .catch(() => { setToken(null); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await api.login(email, password)     // stores svr_token
    localStorage.setItem('svr_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await api.logout()                                 // clears svr_token + svr_user
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}