export default function Terms() {
  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="border-b border-white/5 pb-8">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight mb-4">
            Terms of Service
          </h1>

        </div>

        {/* Introduction */}
        <p className="text-white/70 text-lg leading-relaxed">
          Welcome to <span className="text-primary-light font-bold">VidiMetrics.Ai</span>. By accessing or using our platform, AI-driven video rendering node tools, and services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>

        {/* Terms Content Sections */}
        <div className="space-y-10">

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">01</span>
              Account Registration & Security
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              To utilize certain rendering and analytical features of VidiMetrics.Ai, you must register for an account via our secure Identity Server. You are solely responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">02</span>
              Credit System & Quota Usage
            </h2>
            <p className="text-white/60 leading-relaxed pl-10 mb-2">
              Our platform operates on a specialized allocation system ("Credits"):
            </p>
            <ul className="list-disc list-inside pl-14 space-y-2 text-white/50 text-sm">
              <li>Credits are consumed dynamically based on video processing time, quality, and rendering node complexity.</li>
              <li>Unused credits are subject to expiration depending on your subscription plan tier.</li>
              <li>VidiMetrics.Ai reserves the right to adjust credit pricing metrics with prior notification.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">03</span>
              Acceptable Use Policy
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              You agree not to use our AI workflows to generate, render, or analyze content that is unlawful, infringing on intellectual property, harmful, or designed to disrupt the core processing engine infrastructure of VidiMetrics.Ai.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">04</span>
              Intellectual Property
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              All platform architectures, algorithms, interface layouts, and core source codes are the exclusive property of VidiMetrics.Ai. However, the raw output video assets and data rendered on behalf of the user remain the legal property of the user.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">05</span>
              Limitation of Liability
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              VidiMetrics.Ai provides its rendering services on an "as-is" and "as-available" basis. We do not guarantee uninterrupted operational uptime of background queues or render nodes during high-traffic network surges.
            </p>
          </section>

        </div>

        {/* Footer Contact Wrapper */}
        <div className="mt-16 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-bold text-white">Have questions about our Terms?</h4>
            <p className="text-xs text-white/40 mt-1">Our compliance team is ready to assist you.</p>
          </div>
          <a
            href="mailto:support@vidimetrics.ai"
            className="text-xs font-bold uppercase tracking-wider text-primary-light hover:text-primary bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all duration-300"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}