import React, { useImperativeHandle, useRef, useState } from 'react';
import { type PartContentHandle } from './ReadingPart2';

export const PART3_TITLE = 'Plain English';

export const PART3_PASSAGE = `There is no theoretical limit to the number of special purposes to which language can be put. As society develops new facets, so language is devised to express them. However, the result is often that language becomes very specialised and complex, and complications arise as ordinary people struggle to make sense of it.

Popular anxiety over special uses of language is most markedly seen in the campaigns to promote 'plain' speaking and writing - notably, the Plain English movements of Britain and the USA. The main aim of these campaigns is to attack the use of unnecessarily complicated language ('gobbledegook') by governments, businesses and other authorities whose role puts them in linguistic contact with the general public. The campaigners argue that such language, whether spoken or written, should be replaced by clearer forms of expression.

The movements took shape only in the 1970s, so it is too soon to ascertain their long-term influence on the characteristics of language varieties. But they have certainly played a major part in promoting public awareness of the existence of communication problems, and have influenced many organisations to do something about it. In Britain, the campaign was launched in 1979, by a ritual shredding of government forms in Parliament Square, London. By 1982, the government had published a report telling departments to improve the design of forms, and to abolish those that were unnecessary. By 1985, around 15,700 forms had disappeared and 21,300 had been revised. In the USA, President Carter's Executive Order of March 1978 required regulations to be written in plain English, and although this was revoked by President Reagan in 1981, it promoted a great deal of legislation throughout the country, and an increase in plain English usage amongst corporations and consumers.

Today the Plain English campaigns continue to grow, focusing especially on such everyday consumer literature as forms, official letters, licences, leases, contracts, insurance policies and guarantees. In Britain, annual publicity is given to the Plain English Awards competition, which gives trophies to organisations that have produced the clearest documents, and booby prizes (the Golden Bull Awards) to those whose materials are least intelligible. In the USA, similar interest is shown in the annual Doublespeak Awards, awarded by the National Council of Teachers to 'American public figures who have perpetrated language that is grossly unfactual, deceptive, evasive, euphemistic, confusing or self-contradictory.'

In these cost-conscious days, it is stressed that clear language not only avoids anxiety on the part of the recipient, it also saves time and money. The campaigns have large dossiers of problem cases. In one case, an official government letter provoked so many complaints and questions that a second letter had to be sent to explain the first. In another, an application form was wrongly filled in by 50% of the applicants, which resulted in a considerable outlay of effort in returning and reprocessing the form. In contrast, there are cases of businesses revising their literature to avoid legal jargon, and benefiting from increased sales.

Particular concern is expressed about the ambiguities and omissions found in medical labels. For example, in one pharmaceutical survey, the instruction to 'use sparingly' was misunderstood by 33% of patients. The instruction 'take two tablets four hourly' received a number of interpretations (e.g. to take eight tablets an hour). Related areas of concern include the use of warning labels on household goods (such as disinfectants) and on toys for children.

The instructions accompanying do-it-yourself products are also regularly cited as a source of unnecessary expense or frustration. Few companies seem to test their instructions by having them followed by a first-time user. Often, essential information is omitted, steps in the construction process are taken for granted, and some degree of special knowledge is assumed. This is especially worrying in any fields where failure to follow correct procedures can be dangerous.

Objections to material in plain English have come mainly from the legal profession. Lawyers point to the risk of ambiguity inherent in the use of everyday language for legal or official documents, and draw attention to the need for confidence in legal formulations, which can come only from using language that has been tested in courts over the course of centuries. The campaigners point out that there has been no sudden increase in litigation as a consequence of the increase in plain English materials.

Similarly, professionals in several different fields have defended their use of technical and complex language as being the most precise means of expressing technical or complex ideas. This is undoubtedly true: scientists, doctors, bankers and others need their jargon in order to communicate with each other succinctly and unambiguously. But when it comes to addressing the non-specialist consumer, the campaigners argue, different criteria must apply.`;

export const PART3_ANSWERS: Record<number, string> = {
    27: 'TRUE',
    28: 'NOT GIVEN',
    29: 'FALSE',
    30: 'TRUE',
    31: 'TRUE',
    32: 'NOT GIVEN',
    33: 'NOT GIVEN',
    34: 'legal jargon',
    35: 'increased sales',
    36: 'frustration',
    37: 'first-time user',
    38: 'essential',
    39: 'special knowledge',
    40: 'legal formulations',
};

