import React, { useImperativeHandle, useRef, useState } from 'react';

export interface HeadingOption {
    id: string;
    text: string;
}

export interface SectionDropzone {
    id: number;
    sectionLabel: string;
}

export interface MultiSelectGroup {
    questionIds: number[];
    prompt: string;
    maxSelections: number;
    options: { id: string; label: string }[];
}

export interface GapFillQuestion {
    questionId: number;
    contextBefore: string;
    contextAfter: string;
}

export const HEADINGS: HeadingOption[] = [
    { id: 'A', text: 'How a maths experiment actually reduced traffic congestion' },
    { id: 'B', text: 'How a concept from one field of study was applied in another' },
    { id: 'C', text: 'A lack of investment in driver training' },
    { id: 'D', text: 'Areas of doubt and disagreement between experts' },
    { id: 'E', text: 'How different countries have dealt with traffic congestion' },
    { id: 'F', text: 'The impact of driver behavior on traffic speed' },
    { id: 'G', text: 'A proposal to take control away from the driver' },
];

export const ANSWER_HEADINGS: Record<string, string> = {
    '14': 'B',
    '15': 'G',
    '16': 'D',
    '17': 'F',
};

export const SECTIONS: (SectionDropzone & { text: string; emphasis: string[] })[] = [
    {
        id: 14,
        sectionLabel: 'Section A',
        text: `Some years ago, when several theoretical physicists, principally Dirk Helbing and Boris Kerner of Stuttgart, Germany, began publishing papers on traffic flow in publications normally read by traffic engineers, they were clearly working outside their usual sphere of investigation. They had noticed that if they simulated the movement of vehicles on a highway, using the equations that describe how the molecules of a gas move, some very strange results emerged. Of course, vehicles do not behave exactly like gas molecules: for example, drivers try to avoid collisions by slowing down when they get too near another vehicle, whereas gas molecules have no such concern. However, the physicists modified the equations to take the differences into account and the overall description of traffic as a flowing gas has proved to be a very good one; the moving-gas model of traffic reproduces many phenomena seen in real-world traffic.

The strangest thing that came out of these equations, however, was the implication that congestion can arise completely spontaneously; no external causes are necessary. Vehicles can be flowing freely along, at a density still well below what the road can handle, and then suddenly gel into a slow-moving ooze. Under the right conditions a brief and local fluctuation in the speed or the distance between vehicles is all it takes to trigger a system-wide breakdown that persists for hours. In fact, the physicists' analysis suggested such spontaneous breakdowns in traffic flow probably occur quite frequently on highways.

Dramatic effects can result from small changes in traffic just as in nature.

Though a decidedly unsettling discovery, this showed striking similarities to the phenomena popularized as 'chaos theory'. This theory has arisen from the understanding that in any complex interacting system which is made of many parts, each part affects the others. Consequently, tiny variations in one part of a complex system can grow in huge but unpredictable ways. This type of dramatic change from one state to another is similar to what happens when a chemical substance changes from a vapor to a liquid. It often happens that water in a cloud remains as a gas even after its temperature and density have reached the point where it could condense into water droplets. However if the vapor encounters a solid surface, even something as small as a speck of dust, condensation can take place and the transition from vapor to liquid finally occurs. Helbing and Kerner see traffic as a complex interacting system. They found that a small fluctuation in traffic density can act as the 'speck of dust' causing a sudden change from freely moving traffic to synchronized traffic, when vehicles in all lanes abruptly slow down and start moving at the same speed, making passing impossible.`,
        emphasis: ['Dramatic effects can result from small changes in traffic just as in nature.'],
    },
    {
        id: 15,
        sectionLabel: 'Section B',
        text: `The physicists have challenged proposals to set a maximum capacity for vehicles on highways. They argue that it may not be enough simply to limit the rate at which vehicles are allowed to enter a highway, rather, it may be necessary to time each vehicle's entry onto a highway precisely to coincide with a temporary drop in the density of vehicles along the road. The aim of doing this would be to smooth out any possible fluctuations in the road conditions that can trigger a change in traffic behavior and result in congestion. They further suggest that preventing breakdowns in the flow of traffic could ultimately require implementing the radical idea that has been suggested from time to time: directly regulating the speed and spacing of individual cars along a highway with central computers and sensors that communicate with each car's engine and brake controls.`,
        emphasis: [],
    },
    {
        id: 16,
        sectionLabel: 'Section C',
        text: `However, research into traffic control is generally centered in civil engineering departments and here the theories of the physicists have been greeted with some skepticism. Civil engineers favor a practical approach to problems and believe traffic congestion is the result of poor road construction (two lanes becoming one lane or dangerous curves), which constricts the flow of traffic. Engineers questioned how well the physicists' theoretical results relate to traffic in the real world. Indeed, some engineering researchers questioned whether elaborate chaos-theory interpretations are needed at all, since at least some of the traffic phenomena the physicists' theories predicted seemed to be similar to observations that had been appearing in traffic engineering literature under other names for years; observations which had straightforward cause-and-effect explanations.`,
        emphasis: [],
    },
    {
        id: 17,
        sectionLabel: 'Section D',
        text: `James Banks, a professor of civil and environmental engineering at San Diego State University in the US, suggested that a sudden slowdown in traffic may have less to do with chaos theory than with driver psychology. As traffic gets heavier and the passing lane gets more crowded, aggressive drivers move to other lanes to try to pass, which also tends to even out the speed between lanes. He also felt that another leveling force is that when a driver in a fast lane brakes a little to maintain a safe distance between vehicles, the shock wave travels back much more rapidly than it would in the other slower lanes, because each following driver has to react more quickly. Consequently as a road becomes congested, the faster moving traffic is the first to slow down.`,
        emphasis: [],
    },
];

