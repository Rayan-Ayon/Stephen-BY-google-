/**
 * Speaking Audio Service
 * Provides speech synthesis and examiner orientation audio for IELTS Speaking tests.
 */

export const IELTS_PART2_RULES_SCRIPT =
    "Now, I'm going to give you a topic and I'd like you to talk about it for 1 to 2 minutes. Before you talk, you'll have 1 minute to think about what you're going to say. You can make some notes if you wish. Do you understand?";

let activeSpeechTimeout: number | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Stop any ongoing examiner speech immediately.
 */
export function stopSpeakingAudio(): void {
    if (activeSpeechTimeout) {
        window.clearTimeout(activeSpeechTimeout);
        activeSpeechTimeout = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
        } catch (e) {
            // Ignore browser cancel errors
        }
    }
    currentUtterance = null;
}

/**
 * Stop all ongoing audio and cancel any SpeechSynthesis utterances.
 */
export const stopAllAudio = stopSpeakingAudio;

/**
 * Helper to pick an optimal English voice.
 */
export function getExaminerVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    try {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;

        // Prefer female / natural UK or US English voices
        const preferred = voices.find(
            (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Female') ||
                    v.name.includes('Samantha') ||
                    v.name.includes('Zira') ||
                    v.name.includes('Victoria') ||
                    v.name.includes('Google UK English Female') ||
                    v.name.includes('Natural'))
        );
        if (preferred) return preferred;

        // Fallback to any English voice
        const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
        return anyEnglish || voices[0] || null;
    } catch {
        return null;
    }
}

interface SpeakOptions {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
}

/**
 * Synthesize speech for any given text.
 * Returns a cancel function.
 */
export function speakText(text: string, options: SpeakOptions = {}): () => void {
    stopSpeakingAudio();

    const { rate = 0.95, pitch = 1.05, onStart, onEnd, onError } = options;

    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
        // Fallback timer if speech synthesis is unavailable
        onStart?.();
        const estDuration = Math.max(3000, Math.min(text.length * 65, 9000));
        activeSpeechTimeout = window.setTimeout(() => {
            onEnd?.();
        }, estDuration);
        return stopSpeakingAudio;
    }

    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;

        const voice = getExaminerVoice();
        if (voice) {
            utterance.voice = voice;
        }

        let hasFinished = false;

        const handleFinish = () => {
            if (hasFinished) return;
            hasFinished = true;
            if (activeSpeechTimeout) {
                window.clearTimeout(activeSpeechTimeout);
                activeSpeechTimeout = null;
            }
            currentUtterance = null;
            onEnd?.();
        };

        utterance.onstart = () => {
            onStart?.();
        };

        utterance.onend = handleFinish;

        utterance.onerror = (e) => {
            console.warn('[SpeakingAudioService] Speech error:', e);
            onError?.(e);
            handleFinish();
        };

        currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);

        // Safety fallback duration in case SpeechSynthesis hangs (e.g., in Chrome background tab)
        const safetyDuration = Math.max(4000, Math.min(text.length * 80 + 3000, 15000));
        activeSpeechTimeout = window.setTimeout(() => {
            handleFinish();
        }, safetyDuration);
    } catch (err) {
        console.error('[SpeakingAudioService] Failed to speak:', err);
        onError?.(err);
        onEnd?.();
    }

    return stopSpeakingAudio;
}

/**
 * Play official IELTS Part 2 instruction audio:
 * "Now, I'm going to give you a topic and I'd like you to talk about it for 1 to 2 minutes..."
 */
export function playPart2Instructions(callbacks: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
} = {}): () => void {
    return speakText(IELTS_PART2_RULES_SCRIPT, {
        rate: 0.93,
        pitch: 1.04,
        ...callbacks,
    });
}
