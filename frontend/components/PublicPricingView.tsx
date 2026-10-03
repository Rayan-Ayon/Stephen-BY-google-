import React, { useState } from 'react';
import { Navbar } from './Navbar';
import Footer from './Footer';
import { Theme, AuthType } from '../App';
import { Check, X, ShieldCheck, Zap, Sparkles, Building2, HelpCircle } from 'lucide-react';

interface PublicPricingViewProps {
  theme?: Theme;
  toggleTheme?: () => void;
  userEmail?: string;
  onAuth?: (type: AuthType) => void;
  onStartLearning?: (view?: string) => void;
  onNavigate?: (path: string) => void;
}

export const PublicPricingView: React.FC<PublicPricingViewProps> = ({
  theme = 'dark',
  toggleTheme = () => {},
  userEmail,
  onAuth = () => {},
  onStartLearning = () => {},
  onNavigate,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleCta = (planName: string) => {
    if (planName === 'Free') {
      if (userEmail) {
        onStartLearning();
      } else {
        onAuth('signup');
      }
    } else {
      if (userEmail) {
        onStartLearning('subscriptions');
      } else {
        onAuth('signup');
      }
    }
  };

  const faqs = [
    {
      q: 'Can I switch or cancel my plan at any time?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings. There are no lock-in contracts or cancellation penalties.',
    },
    {
      q: 'How does the Mohona Speaking AI evaluation work?',
      a: 'Mohona utilizes low-latency full-duplex speech synthesis and audio transcription to simulate real IELTS examiners across Part 1, Part 2, and Part 3. You receive real-time audio playback and automated Band 9 diagnostic evaluations.',
    },
    {
      q: 'Are Cambridge 7 through 21 test questions authentic?',
      a: 'Yes. All mock materials mirror authentic Cambridge academic standards with genuine audio transcripts, timed exam conditions, and full answer keys.',
    },
    {
      q: 'Do you offer institutional or coaching center pricing?',
      a: 'Yes. If you operate an academy, language institute, or tutor cohort with 20+ students, visit our Enterprise Coaching Center portal for seat allocations and batch management.',
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-rose-500 selection:text-white transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0D0F12] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        userEmail={userEmail}
        onAuth={onAuth}
        onStartLearning={onStartLearning}
        onNavigate={navigateTo}
        isScrolled={true}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold tracking-wide uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              IELTS Dynasty Transparent Pricing
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Target Band 8.5+ With <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                Silicon Valley Precision
              </span>
            </h1>
            <p className={`text-base md:text-lg leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Fair, transparent USD pricing for ambitious test-takers and high-impact candidates worldwide. Zero hidden fees.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className={`mt-8 inline-flex items-center p-1 rounded-xl border shadow-inner ${
              theme === 'dark' ? 'bg-[#15181E] border-[#222732]' : 'bg-slate-200/80 border-slate-300'
            }`}>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#222732] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly Billing
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* 4-Tier Standalone Pricing Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* 1. FREE TIER */}
            <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Free</h3>
                </div>
                <div className="flex items-baseline mb-3">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$0</span>
                  <span className="text-slate-400 text-sm ml-2">/ forever</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Kickstart your prep with 1 free full mock test.
                </p>

                <div className="w-full h-px bg-[#222732] mb-6" />

                <ul className="space-y-3.5 text-xs">
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>1 Full Mock Test/mo</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Cambridge 7–21 Access</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mohona Speaking AI</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Timed Exam Interface</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-500">
                    <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span className="line-through">AI Writing Review</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-500">
                    <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span className="line-through">AI Speaking Review</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCta('Free')}
                  className="w-full py-2.5 rounded-xl bg-[#222732] hover:bg-[#2c3342] text-slate-200 hover:text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Start Free
                </button>
              </div>
            </div>

            {/* 2. PRO TIER */}
            <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Pro</h3>
                </div>
                <div className="flex items-baseline mb-3">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {billingCycle === 'yearly' ? '$12' : '$15'}
                  </span>
                  <span className="text-slate-400 text-sm ml-2">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Complete mock practice with AI writing & speaking reviews.
                </p>

                <div className="w-full h-px bg-[#222732] mb-6" />

                <ul className="space-y-3.5 text-xs">
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>5 Full Mock Tests/mo</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>5 AI Writing Reviews</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>5 AI Speaking Audits</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Section Score Reports</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Cambridge 7–21 Access</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mohona Speaking AI</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCta('Pro')}
                  className="w-full py-2.5 rounded-xl bg-[#222732] hover:bg-[#2c3342] text-slate-200 hover:text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Get Pro
                </button>
              </div>
            </div>

            {/* 3. PLUS TIER (MOST POPULAR) */}
            <div className="rounded-2xl bg-[#181B22] border-2 border-rose-500/80 p-6 flex flex-col justify-between relative shadow-[0_0_40px_rgba(225,29,72,0.15)] hover:border-rose-500 transition-all duration-300">
              {/* Highlight Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-rose-600/30">
                Most Popular
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="text-xl font-bold text-white">Plus</h3>
                </div>
                <div className="flex items-baseline mb-3">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {billingCycle === 'yearly' ? '$28' : '$35'}
                  </span>
                  <span className="text-slate-400 text-sm ml-2">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  5 full mocks with detailed AI reviews & audio feedback.
                </p>

                <div className="w-full h-px bg-rose-500/30 mb-6" />

                <ul className="space-y-3.5 text-xs">
                  <li className="flex items-start gap-2.5 text-white font-medium">
                    <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>5 Full Mock Tests/mo (Any mix)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white font-medium">
                    <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>5 AI Writing Reviews/mo</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white font-medium">
                    <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>5 AI Speaking Audits/mo</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white font-medium">
                    <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Section Score Reports & PDF Exporters</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white font-medium">
                    <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Cambridge 7–21 Access</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-white font-medium">
                    <Check className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Mohona Speaking AI</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCta('Plus')}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Get Plus
                </button>
              </div>
            </div>

            {/* 4. ALPHA TIER */}
            <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Alpha</h3>
                </div>
                <div className="flex items-baseline mb-3">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {billingCycle === 'yearly' ? '$55' : '$69'}
                  </span>
                  <span className="text-slate-400 text-sm ml-2">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Unlimited AI evaluation & priority processing.
                </p>

                <div className="w-full h-px bg-[#222732] mb-6" />

                <ul className="space-y-3.5 text-xs">
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-white">Unlimited Full Mocks</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-white">Unlimited AI Writing</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-white">Unlimited AI Speaking</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Priority AI Queue</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Cambridge 7–21 Access</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mohona Speaking AI</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCta('Alpha')}
                  className="w-full py-2.5 rounded-xl bg-[#222732] hover:bg-[#2c3342] text-slate-200 hover:text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Go Alpha
                </button>
              </div>
            </div>
          </div>

          {/* Security & Guarantee Strip */}
          <div className="max-w-4xl mx-auto rounded-2xl bg-[#15181E]/60 border border-[#222732] p-5 mb-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300">
                256-bit SSL Bank-Grade Security
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#222732]" />
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">
                Instant Automatic Activation
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[#222732]" />
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span className="text-xs font-semibold text-slate-300">
                Cancel Anytime in 1 Click
              </span>
            </div>
          </div>

          {/* Enterprise / Coaching Center Callout Banner */}
          <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[#15181E] via-[#1a1e27] to-[#15181E] border border-rose-500/20 p-8 mb-20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Need 20+ Seats For Your Coaching Center?
                </h4>
                <p className="text-xs text-slate-400">
                  Empower your instructors with cohort telemetry, automated paper essay scanning, and teacher grading overrides.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('/institution/login?type=coaching_center')}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shrink-0 transition-all shadow-md cursor-pointer"
            >
              Explore Institutional OS ➔
            </button>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8 flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#222732] bg-[#15181E] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-sm text-slate-200 flex items-center justify-between hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-500 text-lg">{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#222732]/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer theme={theme} />
    </div>
  );
};

export default PublicPricingView;
