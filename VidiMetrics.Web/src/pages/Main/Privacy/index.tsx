export default function PrivacyPolicy() {
  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="border-b border-white/5 pb-8">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight mb-4">
            Privacy Policy
          </h1>
        </div>

        {/* Introduction */}
        <p className="text-white/70 text-lg leading-relaxed">
          At <span className="text-primary-light font-bold">VidiMetrics.Ai</span>, your privacy is a core priority. This Privacy Policy outlines how we collect, process, secure, and manage your personal data and uploaded digital assets when you interact with our automated AI video rendering infrastructure.
        </p>

        {/* Privacy Policy Content Sections */}
        <div className="space-y-10">

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">01</span>
              Information We Collect
            </h2>
            <p className="text-white/60 leading-relaxed pl-10 mb-2">
              We gather necessary parameters to maintain system security and deploy background computing pipelines:
            </p>
            <ul className="list-disc list-inside pl-14 space-y-2 text-white/50 text-sm">
              <li><strong className="text-white/80">Identity Data:</strong> Full name, email address, and profile pictures synchronized securely through our OpenID Connect (OIDC) protocol.</li>
              <li><strong className="text-white/80">Usage Data:</strong> Transaction records of your Credit wallet, including total quota allocated, rendering history, and processing execution logs.</li>
              <li><strong className="text-white/80">Asset Data:</strong> Raw media assets, configuration scripts, or environmental parameters uploaded to our background queues for rendering processing.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">02</span>
              How Your Data is Processed
            </h2>
            <p className="text-white/60 leading-relaxed pl-10 mb-2">
              VidiMetrics.Ai isolates data structures to maintain functional performance:
            </p>
            <ul className="list-disc list-inside pl-14 space-y-2 text-white/50 text-sm">
              <li>To authorize secure access controls across our user and administrator dashboards.</li>
              <li>To route rendering commands dynamically to active high-performance worker nodes.</li>
              <li>To calculate precise subscription metrics and balance deductions instantly.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">03</span>
              Data Retention & Asset Erasure
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              We do not store your processed video assets indefinitely. Once an AI processing pipeline completes execution and the asset is downloaded or expired according to your tier plan, raw files are systematically purged from our transient cloud rendering nodes to guarantee private security.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">04</span>
              Security Architecture
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              We employ strict industry-standard measures to protect data transmission. Access to administrative systems is heavily restricted via multi-layered security guards (`AdminRoute`) ensuring user accounts, balances, and operational logs are strictly walled off from external interception.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">05</span>
              Your Rights (GDPR & CCPA)
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              Depending on your location, you hold full legislative rights to request access to your account metadata, demand truncation of your usage logs, or execute a complete erasure of your identity from our secure databases.
            </p>
          </section>

        </div>

        {/* Contact Footer Box */}
        <div className="mt-16 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-bold text-white">Data Protection Concerns?</h4>
            <p className="text-xs text-white/40 mt-1">Contact our certified data protection office directly for inquiries.</p>
          </div>
          <a
            href="mailto:privacy@vidimetrics.ai"
            className="text-xs font-bold uppercase tracking-wider text-primary-light hover:text-primary bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all duration-300"
          >
            Contact Privacy Team
          </a>
        </div>

      </div>
    </div>
  );
}