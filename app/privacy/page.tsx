import Container from '@/components/ui/Container'
import { generateMetadata as genMeta } from '@/lib/seo'
import businessData from '@/data/business.json'

export const metadata = genMeta({
  title: 'Privacy Policy',
  description: `Privacy policy for ${businessData.name}. Learn how we collect, use, and protect your personal information.`,
})

export default function PrivacyPage() {
  const companyName = businessData.name
  const email = (businessData as any).email || 'info@example.com'
  const phone = businessData.phone
  const address = businessData.address

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2>Information We Collect</h2>
          <p>
            When you use our website or request services, we may collect the following information:
          </p>
          <ul>
            <li><strong>Contact Information:</strong> Name, phone number, email address, and service address</li>
            <li><strong>Service Details:</strong> Information about the service you need, including urgency and any messages you provide</li>
            <li><strong>Usage Data:</strong> How you interact with our website, including pages visited and referring sources</li>
            <li><strong>Device Information:</strong> Browser type, IP address, and device type for security and analytics</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your service requests and inquiries</li>
            <li>Schedule and provide our services</li>
            <li>Communicate with you about your service appointment</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and ensure security</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information with:
          </p>
          <ul>
            <li><strong>Service Partners:</strong> Trusted partners who help us provide services (e.g., scheduling software, payment processing)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All form submissions are encrypted in transit using HTTPS.
          </p>

          <h2>Cookies</h2>
          <p>
            Our website uses cookies to improve your experience. These include essential cookies for site functionality and analytics cookies to help us understand how visitors use our site. You can disable cookies in your browser settings.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to your personal information</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of the data we hold about you</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this privacy policy or your personal data, contact us:
          </p>
          <ul>
            <li>Phone: <a href={`tel:${businessData.phoneRaw}`}>{phone}</a></li>
            <li>Email: <a href={`mailto:${email}`}>{email}</a></li>
            <li>Address: {address.full}</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
          </p>
        </div>
      </Container>
    </section>
  )
}
