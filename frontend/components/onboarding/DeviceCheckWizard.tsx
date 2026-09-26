import React, { useState, useRef, useEffect } from 'react';

interface DeviceCheckWizardProps {
  onComplete: () => void;
  onSkip: () => void;
  onBack?: () => void;
}

export const DeviceCheckWizard: React.FC<DeviceCheckWizardProps> = ({
  onComplete,
  onSkip,
  onBack,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);

  // Stage 1: Headphone Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioTimer, setAudioTimer] = useState(3);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  // Stage 2: Microphone Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(5);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<any>(null);
  const audioPlaybackRef = useRef<HTMLAudioElement | null>(null);

  // Clean up recorded blob URL on unmount
  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [recordedAudioUrl]);

  // ── Stage 1: Play Headphone Sound ─────────────────────────────────────────
  const playSampleAudio = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    setAudioTimer(3);

    // Use Web Audio Oscillator & speech synthesis for guaranteed local audio
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.2); // A5

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      }

      // Also speak friendly chime
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance("Welcome to the IELTS Speaking Test sound check.");
        u.rate = 1.0;
        u.pitch = 1.1;
        window.speechSynthesis.speak(u);
      }
    } catch (err) {
      console.warn("AudioContext error:", err);
    }

    const interval = setInterval(() => {
      setAudioTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlayingAudio(false);
          setHasPlayedAudio(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirmHeadphones = () => {
    setStep1Done(true);
    setActiveStep(2);
  };

  // ── Stage 2: Microphone Check ─────────────────────────────────────────────
  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordedAudioUrl(null);
    setRecordTimer(5);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 5-second countdown
      countdownIntervalRef.current = setInterval(() => {
        setRecordTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.warn("Microphone access error or denied:", err);
      setMicPermissionDenied(true);
      // Simulated recording fallback so user is never stuck
      setIsRecording(true);
      countdownIntervalRef.current = setInterval(() => {
        setRecordTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            setIsRecording(false);
            setRecordedAudioUrl("simulated");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    if (recordedAudioUrl === "simulated") {
      setIsPlayingRecording(true);
      setTimeout(() => setIsPlayingRecording(false), 2000);
      return;
    }

    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    audioPlaybackRef.current = audio;
    setIsPlayingRecording(true);
    audio.play().catch(e => console.warn(e));
    audio.onended = () => setIsPlayingRecording(false);
  };

  const handleConfirmMicrophone = () => {
    setStep2Done(true);
    setActiveStep(3);
  };

  return (
    <div className="min-h-full bg-[#FAFAFA] dark:bg-[#0A0B0E] text-gray-900 dark:text-zinc-100 font-sans p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack || onSkip}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            STEP 2 OF 2 · HARDWARE CHECK
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center pt-2 pb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Device Test
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Test if your recording device is working
          </p>
        </div>

        {/* ── Wizard Card ── */}
        <div className="bg-white dark:bg-[#121319] border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">

          {/* ════════════════════════════════════════════════════════════════
              STAGE 1: HEADPHONE CHECK
          ════════════════════════════════════════════════════════════════ */}
          <div className={`space-y-4 transition-opacity ${activeStep === 1 || step1Done ? 'opacity-100' : 'opacity-40'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full ${
                step1Done ? 'bg-purple-600 text-white' : activeStep === 1 ? 'bg-purple-600 text-white' : 'border-2 border-gray-200 text-gray-400'
              } font-bold text-sm flex items-center justify-center shrink-0 shadow-xs transition-colors`}>
                {step1Done ? '✓' : '1'}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  1. Headphone check
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Make sure your headphone's audio is good enough before taking the test. Please click the play icon to check the sound quality.
                </p>

                {/* Player Box */}
                {activeStep === 1 && (
                  <div className="mt-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={playSampleAudio}
                        disabled={isPlayingAudio}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-xs transition-all cursor-pointer ${
                          isPlayingAudio
                            ? 'bg-purple-700 text-white animate-pulse'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {isPlayingAudio ? '❚❚' : '▶'}
                      </button>

                      {/* Waveform Visualizer */}
                      <div className="flex-1 flex items-center gap-1 h-6">
                        {[4, 8, 14, 20, 12, 18, 22, 16, 10, 14, 8, 16, 22, 14, 6].map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              isPlayingAudio ? 'bg-purple-500 animate-pulse' : 'bg-gray-300 dark:bg-zinc-700'
                            }`}
                            style={{
                              height: isPlayingAudio ? `${Math.max(6, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : `${h / 2}px`,
                              animationDelay: `${i * 60}ms`
                            }}
                          />
                        ))}
                      </div>

                      <span className="text-xs font-mono font-semibold text-gray-500 dark:text-zinc-400">
                        {isPlayingAudio ? `00:0${audioTimer}` : '00:03'}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                      Click play to hear the sample tone, then confirm you can hear it.
                    </p>

                    {(isPlayingAudio || hasPlayedAudio) && (
                      <button
                        onClick={handleConfirmHeadphones}
                        className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                      >
                        Yes, I can hear it
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-800/80" />

          {/* ════════════════════════════════════════════════════════════════
              STAGE 2: MICROPHONE CHECK
          ════════════════════════════════════════════════════════════════ */}
          <div className={`space-y-4 transition-opacity ${activeStep === 2 || step2Done ? 'opacity-100' : 'opacity-40'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full ${
                step2Done ? 'bg-purple-600 text-white' : activeStep === 2 ? 'bg-purple-600 text-white' : 'border-2 border-gray-200 text-gray-400'
              } font-bold text-sm flex items-center justify-center shrink-0 shadow-xs transition-colors`}>
                {step2Done ? '✓' : '2'}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  2. Microphone check
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Make sure your microphone works well before taking the test. Record audio and play it back to go next.
                </p>

                {activeStep === 2 && (
                  <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        PLEASE READ OUT LOUD:
                      </span>
                      <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 italic bg-white dark:bg-zinc-800/80 p-3 rounded-xl border border-gray-200 dark:border-zinc-700/60">
                        "I love English. My English is great and I practice it every day!"
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {!isRecording && !recordedAudioUrl && (
                        <button
                          onClick={startRecording}
                          className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 text-xs sm:text-sm shadow-xs cursor-pointer"
                        >
                          <span>🎙</span>
                          <span>Start Recording</span>
                        </button>
                      )}

                      {isRecording && (
                        <button
                          onClick={stopRecording}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 text-xs sm:text-sm animate-pulse shadow-xs cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                          <span>Stop Recording (00:0{recordTimer})</span>
                        </button>
                      )}

                      {recordedAudioUrl && !isRecording && (
                        <>
                          <button
                            onClick={playRecordedAudio}
                            disabled={isPlayingRecording}
                            className="bg-gray-800 hover:bg-black text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer"
                          >
                            <span>{isPlayingRecording ? '🔊' : '▶'}</span>
                            <span>{isPlayingRecording ? 'Playing back...' : 'Play My Recording'}</span>
                          </button>
                          <button
                            onClick={startRecording}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300 underline cursor-pointer"
                          >
                            Re-record
                          </button>
                        </>
                      )}
                    </div>

                    {recordedAudioUrl && !isRecording && (
                      <div className="pt-2">
                        <button
                          onClick={handleConfirmMicrophone}
                          className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                        >
                          Yes, microphone works
                        </button>
                      </div>
                    )}

                    {micPermissionDenied && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">
                        Notice: Microphone access was not granted by the browser, but you can continue the test.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-800/80" />

          {/* ════════════════════════════════════════════════════════════════
              STAGE 3: ALL GOOD — READY TO GO!
          ════════════════════════════════════════════════════════════════ */}
          <div className={`space-y-4 transition-opacity ${activeStep === 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full ${
                activeStep === 3 ? 'bg-emerald-600 text-white' : 'border-2 border-gray-200 text-gray-400'
              } font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                {activeStep === 3 ? '✓' : '3'}
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  3. All good — ready to go!
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Your devices are working. Click the button below to begin.
                </p>

                {activeStep === 3 && (
                  <div className="pt-2 space-y-5">
                    {/* Status Badges */}
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold px-3 py-1 rounded-full text-xs">
                        ✓ Headphones
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold px-3 py-1 rounded-full text-xs">
                        ✓ Microphone
                      </span>
                    </div>

                    <button
                      onClick={onComplete}
                      className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md text-sm flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <span>▶</span>
                      <span>Start Exam</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer Bypass Link ── */}
        <div className="text-center pt-2">
          <button
            onClick={onSkip}
            className="text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 underline cursor-pointer transition-colors"
          >
            Devices already tested? Skip device test.
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeviceCheckWizard;
