
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

type Stage = 'idle' | 'scanning' | 'done';

interface MockSample {
    id: string;
    label: string;
    task: string;
    transcription: string;
}

const MOCK_SAMPLES: MockSample[] = [
    {
        id: 'sample-task2',
        label: 'Sample 1 · Task 2 Paper',
        task: 'Task 2',
        transcription:
            'Some people believe that university education should be free for everyone, while others argue that students must contribute to the cost of their studies. In my view, a partially subsidised model offers the fairest balance between equity and accountability.\n\nOn the one hand, free tuition removes the financial barrier that prevents talented candidates from low-income households from accessing higher education. This widens social mobility and strengthens the long-term productivity of the economy as a whole.\n\nOn the other hand, entirely free education places an unsustainable burden on taxpayers and can encourage students to enrol in courses with little labour-market value. A modest contribution, recovered through income-linked repayment, preserves personal responsibility.\n\nIn conclusion, I believe that core undergraduate tuition should be state-funded, but that graduates should repay a fair share once their income exceeds a defined threshold.',
    },
    {
        id: 'sample-task1',
        label: 'Sample 2 · Task 1 Paper',
        task: 'Task 1',
        transcription:
            'The chart illustrates the number of adults participating in seven major sports in one area, comparing figures for 1997 and 2017. Overall, participation in football and rugby rose markedly, whereas cricket declined sharply over the two decades.\n\nIn 1997, cricket was the most popular activity with 26 thousand participants, but by 2017 this had fallen to only 7 thousand. Conversely, football increased from 32 to 48 thousand, making it the leading sport by the later year.\n\nBasketball also grew substantially, from 9 to 23 thousand, while tennis, golf and swimming remained relatively stable. Rugby more than doubled, reaching 49 thousand participants.\n\nIt is clear that team-based outdoor sports gained popularity, while traditional individual sports lost ground.',
    },
];

const WORD_TARGET = 250;
const PARAGRAPH_RE = /\n\s*\n/g;

const QR_PATTERN = [
    '1111111010001111111',
    '1000001011101000001',
    '1011101000101011101',
    '1011101110101011101',
    '1011101001101011101',
    '1000001010101000001',
    '1111111010101111111',
    '0000000011100000000',
    '1101011100011010111',
    '0100010011101000101',
    '1110101110010111010',
    '0001110011010011100',
    '1010011101001010011',
    '1101100010110110110',
    '0010011010101001001',
    '1111111010101111111',
    '1000001011101000001',
    '1011101000101011101',
    '1011101110101011101',
    '1011101001101011101',
    '1000001010101000001',
    '1111111010101111111',
];

