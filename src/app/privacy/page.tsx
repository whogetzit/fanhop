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
      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Last updated: March 13, 2026</p>

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
          <h2 className="font-barlowc font-bold text-lg mb-2">Data Retention</h2>
          <p>
            We retain your account information and bracket data for as long as your account is active.
            If you delete your account, we will remove your personal information and bracket data within
            30 days, except where we are required to retain it for legal or regulatory purposes. Anonymous,
            aggregated data that cannot identify you may be retained indefinitely.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Children&apos;s Privacy</h2>
          <p>
            FanHop is not directed at children under the age of 13. We do not knowingly collect personal
            information from children under 13. If we become aware that we have collected personal
            information from a child under 13, we will take steps to delete that information promptly.
            If you believe a child under 13 has provided us with personal information, please contact us
            at{' '}
            <a href="mailto:hello@fanhop.com" className="underline" style={{ color: 'var(--orange)' }}>
              hello@fanhop.com
            </a>.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Third-Party Services</h2>
          <p>
            FanHop uses third-party services to operate, including Supabase (authentication and database),
            Vercel (hosting and deployment), and Sports Reference (team statistics data). These services
            may collect and process data in accordance with their own privacy policies. We encourage you
            to review the privacy policies of these third-party providers.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information at any time. You
            may also request a copy of the data we hold about you. To exercise any of these rights,
            please contact us at{' '}
            <a href="mailto:hello@fanhop.com" className="underline" style={{ color: 'var(--orange)' }}>
              hello@fanhop.com
            </a>. We will respond to your request within 30 days.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">California Privacy Rights (CCPA)</h2>
          <p>
            If you are a California resident, you have additional rights under the California Consumer
            Privacy Act (CCPA). These include the right to know what personal information we collect, the
            right to request deletion of your data, and the right to opt out of the sale of your personal
            information. We do not sell your personal information. To exercise your California privacy
            rights, contact us at{' '}
            <a href="mailto:hello@fanhop.com" className="underline" style={{ color: 'var(--orange)' }}>
              hello@fanhop.com
            </a>.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">Do Not Track</h2>
          <p>
            Some browsers offer a &quot;Do Not Track&quot; (DNT) signal. FanHop currently does not respond
            to DNT signals, as there is no industry-wide standard for how to handle them. We will update
            this policy if a standard is established.
          </p>
        </div>

        <div>
          <h2 className="font-barlowc font-bold text-lg mb-2">International Users</h2>
          <p>
            FanHop is operated from the United States. If you are accessing FanHop from outside the
            United States, please be aware that your information may be transferred to, stored, and
            processed in the United States where our servers are located. By using FanHop, you consent
            to the transfer of your information to the United States, which may have different data
            protection laws than your country of residence.
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
