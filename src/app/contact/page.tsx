import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto" style={{ color: 'var(--ftext)' }}>
      <Link href="/" className="font-barlowc font-bold text-xl tracking-[3px] inline-block mb-8" style={{ color: 'var(--ftext)' }}>
        Fan<span style={{ color: 'var(--orange)' }}>Hop</span>
      </Link>

      <h1 className="font-barlowc font-bold text-3xl mb-6">Contact Us</h1>

      <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--ftext)' }}>
        <p>
          Have questions, feedback, or just want to say hi? We&apos;d love to hear from you.
        </p>

        <p>
          Reach us at{' '}
          <a href="mailto:hello@fanhop.com" className="underline font-semibold" style={{ color: 'var(--orange)' }}>
            hello@fanhop.com
          </a>
        </p>

        <p style={{ color: 'var(--muted)' }}>
          We typically respond within a few business days.
        </p>
      </div>

      <div className="mt-12 pt-6 border-t text-xs" style={{ borderColor: 'var(--rule)', color: 'var(--muted)' }}>
        <Link href="/" className="underline" style={{ color: 'var(--orange)' }}>Back to FanHop</Link>
        {' · '}
        <Link href="/privacy" className="underline" style={{ color: 'var(--orange)' }}>Privacy Policy</Link>
      </div>
    </div>
  )
}
