'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { addToCart } from '@/redux/slices/cartSlice';
import { productService } from '@/services';
import { formatCurrency, getProductImage } from '@/utils/helpers';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getById(params.id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    const result = await dispatch(addToCart({ productId: product._id, quantity }));

    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart');
      return;
    }

    toast.error(result.payload || 'Could not add to cart');
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <p className="container-page py-10 text-stone-500">Product not found.</p>;

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-6">
        <div>
          <p className="eyebrow">{product.category?.name || 'Collection'}</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">{product.name}</h1>
          <p className="mt-4 text-2xl text-stone-700">{formatCurrency(product.price)}</p>
        </div>

        <p className="text-sm leading-7 text-stone-600">{product.description}</p>

        <div className="flex items-center gap-4">
          <label className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-600" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="input-field max-w-24"
          />
          <span className="text-sm text-stone-500">{product.stock} available</span>
        </div>

        <button type="button" className="btn-primary" onClick={handleAddToCart} disabled={product.stock < 1}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
