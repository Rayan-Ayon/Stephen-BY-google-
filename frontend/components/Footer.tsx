import React from 'react';
import { IeltsDynastyEmblem } from './Navbar';

export const Footer: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'dark' }) => {
  return (
    <footer className="py-16 bg-[#0D0F12] border-t border-[#222732] text-slate-400">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div className="mb-6 md:mb-0 max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#15181E] border border-[#222732] flex items-center justify-center p-1.5 shadow-inner">
                <IeltsDynastyEmblem className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white font-sans tracking-tight">
                IELTS Dynasty
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Next-generation AI academic intelligence engine & coaching OS powering candidate mastery, diagnostic band scoring, and cohort evaluations.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#15181E] border border-[#222732] text-[11px] font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Enterprise AI Evaluation Engine v2.4.0 Live
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 text-xs">
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-300">Ecosystem</h4>
              <a href="#reading" className="block text-slate-400 hover:text-white transition-colors">Cambridge Reading Lab</a>
              <a href="#listening" className="block text-slate-400 hover:text-white transition-colors">Audio Listening Studio</a>
              <a href="#speaking" className="block text-slate-400 hover:text-white transition-colors">Mohona AI Speaking Partner</a>
              <a href="#writing" className="block text-slate-400 hover:text-white transition-colors">Automated Writing Evaluator</a>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-300">Community</h4>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Discord Community</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Engineering Blog</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Invite & Earn</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Careers</a>
            </div>
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-300">Institution</h4>
              <a
                href="/institution/login"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/institution/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="block text-rose-400 hover:text-rose-300 font-semibold transition-colors"
              >
                B2B Coaching Center OS ➔
              </a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-slate-400 hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
        </div>

        {/* ── MANDATORY LEGAL & TRADEMARK DISCLAIMER ── */}
        <div className="w-full border-t border-[#222732] pt-8 mt-12 text-slate-500 text-xs leading-relaxed space-y-3">
          <p className="max-w-5xl mx-auto text-center">
            <strong className="text-slate-400">Legal & Trademark Disclaimer:</strong> IELTS Dynasty is an independent educational platform, AI assessment tool, and coaching operations system. IELTS Dynasty is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by Cambridge University Press & Assessment, the British Council, or IDP: IELTS Australia. All official IELTS® trademarks belong to their respective owners. Mock test materials and Cambridge practice questions are provided strictly for research, practice, and diagnostic evaluation purposes.
          </p>
          <p className="text-center text-slate-600">
            © {new Date().getFullYear()} IELTS Dynasty Inc. All rights reserved. Enterprise AI Evaluation Engine v2.4.0.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