export const MULTI_SELECT_GROUPS: MultiSelectGroup[] = [
    {
        questionIds: [18, 19],
        prompt: 'Which TWO of the following are presented as characteristics of traffic in the physicists\u2019 model of flowing gas?',
        maxSelections: 2,
        options: [
            { id: '1-0', label: 'Drivers slow down in order to avoid collisions' },
            { id: '1-1', label: 'Gas molecules actively try to avoid one another' },
            { id: '1-2', label: 'Congestion can arise with no external cause at all' },
            { id: '1-3', label: 'Breakdowns only ever follow a major accident' },
            { id: '1-4', label: 'Roads must be close to full capacity before congestion forms' },
        ],
    },
    {
        questionIds: [20, 21],
        prompt: 'Which TWO criticisms of the physicists\u2019 theories do civil engineers make?',
        maxSelections: 2,
        options: [
            { id: '2-0', label: 'The theoretical results are hard to relate to real-world traffic' },
            { id: '2-1', label: 'The chaos-theory interpretation may not be necessary' },
            { id: '2-2', label: 'The findings have never been published in a peer-reviewed journal' },
            { id: '2-3', label: 'The equations used are mathematically unsound' },
            { id: '2-4', label: 'The physicists have ignored the cost of the technology' },
        ],
    },
    {
        questionIds: [22, 23],
        prompt: 'Which TWO factors does James Banks say cause traffic to slow down on congested roads?',
        maxSelections: 2,
        options: [
            { id: '3-0', label: 'Aggressive drivers change lanes in order to pass' },
            { id: '3-1', label: 'Drivers in the fast lane brake to keep a safe distance' },
            { id: '3-2', label: 'Poor road construction constricts the flow of traffic' },
            { id: '3-3', label: 'Vehicles enter the highway at the wrong moment' },
            { id: '3-4', label: 'Speed limits are set too high for the road conditions' },
        ],
    },
];

export const GROUP_ANSWERS: Record<string, string> = {
    '18': '1-0',
    '19': '1-2',
    '20': '2-1',
    '21': '2-2',
    '22': '3-0',
    '23': '3-1',
};

export const GAP_INTRO = 'Complete the summary below. Choose ONE word from the passage for each answer.';

export const GAP_FILL: GapFillQuestion[] = [
    {
        questionId: 24,
        contextBefore: 'Vehicles moving on a highway were modelled using the equations that describe the motion of the molecules of a',
        contextAfter: '.',
    },
    {
        questionId: 25,
        contextBefore: 'A brief and local',
        contextAfter: 'in the speed or the distance between vehicles is enough to trigger a system-wide breakdown.',
    },
    {
        questionId: 26,
        contextBefore: 'Just as a speck of dust can trigger',
        contextAfter: 'in a cloud, a small fluctuation in traffic density can trigger a sudden change in the flow.',
    },
];

export const GAP_ANSWERS: Record<string, string> = {
    '24': 'gas',
    '25': 'fluctuation',
    '26': 'condensation',
};

const HEADING_SLOTS = ['14', '15', '16', '17'];
const ALL_QUESTION_KEYS = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'];
const TOTAL_QUESTIONS = 13;
const GROUP_MAP: Record<string, string[]> = {
    '18–19': ['18', '19'],
    '20–21': ['20', '21'],
    '22–23': ['22', '23'],
};

export interface PartContentHandle {
    scrollTo: (id: number) => void;
}

export interface Part2ContentProps {
    candidateEmail?: string;
    answers: Record<number, string>;
    onAnswer: (key: number, value: string) => void;
    locked: boolean;
}

