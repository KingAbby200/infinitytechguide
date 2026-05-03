'use client'
import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) {
        return prev.map(i =>
          i._id === product._id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { ...product, qty }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id) => {
    setCart(prev => prev.filter(i => i._id !== id))
  }, [])

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) {
      removeItem(id)
      return
    }
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i))
  }, [removeItem])

  const clearCart = useCallback(() => setCart([]), [])

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      cart, addItem, removeItem, updateQty, clearCart,
      totalItems, totalPrice, isOpen, setIsOpen,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}