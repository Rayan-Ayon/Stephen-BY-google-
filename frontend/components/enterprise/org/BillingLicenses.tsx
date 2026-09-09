"use client";

import { useState } from "react";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

interface Plan {
  name: string;
  price: number;
  features: string[];
  isCurrent: boolean;
}

const invoices: Invoice[] = [
  { id: "INV-2024-089", date: "Sep 1, 2024", amount: 2400, status: "paid" },
  { id: "INV-2024-090", date: "Sep 5, 2024", amount: 1800, status: "pending" },
  { id: "INV-2024-091", date: "Sep 8, 2024", amount: 3200, status: "pending" },
];

const plans: Plan[] = [
  {
    name: "Starter",
    price: 99,
    features: [
      "Up to 20 students",
      "Basic AI tutoring",
      "Email support",
      "5 practice tests/mo",
    ],
    isCurrent: false,
  },
  {
    name: "Professional",
    price: 249,
    features: [
      "Up to 100 students",
      "Advanced AI coaching",
      "Priority support",
      "Unlimited practice tests",
      "Analytics dashboard",
    ],
    isCurrent: true,
  },
  {
    name: "Enterprise",
    price: 499,
    features: [
      "Unlimited students",
      "Custom AI models",
      "Dedicated account manager",
      "Unlimited practice tests",
      "Advanced analytics",
      "SSO integration",
      "API access",
    ],
    isCurrent: false,
  },
];

const statusConfig: Record<
  Invoice["status"],
  { label: string; icon: string; bg: string; text: string }
> = {
  paid: {
    label: "Paid",
    icon: "✅",
    bg: "bg-[#10B981]/15",
    text: "text-[#10B981]",
  },
  pending: {
    label: "Pending",
    icon: "⏳",
    bg: "bg-[#F59E0B]/15",
    text: "text-[#F59E0B]",
  },
  overdue: {
    label: "Overdue",
    icon: "❌",
    bg: "bg-[#EF4444]/15",
    text: "text-[#EF4444]",
  },
};

export default function BillingLicenses() {
  const [autoTopUp, setAutoTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("50");

  const metrics = [
    { icon: "💳", label: "Monthly Revenue", value: "$12,450" },
    { icon: "🪙", label: "AI Coins Consumed", value: "45,200" },
    { icon: "📦", label: "Active Subscriptions", value: "142" },
    { icon: "⚠️", label: "Pending Invoices", value: "3" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0D] p-8">
      <header className="mb-8">
        <h1 className="text-xl font-semibold tracking-wide text-[#F3F4F6] uppercase">
          Node Settings{" "}
          <span className="text-[#565E6D] mx-2">//</span> Billing &amp;
          Enterprise Licenses
        </h1>
      </header>

      <section className="grid grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-[#1E2026] bg-[#121316] p-5"
          >
            <div className="flex items-center gap-2 text-[#8E95A3] text-sm mb-2">
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </div>
            <div className="text-2xl font-bold text-[#F3F4F6]">{m.value}</div>
          </div>
        ))}
      </section>

      <div className="flex gap-6 mb-10">
        <div className="flex-[2] rounded-xl border border-[#1E2026] bg-[#121316] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1E2026]">
            <h2 className="text-base font-semibold text-[#F3F4F6]">
              Invoice Ledger
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2026] text-[#8E95A3] text-left">
                <th className="px-6 py-3 font-medium">Invoice ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const s = statusConfig[inv.status];
                return (
                  <tr
                    key={inv.id}
                    className="border-b border-[#1E2026] last:border-0 hover:bg-[#181A20] transition-colors"
                  >
                    <td className="px-6 py-4 text-[#F3F4F6] font-mono text-xs">
                      {inv.id}
                    </td>
                    <td className="px-6 py-4 text-[#8E95A3]">{inv.date}</td>
                    <td className="px-6 py-4 text-[#F3F4F6] font-semibold">
                      ${inv.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
                      >
                        {s.icon} {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {inv.status === "paid" ? (
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#1E2026] bg-[#181A20] text-[#F3F4F6] hover:bg-[#1E2026] transition-colors">
                          Download
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#1E2026] bg-[#181A20] text-[#F3F4F6] hover:bg-[#1E2026] transition-colors">
                          Send Reminder
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex-1 space-y-4">
          <div className="rounded-xl border border-[#1E2026] bg-[#121316] p-5">
            <h2 className="text-base font-semibold text-[#F3F4F6] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-[#F04438] text-white text-sm font-medium hover:bg-[#FF4D4D] transition-colors">
                <span>🧾</span> Generate Invoice
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-[#1E2026] bg-[#181A20] text-[#F3F4F6] text-sm font-medium hover:bg-[#1E2026] transition-colors">
                <span>📊</span> Download Report
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-[#1E2026] bg-[#181A20] text-[#F3F4F6] text-sm font-medium hover:bg-[#1E2026] transition-colors">
                <span>🔄</span> Update Payment Method
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#1E2026] bg-[#121316] p-5">
            <h2 className="text-base font-semibold text-[#F3F4F6] mb-4">
              Auto Top-Up
            </h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#8E95A3]">Enable auto top-up</span>
              <button
                onClick={() => setAutoTopUp(!autoTopUp)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  autoTopUp ? "bg-[#10B981]" : "bg-[#565E6D]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    autoTopUp ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
            {autoTopUp && (
              <div className="flex items-center gap-2">
                <span className="text-[#8E95A3] text-sm">$</span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-[#1E2026] bg-[#181A20] text-[#F3F4F6] text-sm outline-none focus:border-[#F04438] transition-colors"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-base font-semibold text-[#F3F4F6] mb-4">
          Subscription Plans
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 transition-colors ${
                plan.isCurrent
                  ? "border-[#F04438] bg-[#121316]"
                  : "border-[#1E2026] bg-[#121316] hover:bg-[#181A20]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#F3F4F6]">
                  {plan.name}
                </h3>
                {plan.isCurrent && (
                  <span className="px-2.5 py-1 rounded-full bg-[#F04438]/15 text-[#F04438] text-xs font-medium">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="mb-5">
                <span className="text-3xl font-bold text-[#F3F4F6]">
                  ${plan.price}
                </span>
                <span className="text-[#8E95A3] text-sm">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-[#8E95A3]"
                  >
                    <span className="text-[#10B981] mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.isCurrent ? (
                <button className="w-full py-2.5 rounded-lg border border-[#1E2026] bg-[#181A20] text-[#8E95A3] text-sm font-medium cursor-default">
                  Current Plan
                </button>
              ) : (
                <button className="w-full py-2.5 rounded-lg border border-[#1E2026] bg-[#181A20] text-[#F3F4F6] text-sm font-medium hover:bg-[#1E2026] transition-colors">
                  Select Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
