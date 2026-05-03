'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cartStore'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import { HiShoppingCart, HiTrash, HiPlus, HiMinus, HiArrowRight, HiWhatsapp } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa6'
import Link from 'next/link'

export default function CartPage() {
  const { cart, removeItem, updateQty, clearCart, totalPrice } = useCart()

  const [form, setForm]     = useState({ name: '', address: '', phone: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.address.trim()) e.address = 'Delivery address is required'
    if (!form.phone.trim())   e.phone   = 'Phone number is required'
    return e
  }

  function handleCheckout() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    if (cart.length === 0) { alert('Your cart is empty.'); return }

    const url = buildWhatsAppURL(cart, form)
    window.open(url, '_blank')
  }

  if (cart.length === 0) {
    return (
      <div className="pt-24 pb-20 max-w-2xl mx-auto px-4 text-center">
        <HiShoppingCart size={64} className="text-gray-700 mx-auto mb-4" />
        <h1 className="font-display font-bold text-2xl text-white mb-3">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some gadgets to get started.</p>
        <Link href="/shop" className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2">
          Browse Gadgets <HiArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      <h1 className="font-display font-bold text-3xl text-white mb-10 flex items-center gap-3">
        <HiShoppingCart className="text-primary" /> Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-3 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="flex gap-4 p-4 bg-dark-card border border-dark-border rounded-xl">
              {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-dark-muted flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm mb-1">{item.name}</h3>
                <p className="text-primary font-bold">₦{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-dark border border-dark-border rounded-lg p-0.5">
                    <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded">
                      <HiMinus size={13} />
                    </button>
                    <span className="w-8 text-center text-white text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded">
                      <HiPlus size={13} />
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm">= ₦{(item.price * item.qty).toLocaleString()}</span>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-auto text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <HiTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <HiTrash size={14} /> Clear cart
          </button>
        </div>

        {/* Checkout */}
        <div className="lg:col-span-2">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sticky top-24">
            <h2 className="font-display font-semibold text-white text-lg mb-5">Order Summary</h2>

            {/* Items summary */}
            <div className="space-y-2 mb-5 pb-5 border-b border-dark-border">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm text-gray-400">
                  <span className="truncate mr-3">{item.name} × {item.qty}</span>
                  <span className="text-white flex-shrink-0">₦{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total</span>
              <span className="font-display font-bold text-primary text-2xl">₦{totalPrice.toLocaleString()}</span>
            </div>

            {/* Customer info */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-gray-300">Your Details</h3>

              {[
                { key: 'name',    label: 'Full Name',          placeholder: 'John Doe', type: 'text' },
                { key: 'phone',   label: 'Phone Number',       placeholder: '+234 800 000 0000', type: 'tel' },
                { key: 'address', label: 'Delivery Address',   placeholder: '123 Main St, Lagos', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => { setForm(v => ({ ...v, [f.key]: e.target.value })); setErrors(v => ({ ...v, [f.key]: '' })) }}
                    placeholder={f.placeholder}
                    className={`w-full px-3 py-2.5 rounded-lg bg-dark border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50 ${
                      errors[f.key] ? 'border-red-500/50' : 'border-dark-border'
                    }`}
                  />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-[#25D366] text-black hover:bg-[#20b957] transition-all shadow-lg"
            >
              <FaWhatsapp size={20} /> Order via WhatsApp
            </button>
            <p className="text-xs text-gray-600 text-center mt-3">
              You will be redirected to WhatsApp to confirm your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}