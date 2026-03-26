export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 mt-auto bg-[#0b1326] border-t border-[#dae2fd]/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-screen-2xl mx-auto">
        <div className="font-['Space_Grotesk'] text-[#ddb7ff] font-bold text-xl">
          VidiMetrics.Ai
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-['Inter'] text-xs uppercase tracking-widest text-[#dae2fd]/40">
          <a className="hover:text-[#ddb7ff] transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-[#ddb7ff] transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-[#ddb7ff] transition-colors" href="#">Contact Support</a>
          <a className="hover:text-[#ddb7ff] transition-colors" href="#">Twitter</a>
          <a className="hover:text-[#ddb7ff] transition-colors" href="#">LinkedIn</a>
        </div>
        <div className="font-['Inter'] text-xs uppercase tracking-widest text-[#dae2fd]/40">
          © 2024 VidiMetrics.Ai. The Cinematic Observer.
        </div>
      </div>
    </footer>
  )
}
