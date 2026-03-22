'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { Loader2, Trash2, ArrowLeft } from 'lucide-react';

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    price: number;
    image: string;
  } | null;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchCart();
  }, [isAuthenticated, authLoading, router]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load cart');
      }
      
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load cart';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to remove item');
      }
      
      setCartItems(cartItems.filter((item) => item.productId?._id !== productId));
      toast.success('Removed from cart');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
      toast.error(errorMessage);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Checkout failed');
      }
      
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Checkout failed';
      toast.error(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => {
      if (!item.productId) return sum;
      return sum + item.productId.price * item.quantity;
    },
    0
  );

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to shopping
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <p className="text-slate-400 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.filter(item => item.productId).map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex gap-4 p-4 hover:border-slate-600 transition"
                >
                  <div className="relative w-24 h-24 shrink-0">
                    <Image
                      src={item.productId!.image}
                      alt={item.productId!.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-semibold line-clamp-2">
                        {item.productId!.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-white font-bold text-lg">
                      ${(item.productId!.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemove(item.productId!._id)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 h-fit">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tax</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-lg font-bold text-blue-400">
                    ${(totalPrice * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
