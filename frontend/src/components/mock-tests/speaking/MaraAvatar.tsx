import React from 'react';

interface MaraAvatarProps {
    isSpeaking: boolean;
    size?: number;
}

export const MaraAvatar: React.FC<MaraAvatarProps> = ({ isSpeaking, size = 160 }) => {
    return (
        <div className="relative flex flex-col items-center justify-center select-none">
            {/* Pulsing Audio Aura Rings when speaking */}
            {isSpeaking && (
                <>
                    <div className="absolute w-[200px] h-[200px] rounded-full border-2 border-purple-500/20 animate-ping pointer-events-none" />
                    <div className="absolute w-[220px] h-[220px] rounded-full border border-purple-500/10 animate-pulse pointer-events-none" />
                </>
            )}

            {/* Avatar Container with glowing border */}
            <div
                className={`relative rounded-full overflow-hidden transition-all duration-300 shadow-2xl ${
                    isSpeaking
                        ? 'ring-4 ring-purple-500/60 shadow-[0_0_35px_rgba(168,85,247,0.35)] scale-105'
                        : 'ring-2 ring-zinc-700/80 shadow-lg'
                }`}
                style={{ width: size, height: size }}
            >
                {/* Vector SVG of Examiner Mara */}
                <svg
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full bg-gradient-to-b from-[#1E2028] to-[#121318]"
                >
                    {/* Background glow behind Mara */}
                    <circle cx="100" cy="100" r="90" fill="url(#bgGlow)" />

                    {/* Shoulder & Dark Professional Blazer */}
                    <path
                        d="M30 200C30 155 60 142 100 142C140 142 170 155 170 200Z"
                        fill="#1F2430"
                    />
                    {/* Blazer Lapels */}
                    <path
                        d="M70 145L100 185L130 145L115 142L100 165L85 142Z"
                        fill="#2A3040"
                    />
                    {/* Inner Blouse / Collared Top */}
                    <path
                        d="M85 142L100 170L115 142Z"
                        fill="#E2E8F0"
                    />

                    {/* Neck */}
                    <path
                        d="M88 120H112V144C112 144 105 148 100 148C95 148 88 144 88 144V120Z"
                        fill="#F3C3A6"
                    />
                    {/* Neck shadow */}
                    <path
                        d="M88 120H112V128C112 128 105 132 100 132C95 132 88 128 88 128V120Z"
                        fill="#E4A987"
                    />

                    {/* Head / Face */}
                    <rect
                        x="72"
                        y="62"
                        width="56"
                        height="68"
                        rx="28"
                        fill="#F7D0B8"
                    />

                    {/* Ears */}
                    <circle cx="70" cy="98" r="8" fill="#F3C3A6" />
                    <circle cx="130" cy="98" r="8" fill="#F3C3A6" />

                    {/* Professional Discreet Earpiece / Headset */}
                    <rect x="67" y="93" width="5" height="10" rx="2" fill="#3B82F6" />
                    <path d="M69 103C69 112 76 118 84 118" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="84" cy="118" r="2" fill="#60A5FA" />

                    {/* Professional Brunette Hair - Back & Sides */}
                    <path
                        d="M66 85C64 55 80 40 100 40C120 40 136 55 134 85C138 98 138 120 135 130C132 122 130 100 130 100C120 85 125 65 100 65C75 65 80 85 70 100C70 100 68 122 65 130C62 120 62 98 66 85Z"
                        fill="#38241B"
                    />
                    {/* Hair Highlights */}
                    <path
                        d="M85 45C95 42 108 42 118 46C122 55 120 62 120 62C110 52 95 52 85 58Z"
                        fill="#4D3327"
                    />

                    {/* Eyebrows */}
                    <path d="M78 80C82 78 88 78 92 80" stroke="#2B1A13" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M108 80C112 78 118 78 122 80" stroke="#2B1A13" strokeWidth="2.2" strokeLinecap="round" />

                    {/* Eyes - Friendly & Professional */}
                    <ellipse cx="85" cy="88" rx="4.5" ry="3.2" fill="#2E1C14" />
                    <ellipse cx="115" cy="88" rx="4.5" ry="3.2" fill="#2E1C14" />
                    {/* Eye Catchlights */}
                    <circle cx="86.5" cy="87" r="1.2" fill="white" />
                    <circle cx="116.5" cy="87" r="1.2" fill="white" />

                    {/* Glasses (Modern round/square frames) */}
                    <rect x="76" y="81" width="18" height="14" rx="4" stroke="#475569" strokeWidth="1.6" fill="none" />
                    <rect x="106" y="81" width="18" height="14" rx="4" stroke="#475569" strokeWidth="1.6" fill="none" />
                    <path d="M94 87H106" stroke="#475569" strokeWidth="1.6" />

                    {/* Nose */}
                    <path d="M100 88V98C100 99 98 101 96 101" stroke="#E4A987" strokeWidth="1.8" strokeLinecap="round" />

                    {/* Cheeks blush */}
                    <circle cx="78" cy="98" r="5" fill="#FB7185" opacity="0.25" />
                    <circle cx="122" cy="98" r="5" fill="#FB7185" opacity="0.25" />

                    {/* Dynamic Mouth Element */}
                    {isSpeaking ? (
                        <g className="animate-[maraTalk_0.35s_infinite_alternate_ease-in-out] origin-[100px_110px]">
                            {/* Speaking Animated Mouth Open */}
                            <ellipse cx="100" cy="111" rx="8" ry="5.5" fill="#881337" />
                            {/* Teeth */}
                            <rect x="95" y="106" width="10" height="2.5" rx="1" fill="#FFFFFF" />
                            {/* Tongue */}
                            <ellipse cx="100" cy="114" rx="5" ry="2" fill="#F43F5E" />
                        </g>
                    ) : (
                        /* Neutral Pleasant Closed Smile */
                        <path
                            d="M93 110C96 113 104 113 107 110"
                            stroke="#9F1239"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Gradients */}
                    <defs>
                        <radialGradient id="bgGlow" cx="50%" cy="40%" r="50%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>

                {/* Live audio frequency indicator when speaking */}
                {isSpeaking && (
                    <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1">
                        <span className="w-1 h-3 bg-purple-400 rounded-full animate-[soundWave_0.4s_infinite_alternate]" />
                        <span className="w-1 h-5 bg-purple-300 rounded-full animate-[soundWave_0.6s_infinite_alternate_0.1s]" />
                        <span className="w-1 h-4 bg-purple-400 rounded-full animate-[soundWave_0.5s_infinite_alternate_0.2s]" />
                        <span className="w-1 h-6 bg-purple-200 rounded-full animate-[soundWave_0.7s_infinite_alternate_0.15s]" />
                        <span className="w-1 h-3 bg-purple-400 rounded-full animate-[soundWave_0.4s_infinite_alternate_0.05s]" />
                    </div>
                )}
            </div>

            <style>{`
                @keyframes maraTalk {
                    0% {
                        transform: scaleY(0.3) scaleX(0.85);
                    }
                    50% {
                        transform: scaleY(0.9) scaleX(1.05);
                    }
                    100% {
                        transform: scaleY(1.3) scaleX(1);
                    }
                }
                @keyframes soundWave {
                    0% {
                        height: 4px;
                        opacity: 0.5;
                    }
                    100% {
                        height: 18px;
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default MaraAvatar;
