'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ScrollReveal from '@/components/motion/ScrollReveal';
import useClientAuth from '@/hooks/useClientAuth';
import { isAdminUser } from '@/utils/auth';

const quickTopics = [
  {
    title: 'Orders',
    description: 'Track status, change address, or cancel before dispatch.',
    href: '#orders',
  },
  {
    title: 'Shipping',
    description: 'Delivery times, charges, and serviceable pin codes.',
    href: '#shipping',
  },
  {
    title: 'Returns',
    description: '7-day returns, refunds, and exchange steps.',
    href: '#returns',
  },
  {
    title: 'Payments',
    description: 'Secure checkout with Razorpay — UPI, cards, and more.',
    href: '#payments',
  },
];

const guidelines = [
  {
    id: 'orders',
    eyebrow: 'Orders',
    title: 'Placing & tracking orders',
    points: [
      {
        heading: 'How to order',
        text: 'Browse products, add items to your cart, choose a saved delivery address at checkout, and pay securely. You must be signed in to complete checkout.',
      },
      {
        heading: 'Order confirmation',
        text: 'After payment, your order appears under Account → Orders with a confirmation status. Keep your registered email handy for updates.',
      },
      {
        heading: 'Tracking',
        text: 'Sign in and open Orders to see real-time status: confirmed, processing, shipped, and delivered. Tracking details are added when your parcel is dispatched.',
      },
      {
        heading: 'Cancel or change order',
        text: 'Contact support within 2 hours of placing an order if you need to cancel or update the delivery address. Once packed, changes may not be possible.',
      },
    ],
  },
  {
    id: 'shipping',
    eyebrow: 'Shipping',
    title: 'Delivery guidelines',
    points: [
      {
        heading: 'Delivery timeline',
        text: 'Most orders arrive within 3–7 business days after dispatch. Remote or high-demand areas may take a little longer.',
      },
      {
        heading: 'Shipping charges',
        text: 'Free standard shipping on orders above ₹999. Below that threshold, a flat delivery fee is shown at checkout before you pay.',
      },
      {
        heading: 'Delivery address',
        text: 'Add multiple addresses in your profile. Select the correct address on the cart or checkout page — we deliver only to the address you confirm at payment.',
      },
      {
        heading: 'Failed delivery',
        text: 'If a delivery attempt fails, our courier may retry or contact you. Repeated failures can result in return-to-origin; reach out to support to reschedule.',
      },
    ],
  },
  {
    id: 'returns',
    eyebrow: 'Returns & refunds',
    title: 'Returns policy',
    points: [
      {
        heading: 'Eligibility',
        text: 'Items may be returned within 7 days of delivery if unused, unworn, and in original packaging with tags intact. Limited Edition drops are final sale unless defective.',
      },
      {
        heading: 'How to start a return',
        text: 'Email support@hozoko.in with your order number, product name, and reason. We will share pickup or drop-off instructions within 1–2 business days.',
      },
      {
        heading: 'Refunds',
        text: 'Approved refunds are processed to your original payment method within 5–10 business days after we receive and inspect the item. Bank timelines may vary.',
      },
      {
        heading: 'Damaged or wrong item',
        text: 'Report defects or wrong products within 48 hours of delivery with photos. We will arrange a replacement or full refund at no extra cost.',
      },
    ],
  },
  {
    id: 'payments',
    eyebrow: 'Payments',
    title: 'Payment & checkout',
    points: [
      {
        heading: 'Accepted methods',
        text: 'We accept UPI, credit and debit cards, and net banking through Razorpay. All transactions are encrypted and processed on secure payment pages.',
      },
      {
        heading: 'Payment failed',
        text: 'If payment fails but money is debited, wait 24 hours for an automatic reversal. If it does not reflect, contact us with your transaction reference.',
      },
      {
        heading: 'Invoices',
        text: 'A digital summary is available from your order details after purchase. Contact support if you need a GST invoice for business purchases.',
      },
    ],
  },
  {
    id: 'account',
    eyebrow: 'Your account',
    title: 'Account & security',
    points: [
      {
        heading: 'Sign up & sign in',
        text: 'Create an account with your email to save addresses, view orders, manage your wishlist, and check out faster.',
      },
      {
        heading: 'Password reset',
        text: 'Use Forgot password on the sign-in screen. We email a secure link valid for one hour to set a new password.',
      },
      {
        heading: 'Profile & addresses',
        text: 'Update your name, phone, and saved addresses anytime from Profile. Your selected delivery address is remembered for cart and checkout.',
      },
    ],
  },
  {
    id: 'privacy',
    eyebrow: 'Privacy & cookies',
    title: 'Cookies & data',
    points: [
      {
        heading: 'Cookies we use',
        text: 'HOZOKO uses essential cookies to keep you signed in, remember your cart, and run checkout. We also store recently viewed products on your device to personalise browsing.',
      },
      {
        heading: 'Your choice',
        text: 'When you first visit, you can accept cookies via the banner at the bottom of the site. You can clear cookies anytime in your browser settings.',
      },
      {
        heading: 'Data we collect',
        text: 'We collect information you provide (name, email, phone, addresses) and order history to fulfil purchases and support you. We do not sell your personal data.',
      },
    ],
  },
];

