'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Shop Products</h1>
            <p className="text-slate-400">Browse our amazing collection</p>
          </div>
          <Link
            href="/add-product"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        {error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <p className="text-slate-400 text-lg mb-4">No products available</p>
            <Link
              href="/add-product"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
            >
              <Plus className="w-5 h-5" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
