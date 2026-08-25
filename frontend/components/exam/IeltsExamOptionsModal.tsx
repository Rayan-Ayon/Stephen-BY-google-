import React, { useEffect, useState } from 'react';

// ── Inline SVG icons (no lucide-react dependency) ──

interface IconProps {
    size?: number;
    strokeWidth?: number;
    className?: string;
}

const X = ({ size = 20, strokeWidth = 2, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ChevronLeft = ({ size = 20, strokeWidth = 2, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRight = ({ size = 20, strokeWidth = 2, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const Send = ({ size = 20, strokeWidth = 2, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22 11 13 2 9 22 2z" />
    </svg>
);

const Contrast = ({ size = 20, strokeWidth = 2, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" stroke="none" />
    </svg>
);

const ZoomIn = ({ size = 20, strokeWidth = 2, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const Check = ({ size = 20, strokeWidth = 2, className = '' }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// ── Global accessibility (contrast / text size) state ──

type ContrastMode = 'default' | 'inverted' | 'yellow-on-black';
type TextSizeMode = 'regular' | 'large' | 'extra-large';

interface A11yState {
    contrast: ContrastMode;
    textSize: TextSizeMode;
}

let a11yState: A11yState = { contrast: 'default', textSize: 'regular' };

const CONTRAST_CLASS: Record<ContrastMode, string> = {
    'default': '',
    'inverted': 'ielts-contrast-inverted',
    'yellow-on-black': 'ielts-contrast-yellow',
};

const TEXTSIZE_CLASS: Record<TextSizeMode, string> = {
    'regular': '',
    'large': 'ielts-text-large',
    'extra-large': 'ielts-text-xl',
};

const A11Y_CSS = `
html.ielts-contrast-inverted, html.ielts-contrast-inverted * {
  background-color: #000000 !important;
  color: #ffffff !important;
  border-color: #333333 !important;
}
html.ielts-contrast-yellow, html.ielts-contrast-yellow * {
  background-color: #000000 !important;
  color: #facc15 !important;
  border-color: #333333 !important;
}
html.ielts-text-large { font-size: 115% !important; }
html.ielts-text-xl { font-size: 130% !important; }
`;

const A11Y_CLASSES = [
    'ielts-contrast-inverted',
    'ielts-contrast-yellow',
    'ielts-text-large',
    'ielts-text-xl',
];

const applyA11y = () => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    A11Y_CLASSES.forEach((c) => root.classList.remove(c));
    const contrast = CONTRAST_CLASS[a11yState.contrast];
    const textSize = TEXTSIZE_CLASS[a11yState.textSize];
    if (contrast) root.classList.add(contrast);
    if (textSize) root.classList.add(textSize);

    let style = document.getElementById('ielts-a11y-css') as HTMLStyleElement | null;
    if (!style) {
        style = document.createElement('style');
        style.id = 'ielts-a11y-css';
        document.head.appendChild(style);
    }
    style.textContent = A11Y_CSS;
};

const clearA11y = () => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    A11Y_CLASSES.forEach((c) => root.classList.remove(c));
    const style = document.getElementById('ielts-a11y-css');
    if (style) style.remove();
};

const contrastOptions: { mode: ContrastMode; label: string; previewBg: string; previewLine: string }[] = [
    { mode: 'default', label: 'Black on white', previewBg: 'bg-white border-gray-300', previewLine: 'bg-black' },
    { mode: 'inverted', label: 'White on black', previewBg: 'bg-black border-gray-600', previewLine: 'bg-white' },
    { mode: 'yellow-on-black', label: 'Yellow on black', previewBg: 'bg-black border-gray-600', previewLine: 'bg-yellow-400' },
];

const textSizeOptions: { mode: TextSizeMode; label: string }[] = [
    { mode: 'regular', label: 'Regular' },
    { mode: 'large', label: 'Large' },
    { mode: 'extra-large', label: 'Extra large' },
];

// ── Component ──

interface IeltsExamOptionsModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}

const IeltsExamOptionsModal: React.FC<IeltsExamOptionsModalProps> = ({ open, onClose, onSubmit }) => {
    const [view, setView] = useState<'main' | 'contrast' | 'text-size'>('main');
    const [confirmingSubmit, setConfirmingSubmit] = useState(false);

    useEffect(() => {
        if (open) {
            applyA11y();
            setView('main');
            setConfirmingSubmit(false);
        }
    }, [open]);

    useEffect(() => () => clearA11y(), []);

    if (!open) return null;

    const selectContrast = (mode: ContrastMode) => {
        a11yState = { ...a11yState, contrast: mode };
        applyA11y();
    };

    const selectTextSize = (mode: TextSizeMode) => {
        a11yState = { ...a11yState, textSize: mode };
        applyA11y();
    };

    return (
        <div className="absolute inset-0 z-50 w-full h-full bg-white font-sans flex flex-col overflow-y-auto">
            <header className="relative flex items-center justify-center h-14 border-b border-gray-200 bg-white shrink-0">
                {view !== 'main' && (
                    <button
                        onClick={() => setView('main')}
                        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-medium text-black"
                    >
                        <ChevronLeft size={20} /> Options
                    </button>
                )}
                <h1 className="text-lg font-bold text-black">
                    {view === 'main' ? 'Options' : view === 'contrast' ? 'Contrast' : 'Text size'}
                </h1>
                <button
                    onClick={onClose}
                    aria-label="Close options"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
                >
                    <X size={28} strokeWidth={3} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto">
                {view === 'main' && (
                    <div className="max-w-md w-full mx-auto mt-20 px-4">
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                            <button
                                onClick={() => setConfirmingSubmit(true)}
                                className="w-full flex items-center justify-between px-4 py-4 bg-[#D91B42] text-white"
                            >
                                <span className="flex items-center gap-3 text-sm font-semibold">
                                    <Send size={20} /> Go to submission page
                                </span>
                                <ChevronRight size={20} />
                            </button>
                            <button
                                onClick={() => setView('contrast')}
                                className="w-full flex items-center justify-between px-4 py-4 bg-white text-black border-t border-gray-200"
                            >
                                <span className="flex items-center gap-3 text-sm font-medium">
                                    <Contrast size={20} /> Contrast
                                </span>
                                <ChevronRight size={20} />
                            </button>
                            <button
                                onClick={() => setView('text-size')}
                                className="w-full flex items-center justify-between px-4 py-4 bg-white text-black border-t border-gray-200"
                            >
                                <span className="flex items-center gap-3 text-sm font-medium">
                                    <ZoomIn size={20} /> Text size
                                </span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {view === 'contrast' && (
                    <div className="max-w-md w-full mx-auto mt-20 px-4">
                        <div className="border border-gray-300 rounded-md divide-y divide-gray-200">
                            {contrastOptions.map((opt) => (
                                <button
                                    key={opt.mode}
                                    onClick={() => selectContrast(opt.mode)}
                                    className="w-full flex items-center justify-between px-4 py-4 bg-white text-black"
                                >
                                    <span className="flex items-center gap-3 text-sm font-medium">
                                        <span className="w-5 flex items-center justify-center">
                                            {a11yState.contrast === opt.mode && <Check size={20} className="text-[#0072CE]" />}
                                        </span>
                                        {opt.label}
                                    </span>
                                    <span className={`w-12 h-8 rounded border flex flex-col justify-center gap-1 p-1 ${opt.previewBg}`}>
                                        <span className={`h-0.5 rounded ${opt.previewLine}`} />
                                        <span className={`h-0.5 rounded w-2/3 ${opt.previewLine}`} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'text-size' && (
                    <div className="max-w-md w-full mx-auto mt-20 px-4">
                        <div className="border border-gray-300 rounded-md divide-y divide-gray-200">
                            {textSizeOptions.map((opt) => (
                                <button
                                    key={opt.mode}
                                    onClick={() => selectTextSize(opt.mode)}
                                    className="w-full flex items-center gap-3 px-4 py-4 bg-white text-black text-sm font-medium"
                                >
                                    <span className="w-5 flex items-center justify-center">
                                        {a11yState.textSize === opt.mode && <Check size={20} className="text-[#0072CE]" />}
                                    </span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {confirmingSubmit && (
                <div className="absolute inset-0 z-10 bg-white flex items-center justify-center p-6">
                    <div className="max-w-sm w-full border border-gray-300 rounded-md p-6 text-center">
                        <p className="text-base font-semibold text-black mb-6">Go to submission page?</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => {
                                    onSubmit?.();
                                    onClose();
                                }}
                                className="px-5 py-2 rounded-md bg-[#D91B42] text-white text-sm font-semibold"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setConfirmingSubmit(false)}
                                className="px-5 py-2 rounded-md border border-gray-300 text-black text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IeltsExamOptionsModal;
