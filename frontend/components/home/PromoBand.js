'use client';

import ScrollReveal from '@/components/motion/ScrollReveal';

export default function PromoBand() {
  return (
    <section className="promo-band">
      <div className="promo-grid">
        <ScrollReveal delay={0}>
          <div>
            <p className="eyebrow">Summer occasion capsule</p>
            <h2 className="section-title mt-3">
              Limited <span className="italic">Edition</span>
            </h2>
            <p className="body-copy mt-4 max-w-xl">
              Statement pieces, refined textures, and elevated silhouettes designed to move from day to evening with ease.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={80} className="grid gap-4 sm:grid-cols-2">
          <div className="promo-card">
            <p className="eyebrow">Delivery</p>
            <p className="promo-card-title">Fast worldwide shipping</p>
          </div>
          <div className="promo-card">
            <p className="eyebrow">Rewards</p>
            <p className="promo-card-title">Earn points on every order</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
