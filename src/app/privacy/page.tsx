import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto" style={{ color: 'var(--ftext)' }}>
      <Link href="/" className="font-barlowc font-bold text-xl tracking-[3px] inline-block mb-8" style={{ color: 'var(--ftext)' }}>
        Fan<span style={{ color: 'var(--orange)' }}>Hop</span>
      </Link>

      <h1 className="font-barlowc font-bold text-3xl mb-6">Privacy Policy</h1>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Last updated: March 11, 2026</p>

      <section className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--ftext)' }}>
        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Information We Collect</h2>
          <p>
            When you use FanHop, we may collect information you provide directly, such as your name and
            email address when you create an account or sign in. We also collect usage data such as bracket
            models you create, weights you configure, and how you interact with the app.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">How We Use Your Information</h2>
          <p>
            We use the information we collect to operate and improve FanHop, personalize your experience,
            and enable features like saving and sharing bracket models. We do not sell your personal
            information to third parties.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Sharing &amp; Shared Brackets</h2>
          <p>
            When you share a bracket, the bracket data (team picks, model weights, and your display name)
            becomes publicly accessible via the share link. You can stop sharing a bracket at any time.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Cookies &amp; Analytics</h2>
          <p>
            We use cookies and similar technologies to keep you signed in and to understand how the app is
            used. You can disable cookies in your browser settings, though some features may not work
            correctly without them.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Data Security</h2>
          <p>
            We take reasonable measures to protect your information. However, no method of transmission over
            the Internet is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of significant changes by
            posting the updated policy on this page with a new effective date.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at{' '}
            <a href="mailto:hello@fanhop.com" className="underline" style={{ color: 'var(--orange)' }}>
              hello@fanhop.com
            </a>.
          </p>
        </div>
      </section>

      <div className="mt-12 pt-6 border-t text-xs" style={{ borderColor: 'var(--rule)', color: 'var(--muted)' }}>
        <Link href="/" className="underline" style={{ color: 'var(--orange)' }}>Back to FanHop</Link>
        {' · '}
        <Link href="/contact" className="underline" style={{ color: 'var(--orange)' }}>Contact</Link>
      </div>
    </div>
  )
}
