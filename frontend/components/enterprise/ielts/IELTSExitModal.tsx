import React from 'react';

interface IELTSExitModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const IELTSExitModal: React.FC<IELTSExitModalProps> = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#141414] p-8 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-4xl mb-4">⚠️</p>
                <h3 className="text-lg font-semibold tracking-tight text-white">Leave Exam?</h3>
                <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
                    Are you sure you want to leave? Your answers will not be saved and this attempt will be discarded.
                </p>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200"
                    >
                        Stay &amp; Continue
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-red-500/20"
                    >
                        Leave Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IELTSExitModal;