import { useState } from "react";

export default function ApiPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("bash");

  const codeSnippets = {
    bash: `curl -X POST "https://api.vidimetrics.ai/v1/render/dispatch" \\
  -H "Authorization: Bearer YOUR_VM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "neon_grid_4k",
    "variables": { "title": "Hello World" }
  }'`,
    javascript: `const response = await fetch('https://api.vidimetrics.ai/v1/render/dispatch', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_VM_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templateId: 'neon_grid_4k',
    variables: { title: 'Hello World' }
  })
});
const data = await response.json();`,
    python: `import requests

url = "https://api.vidimetrics.ai/v1/render/dispatch"
headers = {
    "Authorization": "Bearer YOUR_VM_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "templateId": "neon_grid_4k",
    "variables": {"title": "Hello World"}
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
  };

  const features = [
    { icon: "bolt", title: "Ultra-Low Latency", desc: "Our OIDC identity protocol and lightweight JSON gateway process endpoint requests in less than 150ms." },
    { icon: "sync", title: "Webhooks Architecture", desc: "No need to poll status. Register automated HTTP listeners to catch render success, failure, or quota alerts." },
    { icon: "shield", title: "Enterprise Guard", desc: "Every single background process operates inside an isolated cloud sandbox, protected by dynamic token authentication." },
  ];

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-20">

        {/* Hero Section: Text + Code Side-by-Side Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Developer Ecosystem
            </span>
            <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight leading-none">
              Integrate Video AI with Two Lines of Code.
            </h1>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Automate complex media composition pipelines, monitor distributed GPU worker queues, and manage client balance deductions programmatically using our high-performance REST API.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="px-5 py-3 bg-white text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-white/90 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
                Get Free API Key
              </button>
              <button className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/5 transition-all duration-300">
                Explore API Docs
              </button>
            </div>
          </div>

          {/* Right Code Playground Column */}
          <div className="lg:col-span-6 bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            {/* Window Header */}
            <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>

              {/* Language Switchers */}
              <div className="flex gap-2">
                {Object.keys(codeSnippets).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded transition-colors ${selectedLanguage === lang
                        ? "bg-primary/10 text-primary-light font-bold"
                        : "text-white/40 hover:text-white"
                      }`}
                  >
                    {lang === "bash" ? "cURL" : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-5 overflow-x-auto font-mono text-xs text-white/70 leading-relaxed min-h-[180px] flex items-center">
              <pre className="w-full select-all">
                <code>{codeSnippets[selectedLanguage as keyof typeof codeSnippets]}</code>
              </pre>
            </div>
          </div>

        </div>

        {/* API Core Features Grid */}
        <div className="space-y-8">
          <div className="border-l-2 border-primary pl-4">
            <h3 className="text-lg font-headline font-bold text-white">Built for High Volume</h3>
            <p className="text-xs text-white/40 mt-0.5">Reliable scaling designed strictly for production environments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3 hover:border-white/10 transition-colors duration-300">
                <div className="w-10 h-10 bg-primary/5 border border-primary/10 text-primary-light rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">{f.icon}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{f.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* API Stats Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-white/5 py-8 text-center md:text-left">
          <div>
            <div className="text-2xl font-mono font-black text-white">99.99%</div>
            <p className="text-xs text-white/40 font-mono mt-0.5">Core Gateway Uptime</p>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-white">&lt; 150ms</div>
            <p className="text-xs text-white/40 font-mono mt-0.5">Global Endpoint Response</p>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-white">10k / min</div>
            <p className="text-xs text-white/40 font-mono mt-0.5">Burst Rate Limit Capacity</p>
          </div>
        </div>

        {/* Call to Action Box */}
        <div className="p-8 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl text-center space-y-4">
          <h3 className="text-lg font-headline font-bold text-white">Ready to scale your rendering pipelines?</h3>
          <p className="text-xs text-white/50 max-w-xl mx-auto">
            Create an account, claim your 1,000 free testing rendering credits, and deploy your code live into our node clusters in under five minutes.
          </p>
          <button className="text-xs font-bold uppercase tracking-wider text-black bg-primary px-6 py-3 rounded-xl hover:bg-primary-light transition-all duration-300 shadow-lg">
            Create Developer Account
          </button>
        </div>

      </div>
    </div>
  );
}