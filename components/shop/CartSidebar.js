'use client'
import Link from 'next/link'
import { useCart } from '@/lib/cartStore'
import { HiX, HiPlus, HiMinus, HiTrash, HiShoppingCart, HiArrowRight } from 'react-icons/hi'

export default function CartSidebar() {
  const { cart, isOpen, setIsOpen, removeItem, updateQty, totalItems, totalPrice } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-dark-card border-l border-dark-border shadow-card flex flex-col animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <div className="flex items-center gap-2">
            <HiShoppingCart size={20} className="text-primary" />
            <h2 className="font-display font-semibold text-white">Cart ({totalItems})</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg bg-dark-muted flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <HiX size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <HiShoppingCart size={48} className="text-gray-700 mb-4" />
              <p className="text-gray-500 text-sm">Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 text-primary text-sm hover:underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="flex gap-3 p-3 bg-dark border border-dark-border rounded-xl">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-dark-muted flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-primary text-sm font-bold">₦{(item.price * item.qty).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-dark-muted rounded-lg p-0.5">
                      <button
                        onClick={() => updateQty(item._id, item.qty - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <HiMinus size={12} />
                      </button>
                      <span className="w-6 text-center text-white text-xs">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <HiPlus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors ml-auto"
                    >
                      <HiTrash size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total</span>
              <span className="font-display font-bold text-white text-xl">₦{totalPrice.toLocaleString()}</span>
            </div>
            <Link
              href="/shop/cart"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-glow-sm"
            >
              Checkout <HiArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}