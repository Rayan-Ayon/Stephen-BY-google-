import React, { useState } from 'react';

interface SentenceProof {
    id: string;
    type: 'Complex' | 'Compound' | 'Simple';
    structure: 'Relative clause' | 'Contrast clause' | 'Reason clause' | 'None';
    text: string;
}

interface AccuracyError {
    id: string;
    original: string;
    corrected: string;
    fullSentence: {
        before: string;
        erroneous: string;
        replacement: string;
        after: string;
    };
}

const SENTENCE_PROOFS: SentenceProof[] = [
    {
        id: 's1',
        type: 'Complex',
        structure: 'Relative clause',
        text: 'The city, which is known for its beaches, attracts many tourists every year.',
    },
    {
        id: 's2',
        type: 'Complex',
        structure: 'Contrast clause',
        text: 'Although technology has improved life, people should manage screen time more carefully.',
    },
    {
        id: 's3',
        type: 'Compound',
        structure: 'Reason clause',
        text: 'People move to big cities because they want better job opportunities and access to entertainment.',
    },
    {
        id: 's4',
        type: 'Simple',
        structure: 'None',
        text: 'I grew up in a mid-sized coastal city with a calm beach and friendly neighborhoods.',
    },
];

const ACCURACY_ERRORS: AccuracyError[] = [
    {
        id: 'e1',
        original: 'give',
        corrected: 'gives',
        fullSentence: {
            before: 'A big city ',
            erroneous: 'give',
            replacement: 'gives',
            after: ' people better job opportunities.',
        },
    },
];

interface GrammarEvaluationCardProps {
    rangeScore?: number;
    accuracyScore?: number;
    overallScore?: number;
}

