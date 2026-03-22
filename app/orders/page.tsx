'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

interface OrderProduct {
  productId: {
    _id: string;
    title: string;
    price: number;
    image: string;
  } | null;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load orders';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900/30 text-green-400 border-green-700';
      case 'delivered':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      default:
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

        <h1 className="text-4xl font-bold text-white mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <p className="text-slate-400 text-lg mb-4">You haven't placed any orders yet</p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-slate-600 transition"
              >
                {/* Order Header */}
                <div className="bg-slate-750 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Order ID</p>
                    <p className="text-white font-mono text-sm">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Order Date</p>
                    <p className="text-white font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 space-y-4">
                  {order.items.filter(item => item.productId).map((item: OrderProduct, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative w-16 h-16 shrink-0">
                        <Image
                          src={item.productId!.image}
                          alt={item.productId!.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-white font-semibold line-clamp-1">
                          {item.productId!.title}
                        </h4>
                        <p className="text-slate-400 text-sm">Qty: {item.quantity}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-white font-semibold">
                          ${(item.productId!.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-slate-400 text-xs">
                          ${item.productId!.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="bg-slate-750 border-t border-slate-700 px-6 py-4 flex justify-end">
                  <div className="text-right">
                    <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-400">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