export interface Part3TFNGQuestion {
    id: number;
    statement: string;
    answer: 'true' | 'false' | 'ng';
}

export const PART3_TFNG: Part3TFNGQuestion[] = [
    { id: 27, statement: 'The Plain English campaigns are concerned with the language officials use when communicating with ordinary people.', answer: 'true' },
    { id: 28, statement: 'Campaigners found it difficult to talk to government officials.', answer: 'ng' },
    { id: 29, statement: 'A change of president in the US meant that the effects of the campaign there were negligible.', answer: 'false' },
    { id: 30, statement: 'In the UK, awards are given to people who have produced materials that are easy to understand.', answer: 'true' },
    { id: 31, statement: 'Use of clear language on documents can be economically beneficial.', answer: 'true' },
    { id: 32, statement: 'The tendency of doctors to use jargon when talking to patients often leads to confusion.', answer: 'ng' },
    { id: 33, statement: 'Regular checks are made on language used in the courts.', answer: 'ng' },
];

export interface SummarySegment {
    text?: string;
    input?: number;
}

export const PART3_SUMMARY: SummarySegment[][] = [
    [
        { text: 'For businesses, the use of complex language can have financial implications. The benefits of plain language can be seen in the case of companies who remove ' },
        { input: 34 },
        { text: ' from their forms and achieve ' },
        { input: 35 },
        { text: ' as a result.' },
    ],
    [
        { text: 'Consumers often complain that they experience a feeling of ' },
        { input: 36 },
        { text: ' when trying to put together do-it-yourself products which have not been tested by companies on a ' },
        { input: 37 },
        { text: '. In situations where not keeping to the correct procedures could affect safety issues, it is especially important that ' },
        { input: 38 },
        { text: ' information is not left out and no assumptions are made about a stage being self-evident or the consumer having a certain amount of ' },
        { input: 39 },
        { text: '.' },
    ],
    [
        { text: 'Lawyers, however, have raised objections to the use of plain English. They feel that it would result in ambiguity in documents and cause people to lose faith in ' },
        { input: 40 },
        { text: ', as it would mean departing from language that has been used in the courts for a very long time.' },
    ],
];

const tfngOptions = [
    { label: 'TRUE', value: 'true' },
    { label: 'FALSE', value: 'false' },
    { label: 'NOT GIVEN', value: 'ng' },
];

export interface Part3ContentProps {
    candidateEmail?: string;
    answers: Record<number, string>;
    onAnswer: (key: number, value: string) => void;
    locked: boolean;
}

