import Container from '@/components/ui/Container'
import { generateMetadata as genMeta } from '@/lib/seo'
import businessData from '@/data/business.json'

export const metadata = genMeta({
  title: 'Terms of Service',
  description: `Terms of service for ${businessData.name}. Read our terms and conditions for using our services.`,
})

export default function TermsPage() {
  const companyName = businessData.name
  const email = (businessData as any).email || 'info@example.com'
  const phone = businessData.phone

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1>Terms of Service</h1>
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2>Service Agreement</h2>
          <p>
            By requesting services from {companyName}, you agree to these terms and conditions. Please read them carefully before using our website or requesting service.
          </p>

          <h2>Services</h2>
          <p>
            {companyName} provides professional services as described on our website. All work is performed by licensed and insured professionals. Specific service details, pricing, and timelines will be discussed and agreed upon before work begins.
          </p>

          <h2>Estimates and Pricing</h2>
          <ul>
            <li>Free estimates are provided for most services unless otherwise noted</li>
            <li>Estimates are valid for 30 days from the date of issue</li>
            <li>Final pricing may vary if the scope of work changes during the project</li>
            <li>Any additional work beyond the original estimate will be discussed and approved before proceeding</li>
          </ul>

          <h2>Scheduling and Cancellation</h2>
          <ul>
            <li>We strive to accommodate your preferred service times</li>
            <li>Please provide at least 24 hours notice for cancellations or rescheduling</li>
            <li>Emergency services are available and may be subject to additional charges</li>
          </ul>

          <h2>Warranty</h2>
          <p>
            {companyName} stands behind our work. Specific warranty terms vary by service type and will be provided in writing with your service agreement. Warranties cover workmanship and do not apply to pre-existing conditions or damage caused by others.
          </p>

          <h2>Liability</h2>
          <p>
            {companyName} maintains appropriate insurance coverage for all services provided. Our liability is limited to the cost of the services performed. We are not responsible for pre-existing conditions discovered during service.
          </p>

          <h2>Website Use</h2>
          <ul>
            <li>The content on this website is for informational purposes only</li>
            <li>We reserve the right to update content and pricing at any time</li>
            <li>You agree not to misuse our website or submit false information through our forms</li>
          </ul>

          <h2>Payment</h2>
          <p>
            Payment terms will be agreed upon before service begins. We accept cash, credit cards, and checks. Payment is due upon completion of service unless other arrangements have been made in advance.
          </p>

          <h2>Dispute Resolution</h2>
          <p>
            If you have a concern about our services, please contact us directly. We are committed to resolving any issues promptly and fairly.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, please contact us:
          </p>
          <ul>
            <li>Phone: <a href={`tel:${businessData.phoneRaw}`}>{phone}</a></li>
            <li>Email: <a href={`mailto:${email}`}>{email}</a></li>
          </ul>

          <h2>Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the updated terms.
          </p>
        </div>
      </Container>
    </section>
  )
}
