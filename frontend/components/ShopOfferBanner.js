import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, getProductImage, getProductUrl } from '@/utils/helpers';

export default function ShopOfferBanner({ products = [] }) {
  const offerProducts = products.slice(0, 4);
  const heroProduct = offerProducts[0];

  if (!offerProducts.length) {
    return null;
  }

  return (
    <section className="shop-offer-banner">
      <div className="shop-offer-inner shop-offer-inner--visual">
        <div className="shop-offer-tiles">
          {offerProducts.map((product) => (
            <Link
              key={product._id}
              href={getProductUrl(product)}
              className="shop-offer-tile group"
              title={product.name}
            >
              <Image
                src={getProductImage(product)}
                alt={product.name}
                fill
                sizes="160px"
                className="image-cover transition duration-300 group-hover:scale-105"
              />
              <span className="shop-offer-tile-price">{formatCurrency(product.price)}</span>
            </Link>
          ))}
        </div>

        {heroProduct && (
          <div className="shop-offer-hero">
            <Image
              src={getProductImage(heroProduct)}
              alt={heroProduct.name}
              fill
              priority
              sizes="50vw"
              className="image-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
