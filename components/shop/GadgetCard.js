'use client'
import { useState } from 'react'
import { HiShoppingCart, HiStar } from 'react-icons/hi'
import GadgetModal from './GadgetModal'

export default function GadgetCard({ product }) {
  const [modalOpen, setModalOpen] = useState(false)
  const image = product.images?.[0]

  return (
    <>
      <div
        className="group bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-dark-muted">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">📱</div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-dark/70 flex items-center justify-center">
              <span className="text-gray-400 font-medium text-sm">Out of Stock</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-3 left-3 flex items-center gap-1 tag text-[11px]">
              <HiStar size={10} /> Featured
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.brand && (
            <p className="text-gray-500 text-xs mb-1">{product.brand}</p>
          )}
          <h3 className="font-medium text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold font-display text-lg">
              ₦{product.price.toLocaleString()}
            </span>
            <button
              className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all"
              aria-label="Add to cart"
            >
              <HiShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <GadgetModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}