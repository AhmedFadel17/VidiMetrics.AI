import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "Technical Support",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // محاكاة إرسال البيانات إلى السيرفر
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", inquiryType: "Technical Support", message: "" });
    }, 4000);
  };

  const contactMethods = [
    { icon: "mail", title: "General & Enterprise Sales", detail: "sales@vidimetrics.ai", sub: "Response time < 4 hours" },
    { icon: "terminal", title: "Developer Infrastructure Support", detail: "infra@vidimetrics.ai", sub: "24/7/365 for Core Nodes" },
    { icon: "hub", title: "Decentralized Node Partnership", detail: "nodes@vidimetrics.ai", sub: "Hardware validation queue" }
  ];

  return (
    <div className="bg-surface text-white min-h-screen pt-36 pb-20 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Header Hero Section */}
        <div className="border-b border-white/5 pb-8 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Connect With Our Labs
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40 tracking-tight">
            Get Architectural Support
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-xl">
            Have deployment scale questions, custom API volume requests, or node hardware sync challenges? Reach out directly.
          </p>
        </div>

        {/* Core Layout Split: Form Left + Channels Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* 1️⃣ Contact Form (Left 7 Columns) */}
          <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-3xl space-y-6 relative overflow-hidden">
            <h3 className="text-base font-headline font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">maps_ugc</span>
              Dispatch Encrypted Message
            </h3>

            {submitted ? (
              <div className="p-8 bg-primary/5 border border-primary/20 rounded-2xl text-center space-y-3 transition-all duration-300">
                <span className="material-symbols-outlined text-primary text-3xl animate-bounce">verified</span>
                <h4 className="text-sm font-bold text-white">Payload Transmitted Successfully</h4>
                <p className="text-xs text-white/40 max-w-xs mx-auto">
                  Your communication has been indexed. A network engineer or account administrator will establish contact shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-white/40 font-medium font-mono uppercase tracking-wider text-[10px]">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Alex Mercer"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.02] focus:bg-white/[0.04] border border-white/5 focus:border-primary/30 rounded-xl px-4 py-3 outline-none text-white transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/40 font-medium font-mono uppercase tracking-wider text-[10px]">Professional Email</label>
                    <input
                      type="email"
                      placeholder="alex@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.02] focus:bg-white/[0.04] border border-white/5 focus:border-primary/30 rounded-xl px-4 py-3 outline-none text-white transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-white/40 font-medium font-mono uppercase tracking-wider text-[10px]">Inquiry Pipeline</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 focus:border-primary/30 rounded-xl px-4 py-3 outline-none text-white transition-all duration-200 font-sans cursor-pointer"
                  >
                    <option value="Technical Support" className="bg-surface text-white">Technical Support & API Help</option>
                    <option value="Enterprise Sales" className="bg-surface text-white">Enterprise Custom Licensing</option>
                    <option value="Node Hardware" className="bg-surface text-white">Decentralized Node Hosting</option>
                    <option value="Other" className="bg-surface text-white">General Inquiries</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/40 font-medium font-mono uppercase tracking-wider text-[10px]">Message Body</label>
                  <textarea
                    rows={5}
                    placeholder="Provide a comprehensive summary of your engineering or pipeline constraints..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.02] focus:bg-white/[0.04] border border-white/5 focus:border-primary/30 rounded-xl px-4 py-3 outline-none text-white transition-all duration-200 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-white/90 transition-all duration-300 text-xs shadow-lg"
                >
                  Transmit Request
                </button>
              </form>
            )}
          </div>

          {/* 2️⃣ Direct Channels & SLA Metrics (Right 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2">
              Direct Communication Gateways
            </h3>

            <div className="space-y-4">
              {contactMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl flex gap-4 items-start hover:border-white/10 transition-colors duration-300"
                >
                  <div className="w-9 h-9 bg-primary/5 text-primary-light border border-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">{method.icon}</span>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-white">{method.title}</h4>
                    <a href={`mailto:${method.detail}`} className="text-sm font-mono font-bold text-primary-light hover:underline block truncate">
                      {method.detail}
                    </a>
                    <p className="text-[11px] text-white/30 font-sans">{method.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SLA Guarantee Note */}
            <div className="p-4 bg-black/20 border border-white/5 rounded-xl flex gap-3 items-center">
              <span className="material-symbols-outlined text-amber-400 text-lg">verified_user</span>
              <p className="text-[11px] text-white/40 leading-relaxed font-sans">
                Enterprise support tickets carry a legal **99.9% Response SLA** layer tracked inside our master status engine.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}