const PaperEssayScanner: React.FC = () => {
    const [stage, setStage] = useState<Stage>('idle');
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [ocrText, setOcrText] = useState('');
    const [zoom, setZoom] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [activeSample, setActiveSample] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scanTimer = useRef<number | null>(null);

    const wordCount = ocrText.trim() ? ocrText.trim().split(/\s+/).length : 0;
    const paragraphCount = ocrText.trim() ? ocrText.trim().split(PARAGRAPH_RE).filter(Boolean).length : 0;

    const beginScan = (src: string | null, sampleId: string | null, text: string) => {
        setImageSrc(src);
        setActiveSample(sampleId);
        setOcrText('');
        setSubmitted(false);
        setStage('scanning');
        if (scanTimer.current) window.clearTimeout(scanTimer.current);
        scanTimer.current = window.setTimeout(() => {
            setOcrText(text);
            setStage('done');
        }, 1500);
    };

    const handleFile = (file: File | undefined) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        beginScan(url, null, MOCK_SAMPLES[0].transcription);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const loadSample = (sample: MockSample) => {
        beginScan(null, sample.id, sample.transcription);
    };

    const simulatePhoneCapture = () => {
        beginScan(null, 'sample-task2', MOCK_SAMPLES[0].transcription);
    };

    const rescan = () => {
        if (scanTimer.current) window.clearTimeout(scanTimer.current);
        setStage('idle');
        setImageSrc(null);
        setOcrText('');
        setActiveSample(null);
        setSubmitted(false);
        setZoom(1);
        setRotate(0);
    };

    const submit = () => {
        toast.success('Handwritten essay uploaded & queued for Teacher Evaluation');
        setSubmitted(true);
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-neutral-950 text-neutral-200 p-5 custom-scrollbar">
            {/* Mode Toggle Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="text-cyan-400">📷</span> Paper Essay Capture &amp; OCR Scan
                    </h2>
                    <p className="text-[11px] font-mono text-neutral-500 mt-0.5">MODULE · HANDWRITTEN_INGESTION_ENGINE v2.1</p>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                    OCR ENGINE ONLINE
                </span>
            </div>

            {/* 1. Dual-Input Capture Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                {/* Mode A: QR Camera Sync */}
                <div className="rounded-2xl bg-[#050505] border border-neutral-800 p-5 relative overflow-hidden">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">Mode A · Mobile QR Camera Sync</p>
                    <div className="relative w-36 h-36 mx-auto mb-4 rounded-lg border border-neutral-800 bg-neutral-900 flex items-center justify-center">
                        {/* Mock QR */}
                        <div
                            className="grid gap-px"
                            style={{ gridTemplateColumns: `repeat(${QR_PATTERN[0].length}, 1fr)`, width: 120, height: 120 }}
                        >
                            {QR_PATTERN.flatMap((row, r) =>
                                row.split('').map((cell, c) => (
                                    <div key={`${r}-${c}`} className={cell === '1' ? 'bg-white' : 'bg-transparent'} />
                                ))
                            )}
                        </div>
                        {/* Corner brackets */}
                        {(['left-1 top-1 border-l-2 border-t-2', 'right-1 top-1 border-r-2 border-t-2', 'left-1 bottom-1 border-l-2 border-b-2', 'right-1 bottom-1 border-r-2 border-b-2'] as const).map((pos) => (
                            <span key={pos} className={`absolute ${pos} w-4 h-4 border-cyan-400/70`} />
                        ))}
                        {/* Scanline */}
                        <div className="absolute inset-x-2 top-0 h-px bg-cyan-400/60 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
                    </div>
                    <p className="text-xs text-neutral-400 text-center leading-relaxed mb-4">
                        Scan with mobile camera to launch instant live phone camera scanner.
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                            🟢 Session Paired: Mobile Sync Ready (exp_8921)
                        </span>
                    </div>
                    <button
                        onClick={simulatePhoneCapture}
                        className="w-full py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition-all"
                    >
                        📲 Simulate Phone Camera Capture
                    </button>
                </div>

                {/* Mode B: Desktop Dropzone */}
                <div className="rounded-2xl bg-[#050505] border border-neutral-800 p-5 flex flex-col">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">Mode B · Desktop File Pick-Up</p>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 min-h-[150px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors text-center px-4 ${
                            dragOver ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-700 bg-[#050505] hover:border-emerald-500'
                        }`}
                    >
                        <p className="text-3xl mb-2 opacity-60">📄</p>
                        <p className="text-sm text-neutral-300">Drag &amp; drop your handwritten paper here</p>
                        <p className="text-[11px] font-mono text-neutral-500 mt-2">
                            PDF, PNG, JPG (Handwritten Task 1 &amp; Task 2 papers)
                        </p>
                        <button className="mt-4 px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold hover:border-emerald-500 transition-colors">
                            📁 Browse Handwritten Essay Image
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,image/*"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
                        />
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">Quick Sample Load</p>
                        <div className="grid grid-cols-2 gap-2">
                            {MOCK_SAMPLES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => loadSample(s)}
                                    className={`px-3 py-2 rounded-lg text-[11px] font-mono border transition-colors ${
                                        activeSample === s.id
                                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                                            : 'border-neutral-800 bg-[#0a0a0a] text-neutral-400 hover:border-neutral-600'
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. OCR Processing & Transcription Canvas */}
            {stage !== 'idle' && (
                <div className="rounded-2xl bg-[#050505] border border-neutral-800 p-5 mb-5">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">OCR Ingestion Canvas</p>
                        {stage === 'scanning' && (
                            <span className="flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                Processing OCR Ingestion Engine…
                            </span>
                        )}
                    </div>

                    {stage === 'scanning' ? (
                        <div className="relative h-64 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center">
                            <div className="text-neutral-600 font-mono text-sm">Initialising document ingestion…</div>
                            <div className="absolute inset-x-0 h-0.5 bg-emerald-400/80 shadow-[0_0_16px_rgba(52,211,153,0.9)] animate-[scanline_1.5s_ease-in-out_infinite]" />
                            <style>{`@keyframes scanline {0%{top:8%}50%{top:92%}100%{top:8%}}`}</style>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Left: captured sheet preview */}
                            <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[11px] font-mono text-neutral-400">Captured Sheet</p>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))} className="w-7 h-7 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-emerald-500 transition-colors">−</button>
                                        <button onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))} className="w-7 h-7 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-emerald-500 transition-colors">+</button>
                                        <button onClick={() => setRotate((r) => r + 90)} className="w-7 h-7 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-emerald-500 transition-colors">⟳</button>
                                    </div>
                                </div>
                                <div className="h-72 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt="Captured handwritten paper"
                                            className="max-w-full max-h-full object-contain transition-transform"
                                            style={{ transform: `scale(${zoom}) rotate(${rotate}deg)` }}
                                        />
                                    ) : (
                                        <div
                                            className="w-40 h-52 bg-neutral-100 text-neutral-800 rounded shadow-lg p-3 text-[10px] leading-snug font-serif transition-transform"
                                            style={{ transform: `scale(${zoom}) rotate(${rotate}deg)` }}
                                        >
                                            <p className="font-bold mb-1">Handwritten Essay</p>
                                            <p>Some people believe that university education should be free for everyone…</p>
                                            <div className="mt-2 space-y-1">
                                                <div className="h-1 w-full bg-neutral-300 rounded" />
                                                <div className="h-1 w-5/6 bg-neutral-300 rounded" />
                                                <div className="h-1 w-full bg-neutral-300 rounded" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: OCR transcription editor */}
                            <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 flex flex-col">
                                <p className="text-[11px] font-mono text-neutral-400 mb-3">AI OCR Transcription Editor</p>
                                <textarea
                                    value={ocrText}
                                    onChange={(e) => setOcrText(e.target.value)}
                                    spellCheck={false}
                                    className="flex-1 min-h-[260px] w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-[13px] font-mono leading-relaxed text-emerald-100 focus:outline-none focus:border-emerald-500/60 resize-none custom-scrollbar"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Validation & Ingestion Control Bar */}
            {stage === 'done' && (
                <div className="rounded-2xl bg-[#050505] border border-neutral-800 p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Diagnostics */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                ✓ 98.4% Accuracy (Clear Handwriting)
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
                                🔢 {wordCount} Words
                                {wordCount >= WORD_TARGET && (
                                    <span className="text-emerald-400 font-semibold"> · ✓ Task 2 Minimum Met (250+)</span>
                                )}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
                                📑 {paragraphCount} Paragraphs Auto-Segmented
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={rescan}
                                className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm font-semibold hover:border-cyan-500 transition-colors"
                            >
                                🔄 Re-scan Page
                            </button>
                            <button
                                onClick={submit}
                                disabled={submitted}
                                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                            >
                                {submitted ? '✓ Queued' : '🚀 Submit to AI & Teacher Review Queue'}
                            </button>
                        </div>
                    </div>

                    {submitted && (
                        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[12px] font-mono text-emerald-300">
                            ✓ Handwritten essay uploaded &amp; queued for Teacher Evaluation. Routing to evaluation status…
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #555; }
            `}</style>
        </div>
    );
};

export default PaperEssayScanner;
