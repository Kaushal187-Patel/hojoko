'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/motion/ScrollReveal';

const faqs = [
  {
    question: 'How do I track my order?',
    answer: 'Sign in and open Orders from your account menu. You will see status updates for every purchase.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Items can be returned within 7 days of delivery if unused and in original packaging. Contact us to start a return.',
  },
  {
    question: 'Which payment methods do you accept?',
    answer: 'We accept UPI, cards, and net banking through Razorpay at checkout.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Most orders arrive within 3–7 business days depending on your location.',
  },
];

export default function SupportPageContent() {
  return (
    <div className="page-shell">
      <ScrollReveal>
        <p className="eyebrow">Help</p>
        <h1 className="page-title mt-2">Support</h1>
        <p className="body-copy mt-4 max-w-2xl">
          Need help with an order, payment, or your account? We are here for you.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={60} className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="card space-y-4">
          <h2 className="font-serif text-2xl text-ink">Contact us</h2>
          <p className="body-muted">Reach our team Monday–Saturday, 10:00 AM – 7:00 PM IST.</p>
          <ul className="space-y-3 text-sm text-stone-700">
            <li>
              <span className="font-medium text-ink">Email:</span>{' '}
              <a href="mailto:support@hozoko.in" className="brand-link">
                support@hozoko.in
              </a>
            </li>
            <li>
              <span className="font-medium text-ink">Phone:</span> +91 98765 43210
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/orders" className="btn-primary">
              View orders
            </Link>
            <Link href="/?auth=login" className="btn-secondary">
              Sign in
            </Link>
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="font-serif text-2xl text-ink">Quick links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/products" className="footer-link">
                Shop products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="footer-link">
                Your cart
              </Link>
            </li>
            <li>
              <Link href="/categories" className="footer-link">
                Browse categories
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="footer-link">
                Account dashboard
              </Link>
            </li>
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={100} className="mt-10">
        <h2 className="section-title">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((item, index) => (
            <ScrollReveal key={item.question} delay={index * 50} as="article" className="card">
              <h3 className="font-semibold text-ink">{item.question}</h3>
              <p className="body-muted mt-2">{item.answer}</p>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}
