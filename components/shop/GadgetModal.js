'use client'
import { useState, useEffect } from 'react'
import { HiX, HiShoppingCart, HiPlus, HiMinus, HiCheckCircle } from 'react-icons/hi'
import { useCart } from '@/lib/cartStore'

export default function GadgetModal({ product, onClose }) {
  const { addItem } = useCart()
  const [qty, setQty]       = useState(1)
  const [added, setAdded]   = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const images = product.images?.length ? product.images : [null]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h2 className="font-display font-semibold text-white text-lg line-clamp-1">{product.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-dark-muted flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <HiX size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col sm:flex-row gap-6">
          {/* Images */}
          <div className="sm:w-64 flex-shrink-0">
            <div className="aspect-square rounded-xl overflow-hidden bg-dark-muted mb-3">
              {images[imgIdx] ? (
                <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">📱</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      i === imgIdx ? 'border-primary' : 'border-dark-border'
                    }`}
                  >
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-dark-muted" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col">
            {product.brand && (
              <p className="text-gray-500 text-sm mb-1">{product.brand}</p>
            )}
            {product.category && (
              <span className="tag text-[11px] w-fit mb-3">{product.category}</span>
            )}

            <p className="text-primary font-bold font-display text-3xl mb-4">
              ₦{product.price.toLocaleString()}
            </p>

            {product.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-5">
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Specifications</h4>
                <div className="space-y-1.5">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-sm">
                      <span className="text-gray-500 w-28 flex-shrink-0 capitalize">{k}</span>
                      <span className="text-gray-300">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto space-y-4">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">Quantity:</span>
                <div className="flex items-center gap-2 bg-dark border border-dark-border rounded-lg p-1">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <HiMinus size={14} />
                  </button>
                  <span className="w-8 text-center text-white font-medium text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <HiPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Stock status */}
              <p className={`text-sm ${product.inStock ? 'text-primary' : 'text-red-400'}`}>
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </p>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'btn-primary shadow-glow-sm'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <><HiCheckCircle size={18} /> Added to Cart!</>
                ) : (
                  <><HiShoppingCart size={18} /> Add to Cart</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}