'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, LogOut, Home } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-white font-bold text-xl">ShopHub</span>
        </Link>

        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <Home size={20} />
                <span className="hidden sm:inline">Shop</span>
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Cart</span>
              </Link>
              <Link
                href="/orders"
                className="text-slate-300 hover:text-white transition"
              >
                Orders
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
                <div className="text-right">
                  <p className="text-sm text-slate-300">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut size={20} className="text-slate-300" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