export const Part3Content = React.forwardRef<PartContentHandle, Part3ContentProps>(({ candidateEmail, answers, onAnswer, locked }, ref) => {
    const splitAreaRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const [split, setSplit] = useState(50);
    const [activeNav, setActiveNav] = useState<number>(27);

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

    const goTo = (qid: number) => {
        setActiveNav(qid);
        const target = itemRefs.current[qid] ?? itemRefs.current[34];
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    useImperativeHandle(ref, () => ({ scrollTo: goTo }));

    const gapChange = (qid: number, value: string) => {
        onAnswer(qid, value.replace(/^\s+|\s+$/g, ''));
    };

    return (
        <div className="h-full w-full min-w-0 flex flex-col bg-white text-neutral-900">
            <div ref={splitAreaRef} className="flex-1 min-h-0 flex">
                {/* Left Passage Pane */}
                <div style={{ width: `${split}%` }} className="h-full min-w-0 overflow-y-auto pr-6 pt-4 pb-20 custom-scrollbar">
                    <h3 className="text-[17px] font-bold mb-4">{PART3_TITLE}</h3>
                    <div className="text-[15px] leading-[1.6] text-neutral-900 whitespace-pre-line">
                        {PART3_PASSAGE}
                    </div>
                </div>

                {/* Draggable Splitter Divider */}
                <div
                    onPointerDown={startResize}
                    className="w-8 shrink-0 cursor-col-resize select-none flex items-center justify-center group z-10 -ml-4"
                >
                    <div className="w-px h-full bg-[#CCCCCC] group-hover:bg-[#0072CE] transition-colors relative flex items-center justify-center">
                        <div className="absolute w-6 h-8 bg-white border border-[#CCCCCC] rounded-sm flex items-center justify-center shadow-sm text-neutral-500 text-lg group-hover:border-[#0072CE] group-hover:text-[#0072CE]">
                            ↕
                        </div>
                    </div>
                </div>

                {/* Right Question Pane */}
                <div style={{ width: `${100 - split}%` }} className="h-full min-w-0 overflow-y-auto pl-6 pt-4 pb-20 bg-[#F9F9F9] border-l border-[#CCCCCC] custom-scrollbar">
                    <div className="max-w-2xl bg-white p-6 rounded-md shadow-sm border border-[#CCCCCC] space-y-10">
                        {/* Section A: Questions 27-33 TFNG */}
                        <div ref={(el) => { itemRefs.current[27] = el; }} className="scroll-mt-6">
                            <h4 className="font-bold text-base mb-1">Questions 27–33</h4>
                            <p className="text-sm text-neutral-700 mb-5">
                                Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this.
                            </p>
                            <div className="space-y-8">
                                {PART3_TFNG.map((q) => {
                                    const isActive = activeNav === q.id;
                                    const isAnswered = answers[q.id] && answers[q.id].trim() !== '';
                                    return (
                                        <div
                                            key={q.id}
                                            ref={(el) => { if (q.id > 27) itemRefs.current[q.id] = el; }}
                                            className={`relative group cursor-pointer ${isAnswered ? 'pb-2' : ''}`}
                                            onClick={() => goTo(q.id)}
                                        >
                                            <div className="flex gap-3 items-start">
                                                <div className={`shrink-0 w-7 h-7 flex items-center justify-center border font-mono text-sm font-semibold ${isActive ? 'border-[#0072CE] text-[#0072CE]' : 'border-neutral-400 text-neutral-800'}`}>
                                                    {q.id}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[15px] mb-3 text-neutral-900">{q.statement}</p>
                                                    <div className="space-y-1">
                                                        {tfngOptions.map((opt) => {
                                                            const isSelected = answers[q.id] === opt.value;
                                                            return (
                                                                <label
                                                                    key={opt.value}
                                                                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${isSelected ? 'bg-[#D0E8FF] border border-[#0072CE]' : 'border border-transparent hover:bg-neutral-50'}`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={`q-${q.id}`}
                                                                        value={opt.value}
                                                                        checked={isSelected}
                                                                        onChange={(e) => { onAnswer(q.id, e.target.value); setActiveNav(q.id); }}
                                                                        className="w-4 h-4 text-[#0072CE] border-neutral-400 focus:ring-[#0072CE]"
                                                                    />
                                                                    <span className="text-[15px]">{opt.label}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section B: Questions 34-40 Summary Gap-Fill */}
                        <div ref={(el) => { itemRefs.current[34] = el; }} className="scroll-mt-6 pt-2 border-t border-[#CCCCCC]">
                            <h4 className="font-bold text-base mb-1">Questions 34–40</h4>
                            <p className="text-sm text-neutral-700 mb-4">
                                Complete the summary. Write NO MORE THAN TWO WORDS from the text for each answer.
                            </p>
                            <div className="space-y-4">
                                {PART3_SUMMARY.map((para, pi) => (
                                    <p key={pi} className="text-[15px] leading-loose text-neutral-900">
                                        {para.map((seg, si) => {
                                            if (seg.input != null) {
                                                const qid = seg.input;
                                                return (
                                                    <input
                                                        key={si}
                                                        type="text"
                                                        placeholder={String(qid)}
                                                        value={answers[qid] || ''}
                                                        onChange={(e) => gapChange(qid, e.target.value)}
                                                        onFocus={() => setActiveNav(qid)}
                                                        disabled={locked}
                                                        className={`inline-block w-40 h-8 px-2 mx-1 border rounded focus:outline-none focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE] font-mono text-center ${locked ? 'opacity-50 border-gray-300' : 'border-gray-400'}`}
                                                    />
                                                );
                                            }
                                            return <span key={si}>{seg.text}</span>;
                                        })}
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

export default Part3Content;