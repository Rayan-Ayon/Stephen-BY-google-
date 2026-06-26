
import React from 'react';
import { motion } from 'framer-motion';

const ManifestoPanel: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-10"
        >
            {/* The Society Value Exchange */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                    <h2 className="text-xl font-bold dark:text-white text-black font-serif">The Society Value Exchange</h2>
                </div>
                <div className="space-y-4 dark:text-gray-400 text-neutral-600 text-sm leading-relaxed pl-4">
                    <p>
                        Every civilization advances through the exchange of value. From the earliest barter systems — where a
                        fisherman traded his catch for a carpenter's shelter — to the invention of currency as a universal
                        medium, the core engine of human progress has always been the ability to transfer value efficiently
                        across people, time, and distance.
                    </p>
                    <p>
                        Currency evolved as a <span className="dark:text-emerald-400 text-emerald-600 font-semibold">trust abstraction</span> — first as
                        commodity money (gold, salt, grain), then as representative money (banknotes backed by reserves),
                        and finally as <span className="dark:text-emerald-400 text-emerald-600 font-semibold">digital credit</span>: pure information
                        representing stored societal trust. Today, a transaction that once required physical presence and
                        mutual recognition happens in milliseconds across continents, secured by cryptographic proof rather
                        than personal acquaintance.
                    </p>
                    <blockquote className="border-l-2 dark:border-emerald-500/40 border-emerald-600/40 pl-4 italic dark:text-gray-500 text-neutral-500">
                        "Money is not metal. It is a ledger of trust, a memory of value, a bridge across time."
                    </blockquote>
                    <p>
                        This same principle applies to knowledge: ideas are the currency of the mind. The platforms we
                        build — from YouTube to arXiv to Reddit — are merely exchanges where intellectual value is
                        minted, traded, and compounded. The student who learns a skill and applies it creates new value
                        that flows back into the ecosystem.
                    </p>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t dark:border-white/5 border-gray-200" />

            {/* The 19th Century Factory vs. The 21st Century Agent */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                    <h2 className="text-xl font-bold dark:text-white text-black font-serif">The 19th Century Factory vs. The 21st Century Agent</h2>
                </div>
                <div className="space-y-4 dark:text-gray-400 text-neutral-600 text-sm leading-relaxed pl-4">
                    <p>
                        The modern education system was designed in the shadow of the Industrial Revolution. Its
                        architecture — batch-processed cohorts, standardized curricula, bell schedules, letter grades —
                        mirrors the factory floor. Students are assembled by age, moved through identical assembly lines
                        of knowledge, and evaluated by their ability to regurgitate on cue.
                    </p>
                    <p>
                        This model produced reliable factory workers and bureaucrats for a world that no longer exists.
                        In the 21st century, <span className="dark:text-emerald-400 text-emerald-600 font-semibold">the factory is a metaphor, not a
                        workplace</span>. The real demand is for agents — individuals who can rapidly acquire new skills
                        on demand, synthesize across domains, and apply knowledge in contexts that didn't exist when
                        they started their education.
                    </p>
                    <p>
                        The mandate of the modern learner is to be a <span className="dark:text-amber-400 text-amber-600 font-semibold">Jack of all trades, master of
                        many</span> — continuously sampling the frontier of human knowledge and going deep exactly
                        where the moment demands it. This is not anti-expertise; it is anti-rigidity. The most valuable
                        people are those who can:
                    </p>
                    <ul className="space-y-2 list-disc pl-5">
                        <li><span className="dark:text-white text-black font-medium">Detect</span> which skills matter next</li>
                        <li><span className="dark:text-white text-black font-medium">Acquire</span> them faster than their competition</li>
                        <li><span className="dark:text-white text-black font-medium">Apply</span> them to produce measurable outcomes</li>
                        <li><span className="dark:text-white text-black font-medium">Teach</span> them to compound their impact</li>
                    </ul>
                    <p>
                        AI accelerates this shift. When routine cognitive work is automated, the premium shifts entirely
                        to <span className="dark:text-emerald-400 text-emerald-600 font-semibold">pattern recognition, cross-domain synthesis, and
                        contextual judgment</span> — skills that cannot be batch-produced. The following
                        methodologies are the toolkit for this new mode of learning.
                    </p>
                </div>
            </section>
        </motion.div>
    );
};

export default ManifestoPanel;
