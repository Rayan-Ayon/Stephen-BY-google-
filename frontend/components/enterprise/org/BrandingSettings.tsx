"use client";

import { useState } from "react";

type Tab = "theme" | "logo" | "domain" | "certificate";
type FontFamily = "Inter" | "Poppins" | "Roboto";
type LogoSize = "Small" | "Medium" | "Large";

const TABS: { key: Tab; label: string }[] = [
  { key: "theme", label: "Theme" },
  { key: "logo", label: "Logo" },
  { key: "domain", label: "Domain" },
  { key: "certificate", label: "Certificate" },
];

const FONTS: FontFamily[] = ["Inter", "Poppins", "Roboto"];
const LOGO_SIZES: LogoSize[] = ["Small", "Medium", "Large"];

const CERT_TEMPLATES = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
];

export default function BrandingSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("theme");
  const [primaryColor, setPrimaryColor] = useState("#FF4D4D");
  const [secondaryColor, setSecondaryColor] = useState("#1E2026");
  const [bgColor, setBgColor] = useState("#0A0B0D");
  const [fontFamily, setFontFamily] = useState<FontFamily>("Inter");
  const [logoSize, setLogoSize] = useState<LogoSize>("Medium");
  const [customDomain, setCustomDomain] = useState("learn.myinstitute.com");
  const [certTemplate, setCertTemplate] = useState("classic");
  const [issuedBy, setIssuedBy] = useState("");

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 lg:p-8 font-sans">
      <h1 className="text-sm font-semibold tracking-[0.15em] text-[#8E95A3] mb-8 uppercase">
        NODE SETTINGS // WHITE-LABEL &amp; INSTITUTE BRANDING
      </h1>

      <div className="flex items-center gap-1 border-b border-[#1E2026] mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-[#F3F4F6]"
                : "text-[#565E6D] hover:text-[#8E95A3]"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF4D4D]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "theme" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[#121316] border border-[#1E2026] rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-[#1E2026] cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="bg-[#0A0B0D] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm font-mono text-[#F3F4F6] w-32 focus:outline-none focus:border-[#8E95A3]"
                  />
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-[#1E2026] cursor-pointer"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="bg-[#0A0B0D] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm font-mono text-[#F3F4F6] w-32 focus:outline-none focus:border-[#8E95A3]"
                  />
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-[#1E2026] cursor-pointer"
                    style={{ backgroundColor: bgColor }}
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="bg-[#0A0B0D] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm font-mono text-[#F3F4F6] w-32 focus:outline-none focus:border-[#8E95A3]"
                  />
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                  Font Family
                </label>
                <div className="flex gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={font}
                      onClick={() => setFontFamily(font)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        fontFamily === font
                          ? "bg-[#FF4D4D]/10 border-[#FF4D4D]/30 text-[#FF4D4D]"
                          : "bg-[#0A0B0D] border-[#1E2026] text-[#8E95A3] hover:bg-[#181A20]"
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
              Preview
            </label>
            <div
              className="rounded-xl border border-[#1E2026] p-6"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="rounded-lg p-5 space-y-4"
                style={{ backgroundColor: secondaryColor }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-md"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <p
                    className="text-sm font-bold"
                    style={{ fontFamily, color: "#F3F4F6" }}
                  >
                    Institute Portal
                  </p>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ fontFamily, color: "#8E95A3" }}
                >
                  Your branded learning platform preview.
                </p>
                <button
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "logo" && (
        <div className="max-w-xl space-y-6">
          <div className="bg-[#121316] border border-[#1E2026] rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                Upload Logo
              </label>
              <div className="border-2 border-dashed border-[#1E2026] rounded-xl p-10 flex flex-col items-center justify-center gap-3 hover:border-[#8E95A3] transition-colors cursor-pointer">
                <svg
                  className="w-8 h-8 text-[#565E6D]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-sm text-[#8E95A3]">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-[#565E6D]">
                  SVG, PNG, JPG (max 2MB)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                Current Logo
              </label>
              <div className="w-40 h-24 rounded-lg bg-[#181A20] border border-[#1E2026] flex items-center justify-center">
                <span className="text-xs text-[#565E6D]">No logo</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                Logo Size
              </label>
              <div className="flex gap-2">
                {LOGO_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setLogoSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      logoSize === size
                        ? "bg-[#FF4D4D]/10 border-[#FF4D4D]/30 text-[#FF4D4D]"
                        : "bg-[#0A0B0D] border-[#1E2026] text-[#8E95A3] hover:bg-[#181A20]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "domain" && (
        <div className="max-w-xl space-y-6">
          <div className="bg-[#121316] border border-[#1E2026] rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                Custom Domain
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="learn.myinstitute.com"
                className="w-full bg-[#0A0B0D] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder-[#565E6D] focus:outline-none focus:border-[#8E95A3]"
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#1E2026]">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8E95A3] uppercase tracking-wider font-semibold">
                  SSL Status
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-sm text-[#10B981] font-medium">
                  SSL Active
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8E95A3] uppercase tracking-wider font-semibold">
                  DNS Verification
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-sm text-[#10B981] font-medium">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "certificate" && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-[#121316] border border-[#1E2026] rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                Certificate Template
              </label>
              <div className="grid grid-cols-3 gap-4">
                {CERT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setCertTemplate(tpl.id)}
                    className={`rounded-lg border p-4 flex flex-col items-center gap-3 transition-colors ${
                      certTemplate === tpl.id
                        ? "border-[#FF4D4D]/50 bg-[#FF4D4D]/5"
                        : "border-[#1E2026] bg-[#0A0B0D] hover:bg-[#181A20]"
                    }`}
                  >
                    <div className="w-full aspect-[4/3] rounded-md bg-[#181A20] border border-[#1E2026] flex items-center justify-center">
                      <span className="text-xs text-[#565E6D]">{tpl.label}</span>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        certTemplate === tpl.id
                          ? "text-[#FF4D4D]"
                          : "text-[#8E95A3]"
                      }`}
                    >
                      {tpl.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#565E6D] uppercase tracking-wider font-semibold mb-3">
                Issued By
              </label>
              <input
                type="text"
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                placeholder="e.g. Global IELTS Academy"
                className="w-full bg-[#0A0B0D] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder-[#565E6D] focus:outline-none focus:border-[#8E95A3]"
              />
            </div>

            <div>
              <button className="px-5 py-2.5 rounded-lg bg-[#181A20] border border-[#1E2026] text-[#8E95A3] text-sm font-semibold hover:bg-[#1E2026] hover:text-[#F3F4F6] transition-colors">
                Preview Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-[#1E2026]">
        <button className="bg-[#F04438] hover:bg-[#FF4D4D] text-white text-sm font-semibold px-8 py-3 rounded-lg transition-colors">
          Save Branding Settings
        </button>
      </div>
    </div>
  );
}