const GrammarEvaluationCard: React.FC<GrammarEvaluationCardProps> = ({
    rangeScore = 7.0,
    accuracyScore = 6.0,
    overallScore = 7.0,
}) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isRangeProofOpen, setIsRangeProofOpen] = useState(false);
    const [isAccuracyProofOpen, setIsAccuracyProofOpen] = useState(false);
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
    const [selectedStructureFilter, setSelectedStructureFilter] = useState('All');
    const [showMoreRangeCount, setShowMoreRangeCount] = useState(0);

    const filteredProofs = SENTENCE_PROOFS.filter((p) => {
        const typeMatch = selectedTypeFilter === 'All' || p.type === selectedTypeFilter;
        const structMatch = selectedStructureFilter === 'All' || p.structure === selectedStructureFilter;
        return typeMatch && structMatch;
    });
    const visibleProofs = filteredProofs.slice(0, 2 + showMoreRangeCount);

    const typeCounts = {
        All: SENTENCE_PROOFS.length,
        Complex: SENTENCE_PROOFS.filter((p) => p.type === 'Complex').length,
        Compound: SENTENCE_PROOFS.filter((p) => p.type === 'Compound').length,
        Simple: SENTENCE_PROOFS.filter((p) => p.type === 'Simple').length,
    };

    const structureCounts = {
        All: SENTENCE_PROOFS.length,
        'Relative clause': SENTENCE_PROOFS.filter((p) => p.structure === 'Relative clause').length,
        'Contrast clause': SENTENCE_PROOFS.filter((p) => p.structure === 'Contrast clause').length,
        'Reason clause': SENTENCE_PROOFS.filter((p) => p.structure === 'Reason clause').length,
        None: SENTENCE_PROOFS.filter((p) => p.structure === 'None').length,
    };

    return (
        <div className="border border-blue-500/80 bg-white rounded-2xl p-5 shadow-sm transition-all mb-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900">Grammatical Range and Accuracy</span>
                <span className="border border-blue-500 text-blue-600 font-semibold px-3 py-1 rounded-lg text-sm bg-blue-50/50">{overallScore.toFixed(1)}</span>
            </div>

            {/* Summary */}
            <p className="text-slate-600 text-sm leading-relaxed mt-2">
                You use a useful mix of simple and complex sentence forms. Accuracy is generally controlled, with a few local errors that do not block meaning.
            </p>

            {/* Sub-score chips */}
            <div className="flex items-center gap-4 mt-4 text-xs font-medium text-slate-700">
                <span>
                    Grammatical Range
                    <span className="border border-slate-200 px-2 py-0.5 rounded text-slate-800 bg-white ml-1.5">{rangeScore.toFixed(1)}</span>
                </span>
                <span>
                    Grammatical Accuracy
                    <span className="border border-slate-200 px-2 py-0.5 rounded text-slate-800 bg-white ml-1.5">{accuracyScore.toFixed(1)}</span>
                </span>
            </div>

            {/* Toggle details */}
            <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1 mt-4"
            >
                {isDetailsOpen ? '^ Show details' : 'v Show details'}
            </button>

            {/* Expanded details with timeline */}
            {isDetailsOpen && (
                <div className="relative mt-4 pl-8 space-y-4">
                    <div className="absolute left-[18px] top-4 bottom-4 w-px bg-slate-200" />

                    {/* Grammatical Range child card */}
                    <div className="relative">
                        <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                        <div className="border border-slate-200 rounded-xl p-4 bg-white mb-4 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 text-lg">Grammatical Range</span>
                                <span className="border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-sm font-semibold">{rangeScore.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mt-2">You show a good range of sentence types, including complex clauses and contrast structures.</p>
                            <button
                                onClick={() => setIsRangeProofOpen(!isRangeProofOpen)}
                                className="text-xs text-slate-600 font-medium flex items-center gap-1 cursor-pointer hover:text-blue-600 mt-3"
                            >
                                {isRangeProofOpen ? '^ Show proof' : 'v Show proof'}
                            </button>

                            {isRangeProofOpen && (
                                <div className="mt-4 space-y-4">
                                    {/* Type filter */}
                                    <div>
                                        <span className="text-xs font-semibold text-slate-700 mb-1.5 block">Type</span>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(typeCounts).map(([label, count]) => (
                                                <button
                                                    key={label}
                                                    onClick={() => setSelectedTypeFilter(label)}
                                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                        selectedTypeFilter === label
                                                            ? 'bg-slate-900 text-white'
                                                            : 'bg-slate-100 text-slate-600 cursor-pointer hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {label} {count}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Structure filter */}
                                    <div>
                                        <span className="text-xs font-semibold text-slate-700 mb-1.5 block">Structure</span>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(structureCounts).map(([label, count]) => (
                                                <button
                                                    key={label}
                                                    onClick={() => setSelectedStructureFilter(label)}
                                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                        selectedStructureFilter === label
                                                            ? 'bg-slate-900 text-white'
                                                            : 'bg-slate-100 text-slate-600 cursor-pointer hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {label} {count}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sentence proof cards */}
                                    <div className="space-y-2">
                                        {visibleProofs.map((proof) => (
                                            <div key={proof.id} className="border border-slate-200/80 rounded-xl p-3.5 bg-white space-y-2">
                                                <div className="flex gap-2">
                                                    <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-md">{proof.type}</span>
                                                    {proof.structure !== 'None' && (
                                                        <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-md">{proof.structure}</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed font-normal">{proof.text}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Show more */}
                                    {visibleProofs.length < filteredProofs.length && (
                                        <button
                                            onClick={() => setShowMoreRangeCount((c) => c + 1)}
                                            className="text-xs font-semibold text-blue-600 cursor-pointer text-center py-2 hover:underline w-full"
                                        >
                                            v Show {filteredProofs.length - visibleProofs.length} more
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Grammatical Accuracy child card */}
                    <div className="relative">
                        <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                        <div className="border border-slate-200 rounded-xl p-4 bg-white mb-4 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 text-lg">Grammatical Accuracy</span>
                                <span className="border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-sm font-semibold">{accuracyScore.toFixed(1)}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mt-2">Grammar errors are limited and mostly occur in word form or article choice.</p>
                            <button
                                onClick={() => setIsAccuracyProofOpen(!isAccuracyProofOpen)}
                                className="text-xs text-slate-600 font-medium flex items-center gap-1 cursor-pointer hover:text-blue-600 mt-3"
                            >
                                {isAccuracyProofOpen ? '^ Show proof' : 'v Show proof'}
                            </button>

                            {isAccuracyProofOpen && (
                                <div className="mt-4 space-y-3">
                                    {/* Error rate card */}
                                    <div className="border border-slate-200 rounded-lg p-3.5 flex justify-between items-center bg-white">
                                        <span className="text-sm font-medium text-slate-700">Error rate</span>
                                        <span className="text-sm font-bold text-slate-900">2%</span>
                                    </div>

                                    {/* Suggested fix card */}
                                    <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
                                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Suggested Fix</span>
                                        <div className="text-sm text-slate-700 leading-relaxed">
                                            {ACCURACY_ERRORS.map((err) => (
                                                <span key={err.id}>
                                                    {err.fullSentence.before}
                                                    <span className="bg-red-100 text-red-600 line-through px-1.5 py-0.5 rounded text-xs font-medium mx-0.5">{err.fullSentence.erroneous}</span>
                                                    <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-medium mx-0.5">{err.fullSentence.replacement}</span>
                                                    {err.fullSentence.after}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GrammarEvaluationCard;
