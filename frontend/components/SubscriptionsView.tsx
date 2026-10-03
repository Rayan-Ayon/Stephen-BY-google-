import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  Sparkles,
  Zap,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  CreditCard,
  Flame,
  Award,
  ArrowRight,
  Tag,
  Lock,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionsViewProps {
  userEmail?: string;
  onNavigate?: (view: string) => void;
}

interface PricingTier {
  id: 'monthly' | 'three_months' | 'six_months';
  name: string;
  badge?: string;
  originalPrice: number;
  discountedPrice: number;
  billingCycle: string;
  perMonthDisplay?: string;
  goldCoins: number;
  highlight?: boolean;
  features: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    originalPrice: 2500,
    discountedPrice: 1980,
    billingCycle: '/ month',
    goldCoins: 600,
    features: [
      'Unlimited AI Mock Evaluations (Listening, Reading, Writing, Speaking)',
      'Detailed Band 9 Diagnostic Reports with Grammar Radar',
      '600 Gold Coins for AI Speaking Partner Real-Time Sessions',
      'Access to Cambridge 15-19 Practice Tests with Answers',
      'Standard Community Peer Support & Daily Missions'
    ]
  },
  {
    id: 'three_months',
    name: 'Pro 3 Months',
    badge: 'MOST POPULAR',
    originalPrice: 6500,
    discountedPrice: 5000,
    billingCycle: '/ 3 months',
    perMonthDisplay: '৳1,667 / mo',
    goldCoins: 1800,
    highlight: true,
    features: [
      'Everything in Pro Monthly',
      '1,800 Gold Coins (Enough for 45+ Full Speaking Simulations)',
      'Priority Faculty Review Queue for Disputed Writing Assessments',
      'Personalized AI Study Roadmap calibrated to Target Exam Date',
      'Farmgate Branch Exclusive Mock Question Vault access'
    ]
  },
  {
    id: 'six_months',
    name: 'Pro 6 Months',
    badge: 'BEST VALUE',
    originalPrice: 9500,
    discountedPrice: 7500,
    billingCycle: '/ 6 months',
    perMonthDisplay: '৳1,250 / mo',
    goldCoins: 3600,
    features: [
      'Everything in Pro 3 Months',
      '3,600 Gold Coins (Full Exam Cycle Immersion)',
      'Direct Faculty Audio Critiques from Senior IELTS Examiners',
      'Unlimited Challenge / Dispute Submission with Rapid Resolution',
      'Guaranteed Band 7.5+ Score Trajectory or Free Retake Plan'
    ]
  }
];

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ userEmail, onNavigate }) => {
  const [selectedTierId, setSelectedTierId] = useState<'monthly' | 'three_months' | 'six_months'>('three_months');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cards'>('bkash');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuickGuideOpen, setIsQuickGuideOpen] = useState(false);

  const selectedTier = PRICING_TIERS.find((t) => t.id === selectedTierId) || PRICING_TIERS[1];

  const handleApplyPromo = () => {
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'STEPHEN10') {
      setAppliedPromo('STEPHEN10');
      setDiscountPercent(10);
      toast.success('Promo code STEPHEN10 applied: 10% discount!');
    } else if (clean === 'FARMGATE' || clean === 'UAIU20') {
      setAppliedPromo(clean);
      setDiscountPercent(15);
      toast.success(`Promo code ${clean} applied: 15% VIP discount!`);
    } else {
      toast.error('Invalid promo code. Try STEPHEN10');
    }
  };

  const rawPrice = selectedTier.discountedPrice;
  const finalPrice = Math.round(rawPrice * (1 - discountPercent / 100));

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        `🎉 Successfully upgraded to ${selectedTier.name}! ${selectedTier.goldCoins} Gold Coins added to your account.`
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-rose-500/30 selection:text-white">
      {/* 1. Header & Navigation */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222732]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('overview') : (window.location.hash = '#overview')}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              Overview
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Subscriptions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <span>Billing &amp; Subscriptions</span>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              B2C Student Portal
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsQuickGuideOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181E] hover:bg-[#1C212B] border border-[#222732] text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-rose-500" />
          <span>Quick guide</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto pt-6 space-y-8">
        {/* 2. Active Plan Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#15181E] via-[#1A1F29] to-[#15181E] border border-[#222732] p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-rose-900/40 border border-rose-400/30 flex-shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    STEPHEN IELTS PRO
                  </h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Free - No expiry
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                  You are currently on the Stephen Free Academic Tier with baseline mock tests. Upgrade to unlock full Band 9 diagnostic evaluations, instant faculty dispute reviews, and AI Speaking simulations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Available Balance</p>
                <p className="text-lg font-black text-amber-400 flex items-center justify-end gap-1.5 font-mono">
                  <span>🪙</span>
                  <span>120 Gold Coins</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 3-Tier Pricing Architecture */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Select Your Academic Plan</h3>
              <p className="text-xs text-slate-400">Cancel or switch tiers anytime. All plans include 2026 Cambridge 19 syllabus updates.</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full w-fit">
              ✓ Save up to 23% on multi-month access
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#181C24] border-rose-500 ring-2 ring-rose-500/20 shadow-2xl scale-[1.01]'
                      : 'bg-[#15181E] border-[#222732] hover:border-slate-600 hover:bg-[#181C23]'
                  }`}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md shadow-rose-950/60 border border-rose-400/40">
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{tier.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400 font-bold">
                          <span>🪙</span>
                          <span>Includes {tier.goldCoins.toLocaleString()} Gold Coins</span>
                        </div>
                      </div>

                      {/* Radio Checkmark */}
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-rose-600 border-rose-500 text-white shadow-xs'
                            : 'border-slate-600 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6 pb-6 border-b border-[#222732] space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white font-mono">
                          ৳{tier.discountedPrice.toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold text-slate-500 line-through font-mono">
                          ৳{tier.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-medium text-slate-400">{tier.billingCycle}</span>
                      </div>
                      {tier.perMonthDisplay && (
                        <p className="text-xs font-semibold text-rose-400">{tier.perMonthDisplay}</p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included In Plan:</p>
                      <ul className="space-y-2.5">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                            <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#222732]">
                    <div className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                        : 'bg-[#0D0F12] text-slate-400 border border-[#222732]'
                    }`}>
                      {isSelected ? '✓ Selected Tier' : 'Click to Select'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Localized Payment Processing Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Payment Method Selector (Col-7) */}
          <div className="lg:col-span-7 bg-[#15181E] border border-[#222732] rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Select Payment Gateway</h3>
              <p className="text-xs text-slate-400">Instant activation across all Bangladesh Mobile Financial Services and International Cards.</p>
            </div>

            <div className="space-y-3">
              {/* bKash Option */}
              <div
                onClick={() => setPaymentMethod('bkash')}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'bkash'
                    ? 'bg-[#1C2029] border-[#D12053] ring-1 ring-[#D12053]/40'
                    : 'bg-[#0D0F12] border-[#222732] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#D12053]/15 border border-[#D12053]/30 flex items-center justify-center font-bold text-sm text-[#D12053]">
                    bKash
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">bKash MFS Gateway</p>
                      <span className="text-[10px] font-bold text-[#D12053] bg-[#D12053]/15 px-2 py-0.5 rounded-md border border-[#D12053]/30">
                        Fastest • Bangladesh
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Automated prompt with Merchant Direct API</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#D12053] border-[#D12053] text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {paymentMethod === 'bkash' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Cards & Wallets Option */}
              <div
                onClick={() => setPaymentMethod('cards')}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'cards'
                    ? 'bg-[#1C2029] border-rose-500 ring-1 ring-rose-500/40'
                    : 'bg-[#0D0F12] border-[#222732] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">Cards &amp; Wallets</p>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                        Global
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Visa, Mastercard, Amex, Apple Pay</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'cards'
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {paymentMethod === 'cards' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Promo Code Input Box */}
            <div className="pt-4 border-t border-[#222732] space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                <span>Promo Code / Scholarship Voucher</span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. STEPHEN10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-[#0D0F12] border border-[#222732] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-rose-600 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                  <span>✓ Promo code <strong>{appliedPromo}</strong> applied ({discountPercent}% discount)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedPromo(null);
                      setDiscountPercent(0);
                      setPromoCode('');
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Summary & Solid Crimson CTA (Col-5) */}
          <div className="lg:col-span-5 bg-[#15181E] border border-[#222732] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight">Order Summary</h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Plan:</span>
                  <span className="font-bold text-white">{selectedTier.name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Duration / Cycle:</span>
                  <span className="font-mono text-slate-200">{selectedTier.billingCycle}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Included Gold Coins:</span>
                  <span className="font-bold text-amber-400 font-mono">+{selectedTier.goldCoins.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-400 line-through">৳{selectedTier.originalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Tier Special Discount:</span>
                  <span className="font-mono">-৳{(selectedTier.originalPrice - selectedTier.discountedPrice).toLocaleString()}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Promo Discount ({discountPercent}%):</span>
                    <span className="font-mono">-৳{(rawPrice - finalPrice).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#222732] flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">Total Payable:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-rose-400 font-mono">
                      ৳{finalPrice.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono">BDT • All taxes included</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solid Crimson Red Action Button */}
            <div className="space-y-3 pt-4 border-t border-[#222732]">
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-sm tracking-wide transition-all shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting to {paymentMethod === 'bkash' ? 'bKash Gateway' : 'Payment Server'}...
                  </span>
                ) : (
                  <>
                    <span>
                      Pay with {paymentMethod === 'bkash' ? 'bKash' : 'Card'} — ৳{finalPrice.toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Enterprise Guarantee Footer */}
              <div className="text-center space-y-1">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>256-bit SSL Encrypted • Instant Activation • Cancel Anytime</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Official Stephen Academic University Ecosystem
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Guide Modal */}
      {isQuickGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#15181E] border border-[#222732] rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-500" />
                <span>Subscription &amp; Plans Guide</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsQuickGuideOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-[#0D0F12] border border-[#222732] rounded-xl space-y-1">
                <h4 className="font-bold text-white text-xs">🪙 What are Gold Coins?</h4>
                <p className="text-slate-400">
                  Gold Coins power live AI Speaking voice simulations and high-compute multi-agent essay evaluations. Pro plans deposit generous monthly coin allowances with zero rollover expiration.
                </p>
              </div>

              <div className="p-3 bg-[#0D0F12] border border-[#222732] rounded-xl space-y-1">
                <h4 className="font-bold text-white text-xs">📱 How does bKash payment work?</h4>
                <p className="text-slate-400">
                  Clicking the Pay with bKash CTA initiates the official bKash Merchant interface. Your account is automatically upgraded within 3 seconds of pin confirmation.
                </p>
              </div>

              <div className="p-3 bg-[#0D0F12] border border-[#222732] rounded-xl space-y-1">
                <h4 className="font-bold text-white text-xs">🚩 What is the Faculty Dispute Queue?</h4>
                <p className="text-slate-400">
                  Pro subscribers have direct access to challenge AI mock scores. Senior IELTS faculty provide 50/50 split-screen review, score calibration, and recorded voice feedback within 24 hours.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsQuickGuideOpen(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsView;
