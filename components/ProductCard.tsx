'use client';

import { useState } from 'react';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add to cart');
      }

      toast.success('Added to cart!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition shadow-lg hover:shadow-xl hover:shadow-blue-500/10">
      <div className="relative h-48 w-full bg-slate-700">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300/475569/64748b?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-slate-500 text-4xl mb-2">📦</div>
              <p className="text-slate-400 text-sm">No Image</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm line-clamp-2 hover:text-blue-400">
              {product.title}
            </h3>
            <p className="text-slate-400 text-xs mt-1">{product.category}</p>
            <p className="text-slate-500 text-xs mt-2 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
