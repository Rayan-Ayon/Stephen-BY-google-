import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

export interface DynamicQuestion {
    id: string;
    group_id: string;
    question_number: number;
    prompt: string;
    options?: string[];
    correct_answer?: string | null;
    explanation?: string | null;
}

export interface DynamicQuestionGroup {
    id: string;
    exam_id: string;
    part_number: number;
    group_order: number;
    title: string;
    question_type: string;
    instruction_html: string;
    shared_options?: string[];
    metadata?: any;
    questions: DynamicQuestion[];
}

export interface DynamicRightPanelProps {
    examId: string | null;
    partNumber: 1 | 2 | 3 | number;
    answers: Record<number, string>;
    onAnswer: (questionNumber: number, value: string) => void;
    activeId: number;
    setActiveId: (id: number) => void;
    questionRefs: React.MutableRefObject<Record<number, HTMLElement | null>>;
    locked?: boolean;
    onDynamicLoaded?: (hasGroups: boolean, questions: DynamicQuestion[]) => void;
    fallback?: React.ReactNode;
}

export const DynamicRightPanel: React.FC<DynamicRightPanelProps> = ({
    examId,
    partNumber,
    answers,
    onAnswer,
    activeId,
    setActiveId,
    questionRefs,
    locked = false,
    onDynamicLoaded,
    fallback,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [groups, setGroups] = useState<DynamicQuestionGroup[]>([]);

    useEffect(() => {
        let isMounted = true;

        async function loadDynamicData() {
            if (!examId) {
                setIsLoading(false);
                setGroups([]);
                return;
            }

            setIsLoading(true);
            try {
                // 1. Fetch question groups for the active exam and part
                const { data: groupsData, error: groupsErr } = await supabase
                    .from('question_groups')
                    .select('*')
                    .eq('exam_id', examId)
                    .eq('part_number', Number(partNumber))
                    .order('group_order', { ascending: true });

                if (groupsErr) {
                    console.error('Error fetching question_groups:', groupsErr);
                }

                if (!groupsData || groupsData.length === 0) {
                    if (isMounted) {
                        setGroups([]);
                        setIsLoading(false);
                        onDynamicLoaded?.(false, []);
                    }
                    return;
                }

                // 2. Fetch questions belonging to these groups
                const groupIds = groupsData.map((g: any) => g.id);
                const { data: questionsData, error: questionsErr } = await supabase
                    .from('questions')
                    .select('*')
                    .in('group_id', groupIds)
                    .order('question_number', { ascending: true });

                if (questionsErr) {
                    console.error('Error fetching questions:', questionsErr);
                }

                if (isMounted) {
                    const combinedGroups: DynamicQuestionGroup[] = groupsData.map((g: any) => ({
                        ...g,
                        questions: (questionsData || []).filter((q: any) => q.group_id === g.id),
                    }));

                    setGroups(combinedGroups);
                    setIsLoading(false);
                    onDynamicLoaded?.(true, (questionsData as DynamicQuestion[]) || []);
                }
            } catch (err) {
                console.error('Error in DynamicRightPanel loadDynamicData:', err);
                if (isMounted) {
                    setGroups([]);
                    setIsLoading(false);
                    onDynamicLoaded?.(false, []);
                }
            }
        }

        loadDynamicData();

        return () => {
            isMounted = false;
        };
    }, [examId, partNumber]);

    // Render loading skeleton
    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse py-2">
                <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
                    <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                </div>
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="flex gap-2 flex-wrap pt-2">
                        <div className="h-7 bg-gray-200 rounded-xl w-24"></div>
                        <div className="h-7 bg-gray-200 rounded-xl w-20"></div>
                        <div className="h-7 bg-gray-200 rounded-xl w-28"></div>
                        <div className="h-7 bg-gray-200 rounded-xl w-16"></div>
                    </div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-14 bg-gray-50 border border-gray-100 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    // If no dynamic question groups exist for this exam/part, fallback to static schema
    if (groups.length === 0) {
        return fallback ? <>{fallback}</> : null;
    }

    // Helper to render prompt with embedded [XX] input placeholders
    const renderPromptWithInlineInputs = (prompt: string, defaultQNum: number) => {
        const parts = prompt.split(/(\[\d+\])/g);
        if (parts.length === 1) {
            // No placeholder found, render prompt text and input beneath/alongside
            return (
                <div 
                    ref={(el) => { questionRefs.current[defaultQNum] = el; }}
                    className="space-y-2 py-2"
                    onClick={() => setActiveId(defaultQNum)}
                >
                    <span className="text-sm text-gray-800 leading-relaxed font-medium block">
                        <span className="font-bold mr-1 text-gray-900">{defaultQNum}.</span> {prompt}
                    </span>
                    <input
                        type="text"
                        placeholder={String(defaultQNum)}
                        value={answers[defaultQNum] || ''}
                        onChange={(e) => onAnswer(defaultQNum, e.target.value)}
                        onFocus={() => setActiveId(defaultQNum)}
                        disabled={locked}
                        className="w-full max-w-sm h-8 px-3 border border-gray-300 rounded-md text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                    />
                </div>
            );
        }

        return (
            <span className="text-sm leading-[2.6] text-gray-800">
                {parts.map((part, pIdx) => {
                    const match = part.match(/^\[(\d+)\]$/);
                    if (match) {
                        const qNum = parseInt(match[1], 10);
                        return (
                            <input
                                key={pIdx}
                                id={`q${qNum}`}
                                ref={(el) => { questionRefs.current[qNum] = el; }}
                                type="text"
                                placeholder={String(qNum)}
                                value={answers[qNum] || ''}
                                onChange={(e) => onAnswer(qNum, e.target.value)}
                                onFocus={() => setActiveId(qNum)}
                                disabled={locked}
                                className="inline-block align-middle w-32 h-7 mx-1 px-2.5 border border-gray-300 rounded-md text-center font-mono text-xs text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400 placeholder:font-mono bg-white"
                            />
                        );
                    }
                    return <span key={pIdx}>{part}</span>;
                })}
            </span>
        );
    };

    return (
        <div className="space-y-12">
            {groups.map((group, gIdx) => {
                const qType = (group.question_type || '').toUpperCase();
                const badgeText = qType.replace(/_/g, ' ');

                return (
                    <div 
                        key={group.id || gIdx}
                        className="space-y-6 pb-8 border-b border-gray-100 last:border-b-0"
                    >
                        {/* ── Group Header (Clean section header) ── */}
                        <div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{group.title}</h3>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {badgeText}
                                </span>
                            </div>

                            {group.instruction_html && (
                                <div 
                                    className="text-sm text-gray-700 leading-relaxed [&>strong]:font-bold [&>em]:italic"
                                    dangerouslySetInnerHTML={{ __html: group.instruction_html }}
                                />
                            )}
                        </div>

                        {/* ── Sub-component rendering by question_type ── */}
                        {/* 1. MATCHING_INFO & MATCHING_HEADINGS */}
                        {(qType === 'MATCHING_INFO' || qType === 'MATCHING_HEADINGS') && (
                            <div className="space-y-6">
                                {/* Shared Options Choice Bank */}
                                {group.shared_options && group.shared_options.length > 0 && (
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {group.shared_options.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Question Items with Select Dropdowns */}
                                <div className="space-y-4">
                                    {group.questions.map((q) => (
                                        <div 
                                            key={q.id}
                                            ref={(el) => { questionRefs.current[q.question_number] = el; }}
                                            className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                            onClick={() => setActiveId(q.question_number)}
                                        >
                                            <span className="text-sm text-gray-800 leading-relaxed font-medium max-w-lg">
                                                <span className="font-bold mr-2 text-gray-900">{q.question_number}.</span>
                                                {q.prompt}
                                            </span>
                                            <select
                                                value={answers[q.question_number] || ''}
                                                onChange={(e) => onAnswer(q.question_number, e.target.value)}
                                                onFocus={() => setActiveId(q.question_number)}
                                                disabled={locked}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0 max-w-sm"
                                            >
                                                <option value="">{q.question_number} — Choose ˅</option>
                                                {group.shared_options?.map((opt, optIdx) => (
                                                    <option key={optIdx} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. MATCHING_FEATURES & MATCHING_ENDINGS */}
                        {(qType === 'MATCHING_FEATURES' || qType === 'MATCHING_ENDINGS') && (
                            <div className="space-y-6">
                                {/* Shared Options Choice Bank */}
                                {group.shared_options && group.shared_options.length > 0 && (
                                    <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 shadow-2xs">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">CHOICES</div>
                                        <div className="h-px bg-gray-200 my-2" />
                                        <p className="text-xs text-gray-400 mb-3">Each answer can be used once. Select it again to move it.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {group.shared_options.map((choice, cIdx) => (
                                                <span 
                                                    key={cIdx}
                                                    className="inline-block bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs font-medium cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {choice}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Choice selector mapped to question stems */}
                                <div className="space-y-4">
                                    {group.questions.map((q) => (
                                        <div 
                                            key={q.id}
                                            ref={(el) => { questionRefs.current[q.question_number] = el; }}
                                            className="flex flex-wrap items-baseline justify-between gap-4 py-1"
                                            onClick={() => setActiveId(q.question_number)}
                                        >
                                            <span className="text-sm text-gray-800 leading-relaxed font-medium max-w-md">
                                                <span className="font-bold mr-2 text-gray-900">{q.question_number}.</span>
                                                {q.prompt}
                                            </span>
                                            <select
                                                value={answers[q.question_number] || ''}
                                                onChange={(e) => onAnswer(q.question_number, e.target.value)}
                                                onFocus={() => setActiveId(q.question_number)}
                                                disabled={locked}
                                                className="border border-dashed border-gray-400 rounded-md bg-white px-2.5 py-1 text-xs text-gray-700 cursor-pointer outline-none hover:border-gray-600 focus:border-blue-500 font-medium shrink-0 max-w-sm"
                                            >
                                                <option value="">{q.question_number} — Choose ˅</option>
                                                {group.shared_options?.map((opt, optIdx) => (
                                                    <option key={optIdx} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. TRUE_FALSE_NOT_GIVEN & YES_NO_NOT_GIVEN */}
                        {(qType === 'TRUE_FALSE_NOT_GIVEN' || qType === 'YES_NO_NOT_GIVEN') && (
                            <div className="space-y-6">
                                {group.questions.map((q) => {
                                    const options = group.shared_options && group.shared_options.length > 0
                                        ? group.shared_options
                                        : qType === 'YES_NO_NOT_GIVEN'
                                        ? ['YES', 'NO', 'NOT GIVEN']
                                        : ['TRUE', 'FALSE', 'NOT GIVEN'];

                                    return (
                                        <div 
                                            key={q.id}
                                            ref={(el) => { questionRefs.current[q.question_number] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.question_number)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.question_number}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.prompt}
                                                </span>
                                            </div>

                                            {/* Radio Card Options */}
                                            <div className="space-y-2 pt-1 pl-9">
                                                {options.map((opt) => {
                                                    const isSelected = answers[q.question_number] === opt;
                                                    return (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!locked) onAnswer(q.question_number, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 4. DIAGRAM_COMPLETION, TABLE_COMPLETION, FILL_IN_BLANKS */}
                        {(qType === 'DIAGRAM_COMPLETION' || qType === 'TABLE_COMPLETION' || qType === 'FILL_IN_BLANKS' || qType.includes('COMPLETION')) && (
                            <div className="space-y-4">
                                {/* Optional metadata table columns display */}
                                {group.metadata?.columns && Array.isArray(group.metadata.columns) && group.metadata.columns.length > 0 && (
                                    <div className="overflow-hidden border border-gray-200 rounded-xl mb-4 bg-gray-50/80">
                                        <div 
                                            className="grid divide-x divide-gray-200" 
                                            style={{ gridTemplateColumns: `repeat(${group.metadata.columns.length}, minmax(0, 1fr))` }}
                                        >
                                            {group.metadata.columns.map((col: string, ci: number) => (
                                                <div key={ci} className="px-4 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100/70">
                                                    {col}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Card containing prompts with inline inputs */}
                                <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
                                    {group.questions.map((q) => (
                                        <div key={q.id} className="py-1">
                                            {renderPromptWithInlineInputs(q.prompt, q.question_number)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. MULTIPLE_CHOICE fallback */}
                        {qType === 'MULTIPLE_CHOICE' && (
                            <div className="space-y-6">
                                {group.questions.map((q) => {
                                    const opts = (q.options && q.options.length > 0) ? q.options : (group.shared_options || []);
                                    return (
                                        <div 
                                            key={q.id}
                                            ref={(el) => { questionRefs.current[q.question_number] = el; }}
                                            className="space-y-3"
                                            onClick={() => setActiveId(q.question_number)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">
                                                    {q.question_number}
                                                </span>
                                                <span className="text-sm text-gray-800 leading-relaxed font-normal">
                                                    {q.prompt}
                                                </span>
                                            </div>

                                            <div className="space-y-2 pt-1 pl-9">
                                                {opts.map((opt, optIdx) => {
                                                    const letter = String.fromCharCode(65 + optIdx);
                                                    const isSelected = answers[q.question_number] === opt || answers[q.question_number] === letter;
                                                    return (
                                                        <label
                                                            key={optIdx}
                                                            className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                                                                isSelected 
                                                                    ? 'border-blue-500 bg-blue-50/20 shadow-2xs' 
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!locked) onAnswer(q.question_number, opt);
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                                                                <strong className="mr-1">{letter}.</strong> {opt}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DynamicRightPanel;
