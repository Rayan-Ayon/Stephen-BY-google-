import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  CrownIcon,
  UserIcon,
  CheckIcon,
  XIcon,
  CheckCircleIcon,
} from './icons';
import { PartnershipRequest, getPendingRequests, approvePartnershipRequest } from '../utils/mockDb';

interface MetricCardData {
  label: string;
  value: string | number;
  subValue?: string;
  accent?: 'orange' | 'warning' | 'default';
}

interface ApprovalResult {
  tenantId: string;
  passkey: string;
  email: string;
}

const MetricCard: React.FC<MetricCardData> = ({ label, value, subValue, accent }) => {
  const borderClass =
    accent === 'warning'
      ? 'border-[#FF5500]/30'
      : accent === 'orange'
        ? 'border-[#FF5500]/20'
        : 'border-[#1A1A1A]';

  return (
    <div
      className={`bg-[#0A0A0A] rounded-2xl border ${borderClass} p-5 transition-colors ${
        accent === 'warning' ? 'shadow-[0_0_24px_-8px_rgba(255,85,0,0.15)]' : ''
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
        {value}
      </p>
      {subValue && (
        <p className={`text-sm mt-1 font-medium ${accent === 'orange' ? 'text-[#FF5500]' : 'text-neutral-400'}`}>
          {subValue}
        </p>
      )}
    </div>
  );
};

const PendingTenantRow: React.FC<{
  tenant: PartnershipRequest;
  onApprove: (tenant: PartnershipRequest) => void;
  onDeny: (id: string) => void;
}> = ({ tenant, onApprove, onDeny }) => (
  <motion.tr
    layout
    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
    transition={{ duration: 0.35, ease: 'easeInOut' }}
    className="border-b border-[#1A1A1A] last:border-b-0"
  >
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{tenant.name}</span>
        <span className="text-xs text-neutral-500">{tenant.orgName}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="text-sm text-neutral-300">{tenant.email}</span>
    </td>
    <td className="px-6 py-4">
      <span className="text-sm text-neutral-400">{tenant.phone}</span>
    </td>
    <td className="px-6 py-4">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 bg-neutral-500/10 px-2.5 py-1 rounded-full border border-neutral-500/20">
        Pending Review
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="inline-flex items-center gap-2">
        <button
          onClick={() => onDeny(tenant.id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
                     border border-[#333333] text-neutral-400 hover:border-red-500/50 hover:text-red-400
                     transition-all duration-200"
        >
          <XIcon className="w-4 h-4" />
          Deny
        </button>
        <button
          onClick={() => onApprove(tenant)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold
                     bg-[#FF5500] text-black hover:bg-[#FF6A1A]
                     transition-all duration-200 shadow-[0_0_20px_-6px_rgba(255,85,0,0.4)]"
        >
          <CheckIcon className="w-4 h-4" />
          Approve &amp; Provision Passkey
        </button>
      </div>
    </td>
  </motion.tr>
);

const ApprovalModal: React.FC<{
  result: ApprovalResult;
  onClose: () => void;
}> = ({ result, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={(e) => e.stopPropagation()}
      className="bg-[#0D0D0D] border border-[#333333] rounded-2xl w-full max-w-md p-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircleIcon className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
            Tenant Provisioned
          </h2>
          <p className="text-xs text-neutral-500">Multi-tenant parameters generated</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3.5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold mb-1">
            Admin Email
          </p>
          <p className="text-sm text-white font-medium">
            {result.email}
          </p>
        </div>
        <div className="bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3.5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold mb-1">
            Tenant ID
          </p>
          <p className="text-sm font-mono text-white font-medium tracking-wide">
            {result.tenantId}
          </p>
        </div>
        <div className="bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3.5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold mb-1">
            Encrypted Workspace Passkey
          </p>
          <p className="text-sm font-mono text-[#FF5500] font-bold tracking-wider">
            {result.passkey}
          </p>
        </div>
        <div className="bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3.5 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Status
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
            ACTIVE
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl text-sm font-semibold border border-[#333333] text-neutral-300
                   hover:border-neutral-600 hover:text-white transition-all duration-200"
      >
        Dismiss
      </button>
    </motion.div>
  </motion.div>
);

const SuperAdminView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [approvalResult, setApprovalResult] = useState<ApprovalResult | null>(null);
  const [navIndex, setNavIndex] = useState(0);

  useEffect(() => {
    setRequests(getPendingRequests());
  }, []);

  const handleApprove = (req: PartnershipRequest) => {
    const passkey = approvePartnershipRequest(req.id);
    if (passkey) {
      const orgSlug = req.orgName.replace(/\s+/g, '_').toLowerCase();
      setApprovalResult({
        tenantId: `org_${orgSlug}_${req.id.slice(-4)}`,
        passkey,
        email: req.email,
      });
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    }
  };

  const handleDeny = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const navItems = [
    { icon: <ShieldCheckIcon className="w-4 h-4" />, label: 'Tenant Management' },
    { icon: <CrownIcon className="w-4 h-4" />, label: 'Billing Overview' },
    { icon: <UserIcon className="w-4 h-4" />, label: 'Audit Log' },
  ];

  return (
    <div className="flex h-screen bg-[#000000] text-white">
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col flex-shrink-0">
        <div className="px-6 py-7 border-b border-[#1A1A1A]">
          <h2 className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: "'Lora', serif" }}>
            Stephen
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF5500] font-semibold mt-1.5">
            Super Admin
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => setNavIndex(i)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                navIndex === i
                  ? 'bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20'
                  : 'text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1A1A1A]">
          <button
            onClick={onExit}
            className="w-full text-left text-sm text-neutral-500 hover:text-white transition-colors duration-200 px-1 py-1"
          >
            ← Back to App
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
              Tenant Operations
            </h1>
            <p className="text-sm text-neutral-500 mt-1.5">
              Global workspace provisioning &amp; system health
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <MetricCard
              label="Total Active Corporate Tenants"
              value={24}
            />
            <MetricCard
              label="Aggregated Institutional Seats"
              value="4,850 / 10,000"
            />
            <MetricCard
              label="Global B2B MRR"
              value="$48,200"
              subValue="+12.4% MoM"
              accent="orange"
            />
            <MetricCard
              label="Pending Pipeline Approvals"
              value={requests.length}
              accent="warning"
            />
          </div>

          <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1A1A1A]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                Pending Tenant Verification Queue
              </h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.15em] text-neutral-500 border-b border-[#1A1A1A]">
                  <th className="px-6 py-4 font-semibold">Contact Name</th>
                  <th className="px-6 py-4 font-semibold">Email Address</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {requests.map((req) => (
                    <PendingTenantRow
                      key={req.id}
                      tenant={req}
                      onApprove={handleApprove}
                      onDeny={handleDeny}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-neutral-500">All pending requests resolved.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {approvalResult && (
          <ApprovalModal
            result={approvalResult}
            onClose={() => setApprovalResult(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminView;
