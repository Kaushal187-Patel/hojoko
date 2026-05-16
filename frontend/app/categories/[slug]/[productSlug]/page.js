import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/utils/serverApi';
import { getProductUrl } from '@/utils/helpers';
import ProductDetailsClient from './ProductDetailsClient';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function generateMetadata({ params }) {
  const { slug, productSlug } = await params;
  const product = await getProductBySlug(slug, productSlug);

  if (!product) {
    return { title: 'Product not found | HOZOKO' };
  }

  const path = getProductUrl(product);
  const canonical = `${siteUrl}${path}`;
  const description =
    product.shortDescription || product.description?.slice(0, 160) || `Shop ${product.name} on HOZOKO`;
  const image = product.images?.[0];

  return {
    title: `${product.name} | HOZOKO`,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      type: 'website',
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: product.name,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function CategoryProductDetailsPage({ params }) {
  const { slug, productSlug } = await params;
  const product = await getProductBySlug(slug, productSlug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
