'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AddProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        title,
        description,
        price: parseFloat(price),
        image,
        category,
      };

      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create product');
      }

      const newProduct = await response.json();
      toast.success('Product created successfully!');
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
          <h1 className="text-3xl font-bold text-center mb-2 text-white">ShopHub</h1>
          <p className="text-center text-slate-400 mb-8">Add New Product</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Product title"
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-200 mb-2">
                  Price ($) *
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29.99"
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-200 mb-2">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Electronics, Clothing, etc."
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-slate-200 mb-2">
                Image URL
              </label>
              <input
                id="image"
                type="url"
                value={image}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {imagePreview && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Image Preview
                </label>
                <div className="relative w-full h-48 bg-slate-700 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('')}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-200 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                required
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Product...' : 'Create Product'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400">
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold">
              ← Back to Products
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
