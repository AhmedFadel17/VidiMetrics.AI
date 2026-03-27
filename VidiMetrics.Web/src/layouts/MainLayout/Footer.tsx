export default function Footer() {
  return (
    <footer className="w-full pt-20 pb-10 px-8 bg-[#0b1326] border-t border-white/5">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4 space-y-6">
            <div className="text-white font-headline font-bold text-2xl tracking-tight">
              VidiMetrics<span className="text-primary-light">.Ai</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-body">
              The Cinematic Observer. Empowering creators with AI-driven storytelling and precision YouTube analytics.
            </p>
            <div className="flex items-center gap-4">
               {['twitter', 'instagram', 'discord', 'youtube'].map((social) => (
                 <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/50 transition-all">
                   <i className={`fab fa-${social} text-sm`}></i>
                 </a>
               ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white text-xs font-label uppercase tracking-widest font-bold">Product</h4>
            <ul className="space-y-4 text-sm text-white/40 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Storyboarder</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white text-xs font-label uppercase tracking-widest font-bold">Resources</h4>
            <ul className="space-y-4 text-sm text-white/40 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Creator Blog</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white text-xs font-label uppercase tracking-widest font-bold">Company</h4>
            <ul className="space-y-4 text-sm text-white/40 font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
            © 2024 VIDIMETRICS.AI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/20 font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
