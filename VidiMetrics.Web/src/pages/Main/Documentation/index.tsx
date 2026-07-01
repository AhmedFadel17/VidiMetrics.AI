import { useState } from "react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("introduction");

  const menuItems = [
    { id: "introduction", label: "Introduction", icon: "menu_book" },
    { id: "authentication", label: "Authentication", icon: "vpn_key" },
    { id: "rendering", label: "Render Pipeline", icon: "dns" },
    { id: "credits", label: "Credit Metrics", icon: "database" },
    { id: "webhooks", label: "Webhooks & Queues", icon: "webhook" },
  ];

  return (
    <div className="bg-surface text-white min-h-screen pt-28 flex flex-col lg:flex-row transition-all duration-300">

      {/* 1️⃣ Sidebar Dynamic Navigation */}
      <aside className="w-full lg:w-64 lg:fixed lg:h-[calc(100vh-7rem)] border-b lg:border-b-0 lg:border-r border-white/5 p-6 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 px-3">
            Getting Started
          </h4>
          <nav className="space-y-1 pt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 outline-none ${activeSection === item.id
                    ? "bg-primary/10 text-primary-light font-bold border border-primary/10"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 2️⃣ Main Content Documentation Area */}
      <main className="flex-1 lg:pl-72 px-6 md:px-12 py-8 max-w-4xl space-y-12 overflow-x-hidden">

        {/* Section: Introduction */}
        {activeSection === "introduction" && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">v1.0.0 Stable</span>
              <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight">Introduction</h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Welcome to the VidiMetrics.Ai API documentation. Our decentralized rendering framework allows you to programmatically trigger high-fidelity video generation, fetch node metrics, and track rendering credits effortlessly via standard RESTful JSON requests.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-sm text-primary-light">info</span>
                Base API URL
              </h4>
              <code className="block bg-black/40 px-4 py-2.5 rounded-xl font-mono text-xs text-primary-light border border-white/5 select-all">
                https://api.vidimetrics.ai/v1
              </code>
            </div>
          </section>
        )}

        {/* Section: Authentication */}
        {activeSection === "authentication" && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight">Authentication</h1>
              <p className="text-white/60 text-sm leading-relaxed">
                All API requests to the VidiMetrics.Ai gateway must be authorized using a Bearer token issued via your Identity Server settings console. Secure your private keys carefully.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-white/40">Example HTTP Request Header:</span>
              <pre className="bg-black/50 border border-white/5 rounded-2xl p-5 font-mono text-xs text-white/70 overflow-x-auto leading-relaxed shadow-inner">
                {`GET /v1/user/profile HTTP/1.1
Host: api.vidimetrics.ai
Authorization: Bearer vm_live_secret_token_928340
Accept: application/json`}
              </pre>
            </div>
          </section>
        )}

        {/* Section: Render Pipeline */}
        {activeSection === "rendering" && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight">Triggering Render Job</h1>
              <p className="text-white/60 text-sm leading-relaxed">
                To dispatch a compilation workflow to our worker queues, issue a <code className="text-primary-light font-mono text-xs bg-white/5 px-1 py-0.5 rounded">POST</code> request containing your template configurations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">POST</span>
                <span className="text-white/80">/render/dispatch</span>
              </div>

              <pre className="bg-black/50 border border-white/5 rounded-2xl p-5 font-mono text-xs text-white/70 overflow-x-auto leading-relaxed">
                {`{
  "templateId": "neon_grid_intro_4k",
  "resolution": "3840x2160",
  "fps": 60,
  "variables": {
    "title_text": "VidiMetrics Evolution",
    "accent_color": "#8A2BK"
  }
}`}
              </pre>
            </div>
          </section>
        )}

        {/* Section: Credit Metrics */}
        {activeSection === "credits" && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight">Credit Deduction Logic</h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Credits are locked as "pending" as soon as a render node pulls the task from the main cluster queue, and are permanently deducted upon completion.
              </p>
            </div>

            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-white/5 text-white/40 uppercase font-mono text-[10px] tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-4">Resolution</th>
                    <th className="p-4">FPS</th>
                    <th className="p-4">Cost Per Second</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/70">
                  <tr>
                    <td className="p-4 font-mono">1080p (FHD)</td>
                    <td className="p-4">30 / 60</td>
                    <td className="p-4 font-bold text-white">1 Credit</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono">4K (UHD)</td>
                    <td className="p-4">30</td>
                    <td className="p-4 font-bold text-white">3 Credits</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono">4K (UHD)</td>
                    <td className="p-4">60</td>
                    <td className="p-4 font-bold text-white">5 Credits</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Section: Webhooks */}
        {activeSection === "webhooks" && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-headline font-black tracking-tight">Webhooks</h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Since video rendering is an asynchronous heavy operational process, register a webhook URL within your developer cockpit to receive instant pings when compilation succeeds or fails.
              </p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex gap-3">
              <span className="material-symbols-outlined text-amber-400 text-xl">warning</span>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-white">Webhook Signature Verification</h5>
                <p className="text-xs text-white/50 leading-relaxed">
                  Always verify the header signature <code className="text-amber-300 font-mono text-[11px] bg-white/5 px-1 rounded">X-VidiMetrics-Signature</code> to prevent spoofing requests on your listener infrastructure.
                </p>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}