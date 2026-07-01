export default function CookiesPolicy() {
  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="border-b border-white/5 pb-8">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight mb-4">
            Cookie Policy
          </h1>
        </div>

        {/* Introduction */}
        <p className="text-white/70 text-lg leading-relaxed">
          At <span className="text-primary-light font-bold">VidiMetrics.Ai</span>, we believe in being clear and open about how we collect and use data related to you. This policy provides detailed information about how and when we use cookies on our platform to manage your sessions and enhance processing workflows.
        </p>

        {/* Content Sections */}
        <div className="space-y-10">

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">01</span>
              What is a Cookie?
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              A cookie is a small text file that is placed on your hard drive by a web page server. Cookies contain information that can later be read by a web server in the domain that issued the cookie to you. They cannot be used to run programs or deliver viruses to your computer.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">02</span>
              How VidiMetrics.Ai Uses Cookies
            </h2>
            <p className="text-white/60 leading-relaxed pl-10 mb-2">
              We use cookies to enhance your dashboard experience and protect system transactions. Our cookies generally fall into three main functional categories:
            </p>

            <div className="pl-10 space-y-4 mt-4">
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-primary-light uppercase tracking-wider mb-1">Essential & Authentication Cookies</h4>
                <p className="text-white/50 text-sm">
                  These are strictly necessary to authorize your secure login states via our Identity Server (OIDC). They retain your security tokens so you do not have to re-authenticate on every single background page navigation.
                </p>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-primary-light uppercase tracking-wider mb-1">Preference & Settings Cookies</h4>
                <p className="text-white/50 text-sm">
                  These remember your UI settings, such as whether your dashboard sidebar is collapsed (`isSidebarCollapsed`), or specialized rendering configuration presets you have tailored.
                </p>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-primary-light uppercase tracking-wider mb-1">Analytics & Quota Performance</h4>
                <p className="text-white/50 text-sm">
                  These track aggregated usage parameters, monitoring render queue latencies, load times, and API query performance to ensure our server clusters scale efficiently during high-demand workflows.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white flex items-center gap-3">
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">03</span>
              Managing Your Cookie Preferences
            </h2>
            <p className="text-white/60 leading-relaxed pl-10">
              Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline them if you prefer. However, please note that choosing to decline cookies may prevent you from logging into your user dashboard, checking your dynamic credit balances, or deploying rendering workflows on our platform.
            </p>
          </section>

        </div>

        {/* Contact Info Box */}
        <div className="mt-16 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-bold text-white">Privacy Concerns?</h4>
            <p className="text-xs text-white/40 mt-1">Learn more about how we safeguard your data in our full Privacy Policy.</p>
          </div>
          <a
            href="mailto:privacy@vidimetrics.ai"
            className="text-xs font-bold uppercase tracking-wider text-primary-light hover:text-primary bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all duration-300"
          >
            Contact Privacy Officer
          </a>
        </div>

      </div>
    </div>
  );
}