export const Part2Content = React.forwardRef<PartContentHandle, Part2ContentProps>(({ candidateEmail, answers, onAnswer, locked }, ref) => {
    const splitAreaRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [split, setSplit] = useState(50);
    const [selectedHeading, setSelectedHeading] = useState<string | null>(null);

    const get = (key: number) => answers[key] || '';
    const usedHeadings = HEADING_SLOTS.map((k) => get(Number(k))).filter(Boolean);
    const answeredCount = ALL_QUESTION_KEYS.filter((k) => answers[Number(k)]).length;

    const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rect = splitAreaRef.current?.getBoundingClientRect();
        if (!rect) return;
        const move = (ev: PointerEvent) => {
            const pct = ((ev.clientX - rect.left) / rect.width) * 100;
            setSplit(Math.min(70, Math.max(30, pct)));
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    };

    const assignHeading = (slotKey: number, headingId: string) => {
        if (locked) return;
        if (headingId === '' || get(slotKey) === headingId) {
            onAnswer(slotKey, '');
            return;
        }
        for (const k of HEADING_SLOTS) {
            const kNum = Number(k);
            if (kNum !== slotKey && get(kNum) === headingId) onAnswer(kNum, '');
        }
        onAnswer(slotKey, headingId);
    };

    const handleDrop = (e: React.DragEvent, slotKey: number) => {
        e.preventDefault();
        const h = e.dataTransfer.getData('text/plain');
        if (h) assignHeading(slotKey, h);
    };

    const selectOption = (group: MultiSelectGroup, optionId: string) => {
        if (locked) return;
        const slot = group.questionIds.find((qid) => get(qid) === optionId);
        if (slot != null) {
            onAnswer(slot, '');
            return;
        }
        const filled = group.questionIds.filter((qid) => answers[qid]);
        if (filled.length >= group.maxSelections) return;
        const free = group.questionIds.find((qid) => !answers[qid]);
        if (free != null) onAnswer(free, optionId);
    };

    const gapChange = (key: number, value: string) => {
        onAnswer(key, value.replace(/\s+/g, ''));
    };

    const navItemFor = (id: number): string => {
        for (const g of MULTI_SELECT_GROUPS) {
            if (g.questionIds.includes(id)) return `${g.questionIds[0]}–${g.questionIds[1]}`;
        }
        return String(id);
    };

    const scrollTo = (id: number) => {
        const item = navItemFor(id);
        if (HEADING_SLOTS.includes(item)) {
            sectionRefs.current[Number(item)]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (GROUP_MAP[item]) {
            itemRefs.current[item]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            itemRefs.current['24–26']?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useImperativeHandle(ref, () => ({ scrollTo }));

    return (
        <div className="h-full w-full min-w-0 flex flex-col bg-white text-neutral-900">
            <div ref={splitAreaRef} className="flex-1 min-h-0 flex">
                <div style={{ width: `${split}%` }} className="h-full min-w-0 flex flex-col">
                    <div className="shrink-0 bg-[#F2F2F2] border-b border-neutral-300 px-4 py-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold">Reading Passage</span>
                        <span className="text-[11px] font-mono text-neutral-500">The Physics of Traffic Behavior</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto bg-white p-5 space-y-8">
                        {SECTIONS.map((section) => (
                            <div key={section.id} ref={(el) => { sectionRefs.current[section.id] = el; }} className="scroll-mt-4">
                                <div
                                    onDrop={(e) => handleDrop(e, section.id)}
                                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                                    onClick={() => { if (selectedHeading) { assignHeading(section.id, selectedHeading); setSelectedHeading(null); } }}
                                    className={`group mb-3 rounded-lg border-2 px-4 py-2.5 flex items-center gap-3 transition-colors cursor-pointer ${
                                        get(section.id) ? 'border-solid border-[#0072CE] bg-[#EAF3FB]' : 'border-dashed border-[#0072CE] bg-[#F7FBFF]'
                                    }`}
                                >
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0072CE] shrink-0">
                                        Q{section.id}
                                    </span>
                                    <span className="text-[13px] flex-1 min-w-0">
                                        {get(section.id) ? (
                                            <span className="text-neutral-800">
                                                <span className="font-mono text-[#0072CE] mr-1">{get(section.id)}.</span>
                                                {HEADINGS.find((h) => h.id === get(section.id))?.text}
                                            </span>
                                        ) : (
                                            <span className="text-neutral-400">
                                                {selectedHeading ? `Click to assign heading ${selectedHeading}` : 'Drop heading here'}
                                            </span>
                                        )}
                                    </span>
                                    {get(section.id) && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); assignHeading(section.id, ''); }}
                                            className="text-neutral-400 hover:text-red-600 text-sm shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                {section.text.split('\n\n').map((para, i) => (
                                    <p
                                        key={i}
                                        className={`text-[15px] leading-relaxed text-neutral-800 mb-3 ${
                                            section.emphasis.includes(para.trim()) ? 'font-semibold text-neutral-900' : ''
                                        }`}
                                    >
                                        {para}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    onPointerDown={startResize}
                    className="w-2 shrink-0 cursor-col-resize select-none bg-neutral-200 border-x border-neutral-300 flex items-center justify-center text-[10px] text-neutral-500 hover:bg-[#0072CE] hover:text-white transition-colors"
                >
                    ↔
                </div>

                <div className="flex-1 h-full min-w-0 flex flex-col">
                    <div className="shrink-0 bg-[#F2F2F2] border-b border-neutral-300 px-4 py-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold">Questions 14–26</span>
                        <span className="text-[11px] font-mono text-neutral-500">{answeredCount}/{TOTAL_QUESTIONS} answered · {candidateEmail || 'farmgate@stephen.ai'}</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto bg-white p-5 space-y-6">
                        <div ref={(el) => { itemRefs.current['headingList'] = el; }} className="rounded-xl border border-neutral-300 bg-[#FAFAFA] p-4 scroll-mt-4">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Questions 14–17 · List of Headings</p>
                            <p className="text-[11px] text-neutral-500 mb-3">Drag a heading into a blue slot on the left, or click a heading then click a slot.</p>
                            <div className="grid grid-cols-1 gap-2">
                                {HEADINGS.map((h) => {
                                    const used = usedHeadings.includes(h.id);
                                    const sel = selectedHeading === h.id;
                                    return (
                                        <button
                                            key={h.id}
                                            draggable
                                            disabled={used}
                                            onDragStart={(e) => e.dataTransfer.setData('text/plain', h.id)}
                                            onClick={() => setSelectedHeading(sel ? null : h.id)}
                                            className={`text-left px-3 py-2 rounded-md border text-[13px] cursor-grab transition-colors ${
                                                used
                                                    ? 'opacity-40 pointer-events-none'
                                                    : sel
                                                        ? 'border-[#0072CE] bg-[#EAF3FB] text-neutral-900'
                                                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#0072CE]'
                                            }`}
                                        >
                                            <span className="font-mono mr-2 text-[#0072CE]">{h.id}.</span>
                                            {h.text}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {MULTI_SELECT_GROUPS.map((group) => {
                            const label = `${group.questionIds[0]}–${group.questionIds[1]}`;
                            const groupFull = group.questionIds.every((qid) => answers[qid]);
                            return (
                                <div key={label} ref={(el) => { itemRefs.current[label] = el; }} className="rounded-xl border border-neutral-300 bg-[#FAFAFA] p-4 scroll-mt-4">
                                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Questions {label}</p>
                                    <p className="text-sm text-neutral-800 mt-1 mb-1">{group.prompt}</p>
                                    <p className="text-[11px] text-[#0072CE] font-semibold mb-3">Choose TWO answers</p>
                                    <div className="space-y-2">
                                        {group.options.map((opt) => {
                                            const slot = group.questionIds.find((qid) => get(qid) === opt.id);
                                            const selected = !!slot;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => selectOption(group, opt.id)}
                                                    className={`w-full flex items-center gap-3 rounded-md border px-3 py-2.5 text-left text-[13px] transition-colors ${
                                                        selected
                                                            ? 'bg-[#D0E8FF] border-[#0072CE] text-neutral-900'
                                                            : groupFull
                                                                ? 'opacity-40 border-neutral-300 bg-white text-neutral-500'
                                                                : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#0072CE]'
                                                    }`}
                                                >
                                                    <span className={`w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center text-[10px] ${
                                                        selected ? 'bg-[#0072CE] border-[#0072CE] text-white' : 'border-neutral-400 text-transparent'
                                                    }`}>
                                                        ✓
                                                    </span>
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={(el) => { itemRefs.current['24–26'] = el; }} className="rounded-xl border border-neutral-300 bg-[#FAFAFA] p-4 scroll-mt-4">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Questions 24–26 · Complete the summary</p>
                            <p className="text-sm text-neutral-800 mt-2 leading-relaxed">{GAP_INTRO}</p>
                            <div className="mt-3 space-y-3">
                                {GAP_FILL.map((q) => (
                                    <p key={q.questionId} className="text-sm text-neutral-800 leading-relaxed">
                                        {q.contextBefore}{' '}
                                        <input
                                            value={get(q.questionId)}
                                            onChange={(e) => gapChange(q.questionId, e.target.value)}
                                            disabled={locked}
                                            maxLength={15}
                                            placeholder="……"
                                            className="w-24 inline-block text-center border-b-2 border-[#0072CE] bg-transparent focus:outline-none focus:bg-[#EAF3FB] rounded-sm px-1 py-0.5 text-neutral-900 placeholder:text-neutral-300 disabled:opacity-50"
                                        />{' '}
                                        {q.contextAfter}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Part2Content;