const faqs = [
  {
    question: 'Do I need an account to shop?',
    answer: 'You can browse freely. Sign in is required to add to cart, save addresses, and complete checkout.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Sign in → Orders. Each order shows its current status from confirmation to delivery.',
  },
  {
    question: 'What is your return policy?',
    answer: '7-day returns on eligible items in original condition. Limited Edition products are non-returnable unless faulty.',
  },
  {
    question: 'Which payment methods do you accept?',
    answer: 'UPI, cards, and net banking via Razorpay at checkout.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Typically 3–7 business days after dispatch, depending on your location.',
  },
  {
    question: 'Is my payment information safe?',
    answer: 'Yes. Payments are handled by Razorpay; HOZOKO does not store your full card or UPI credentials.',
  },
  {
    question: 'Can I change my delivery address after ordering?',
    answer: 'Contact support within 2 hours of placing the order. Changes may not be possible once the order is packed.',
  },
  {
    question: 'What are Limited Edition products?',
    answer: 'Small-batch drops with a fixed run size and live scarcity meter. Stock is limited and may not be restocked.',
  },
];

export default function SupportPageContent() {
  const pathname = usePathname();
  const { user, isAuthenticated, ready } = useClientAuth();
  const accountHref = isAdminUser(user) ? '/admin' : '/dashboard';
  const signInHref = `${pathname}?auth=login`;

  return (
    <div className="page-shell support-page">
      <ScrollReveal>
        <p className="eyebrow">Help center</p>
        <h1 className="page-title mt-2">Support & guidelines</h1>
        <p className="body-copy mt-4 max-w-2xl">
          Everything you need to shop, track orders, return items, and manage your HOZOKO account — clear
          guidelines written for our online store.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={40} className="mt-10">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500">Browse topics</h2>
        <div className="support-topic-grid mt-4">
          {quickTopics.map((topic) => (
            <a key={topic.href} href={topic.href} className="support-topic-card">
              <p className="font-serif text-xl text-ink">{topic.title}</p>
              <p className="mt-2 text-sm text-stone-600">{topic.description}</p>
              <span className="support-topic-link">Read guidelines →</span>
            </a>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={60} className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="card space-y-4 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-serif text-2xl text-ink">Contact us</h2>
          <p className="body-muted">Monday–Saturday, 10:00 AM – 7:00 PM IST</p>
          <ul className="space-y-3 text-sm text-stone-700">
            <li>
              <span className="font-medium text-ink">Email:</span>{' '}
              <a href="mailto:support@hozoko.in" className="brand-link">
                support@hozoko.in
              </a>
            </li>
            <li>
              <span className="font-medium text-ink">Phone:</span>{' '}
              <a href="tel:+919876543210" className="brand-link">
                +91 98765 43210
              </a>
            </li>
            <li>
              <span className="font-medium text-ink">WhatsApp:</span>{' '}
              <a href="https://wa.me/919876543210" className="brand-link" target="_blank" rel="noopener noreferrer">
                Message us
              </a>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-4">
            {isAuthenticated ? (
              <>
                <Link href="/orders" className="btn-primary">
                  View orders
                </Link>
                <Link href={accountHref} className="btn-secondary">
                  My account
                </Link>
                <Link href="/profile" className="btn-secondary">
                  Profile
                </Link>
              </>
            ) : ready ? (
              <Link href={signInHref} className="btn-primary" scroll={false}>
                Sign in for order help
              </Link>
            ) : (
              <span className="text-sm text-stone-500">Loading your session…</span>
            )}
          </div>
        </section>

        <section className="card space-y-3">
          <h2 className="font-serif text-2xl text-ink">Quick links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/products" className="footer-link">
                Shop all products
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
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/orders" className="footer-link">
                    Your orders
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="footer-link">
                    Profile & addresses
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="footer-link">
                    Wishlist
                  </Link>
                </li>
              </>
            ) : ready ? (
              <li>
                <Link href={signInHref} className="footer-link" scroll={false}>
                  Sign in
                </Link>
              </li>
            ) : null}
            <li>
              <Link href="/forgot-password" className="footer-link">
                Reset password
              </Link>
            </li>
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={80} className="mt-14">
        <p className="eyebrow">Store policies</p>
        <h2 className="section-title mt-2">Shopping guidelines</h2>
        <p className="body-muted mt-3 max-w-2xl">
          Please read these before you buy. They explain how HOZOKO handles orders, delivery, returns, and your
          data as an e-commerce customer.
        </p>
      </ScrollReveal>

      <div className="mt-10 space-y-8">
        {guidelines.map((section, sectionIndex) => (
          <ScrollReveal key={section.id} delay={sectionIndex * 40} as="section" id={section.id} className="support-guideline-section card scroll-mt-28">
            <p className="eyebrow">{section.eyebrow}</p>
            <h3 className="font-serif text-2xl text-ink mt-2">{section.title}</h3>
            <ul className="support-guideline-list mt-6 space-y-5">
              {section.points.map((point) => (
                <li key={point.heading}>
                  <p className="font-medium text-ink">{point.heading}</p>
                  <p className="body-muted mt-1">{point.text}</p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={100} className="mt-14">
        <p className="eyebrow">FAQ</p>
        <h2 className="section-title mt-2">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((item, index) => (
            <ScrollReveal key={item.question} delay={index * 40} as="article" className="card">
              <h3 className="font-semibold text-ink">{item.question}</h3>
              <p className="body-muted mt-2">{item.answer}</p>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={120} className="mt-10 card border-ink/20 bg-stone-50">
        <h2 className="font-serif text-xl text-ink">Still need help?</h2>
        <p className="body-muted mt-2">
          Our team typically replies within one business day. Include your order number for faster support.
        </p>
        <a href="mailto:support@hozoko.in" className="btn-primary mt-4 inline-flex">
          Email support@hozoko.in
        </a>
      </ScrollReveal>
    </div>
  );
}
