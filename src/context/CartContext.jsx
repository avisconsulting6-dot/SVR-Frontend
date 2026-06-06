import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('svr_cart') || '[]') } catch { return [] }
  })
  useEffect(() => { localStorage.setItem('svr_cart', JSON.stringify(items)) }, [items])

  const add = (product, qty = 1) => setItems((cur) => {
    const i = cur.findIndex((x) => x.id === product.id)
    if (i >= 0) { const copy = [...cur]; copy[i] = { ...copy[i], qty: copy[i].qty + qty }; return copy }
    return [...cur, { id: product.id, name: product.name, price: product.price, image: product.image, qty }]
  })
  const setQty = (id, qty) => setItems((cur) => cur.map((x) => x.id === id ? { ...x, qty: Math.max(1, qty) } : x))
  const remove = (id) => setItems((cur) => cur.filter((x) => x.id !== id))
  const clear = () => setItems([])

  const count = items.reduce((s, x) => s + x.qty, 0)
  const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0)

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const c = useContext(CartContext)
  if (!c) throw new Error('useCart must be used within CartProvider')
  return c
}
