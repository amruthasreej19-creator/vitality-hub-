import { useState, useEffect, useRef } from "react";
import { WorkoutData, WorkoutSegment } from "../data/workouts";
import { LoggedActivity } from "../types";
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, X, Check, Award, Flame, Clock, Sparkles } from "lucide-react";

interface WorkoutPlayerModalProps {
  workout: WorkoutData;
  onClose: () => void;
  onAddWorkout: (workout: Omit<LoggedActivity, "id" | "timestamp">) => void;
}

export default function WorkoutPlayerModal({ workout, onClose, onAddWorkout }: WorkoutPlayerModalProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(workout.segments[0]?.duration || 30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentSegment: WorkoutSegment | undefined = workout.segments[currentIdx];

  const playBeep = (freq = 580, duration = 0.2) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = freq;
      osc.type = "sine";
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignored gracefully on sandboxed frame limits
    }
  };

  const speakText = (text: string) => {
    if (!isVoiceEnabled) return;
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Ignore text to speech limits
    }
  };

  // Announce the first workout drill when loaded
  useEffect(() => {
    if (currentSegment) {
      speakText(`Starting ${workout.name}. First up: ${currentSegment.name}. ${currentSegment.instructions}`);
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timer Countdown loop
  useEffect(() => {
    if (isTimerRunning && !isWorkoutCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSegmentTransition();
            return 0;
          }
          
          // Sound chime on last 3 seconds
          if (prev <= 4 && prev > 1) {
            playBeep(440, 0.1);
          }
          
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, currentIdx, isWorkoutCompleted]);

  const handleSegmentTransition = () => {
    playBeep(880, 0.4);
    if (currentIdx < workout.segments.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextSegment = workout.segments[nextIdx];
      setCurrentIdx(nextIdx);
      setTimeLeft(nextSegment.duration);
      speakText(`Next is: ${nextSegment.name}. ${nextSegment.instructions}`);
    } else {
      handleWorkoutComplete();
    }
  };

  const handleWorkoutComplete = () => {
    setIsWorkoutCompleted(true);
    setIsTimerRunning(false);
    speakText(`Congratulations! You completed the ${workout.name}! Grab some water and claim your burnt calories!`);
    playBeep(1000, 0.8);
  };

  const handlePauseToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleSkip = () => {
    playBeep(650, 0.15);
    handleSegmentTransition();
  };

  const handleReset = () => {
    playBeep(350, 0.2);
    setCurrentIdx(0);
    setTimeLeft(workout.segments[0]?.duration || 30);
    setIsTimerRunning(true);
    setIsWorkoutCompleted(false);
    speakText(`Restarting workout. Starting with: ${workout.segments[0]?.name}`);
  };

  const handleFinishLog = () => {
    onAddWorkout({
      name: workout.name,
      minutes: workout.durationMinutes,
      caloriesBurned: workout.caloriesBurned,
      type: workout.type
    });
    onClose();
  };

  // Convert time to helper mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      
      {/* Container */}
      <div className="relative bg-[#0b100e] text-[#e3ece7] max-w-5xl w-full h-[95vh] md:h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-[#1b3021] shadow-2xl animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {isWorkoutCompleted ? (
          /* COMPLETION CELEBRATION CARD */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#102a18] to-[#040905] overflow-y-auto h-full w-full">
            <div className="relative mb-6">
              {/* Confetti-like animations */}
              <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#00aa50] to-[#4ade80] flex items-center justify-center text-white shadow-xl relative animate-bounce animate-duration-1000">
                <Award className="w-12 h-12" />
              </div>
            </div>

            <span className="bg-primary/25 text-primary-container font-sans font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 select-none">
              Session Accomplished!
            </span>

            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Outstanding Work!
            </h3>
            <p className="font-sans text-sm text-gray-400 max-w-md mb-8 leading-relaxed">
              You pushed through the limits and successfully completed your <strong className="text-white">{workout.name}</strong>. Feel the pulse!
            </p>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-sm w-full mb-8">
              <div className="bg-[#101c13] border border-[#1d3d25] rounded-2xl p-4 flex flex-col items-center">
                <Flame className="w-8 h-8 text-[#ff8138] fill-current mb-2" />
                <span className="font-display text-2xl font-black text-white">{workout.caloriesBurned}</span>
                <span className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Calories Burned</span>
              </div>
              <div className="bg-[#101c13] border border-[#1d3d25] rounded-2xl p-4 flex flex-col items-center">
                <Clock className="w-8 h-8 text-[#00c283] mb-2" />
                <span className="font-display text-2xl font-black text-white">{workout.durationMinutes} min</span>
                <span className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Active Duration</span>
              </div>
            </div>

            <button
              onClick={handleFinishLog}
              className="px-8 py-4 bg-gradient-to-r from-[#006d36] to-[#4ade80] text-white font-sans font-bold text-sm sm:text-base rounded-full shadow-lg shadow-green-950/40 hover:opacity-[0.98] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              Claim My Burn &amp; Save
            </button>
          </div>
        ) : (
          /* ACTIVE SESSION PANEL */
          <>
            {/* Left Column: Video screen & Instructions */}
            <div className="flex-[1.2] flex flex-col bg-black border-r border-[#15241b]">
              
              {/* Media Section: HD Exercise Video Embed */}
              <div className="relative aspect-video w-full bg-neutral-900 border-b border-[#1b3425]">
                <iframe
                  className="w-full h-full object-cover"
                  src={`${workout.videoUrl}?autoplay=1&mute=1&enablejsapi=1&rel=0&showinfo=0`}
                  title={workout.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                
                {/* Overlay Badge overlaying Youtube */}
                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-white/90 font-mono text-[9px] tracking-wide select-none">
                  🔴 Video stream active • {workout.badge}
                </span>
              </div>

              {/* Instructions Detail Panel */}
              <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <span className="bg-[#183522] text-[#55db86] font-sans font-bold text-[10px] px-2.5 py-1 rounded-md uppercase">
                      Current Drill
                    </span>
                    <span className="text-gray-400 text-xs font-semibold">
                      Step {currentIdx + 1} of {workout.segments.length}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {currentSegment?.name}
                  </h3>
                  
                  <p className="font-sans text-sm text-gray-300 leading-relaxed bg-[#111e15] border border-[#1b3021] p-4 rounded-2xl">
                    💡 <strong className="text-white">Trainer Cue:</strong> {currentSegment?.instructions}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#122217] flex items-center justify-between text-xs text-gray-400 font-semibold font-sans">
                  <span>Up next: {workout.segments[currentIdx + 1]?.name || "Finish Workout!"}</span>
                  <div className="flex items-center gap-1.5 bg-[#122217] text-[#55db86] px-2.5 py-1 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-time Sync</span>
                  </div>
                </div>
              </div>

            </div >

            {/* Right Column: Dynamic Companion Timer Deck */}
            <div className="flex-1 flex flex-col bg-[#070b08] p-6 lg:p-8 justify-between overflow-hidden">
              
              {/* Header inside companion */}
              <div className="flex items-center justify-between pb-4 border-b border-[#132418]">
                <div>
                  <h4 className="font-display font-extrabold text-xs text-gray-400 uppercase tracking-widest leading-none">
                    Session Companion
                  </h4>
                  <p className="font-sans text-white text-sm font-semibold mt-1">
                    {workout.name}
                  </p>
                </div>
                
                {/* Voice Toggler */}
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !isVoiceEnabled;
                    setIsVoiceEnabled(nextVal);
                    if (nextVal) speakText("Voice guide enabled.");
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isVoiceEnabled ? "bg-[#1d3a25] text-white" : "bg-neutral-800 text-gray-500"
                  }`}
                  title={isVoiceEnabled ? "Silence Voice Trainer" : "Enable Voice Trainer"}
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Central Dynamic Timer Display */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 select-none relative">
                {/* Core Radial Glow */}
                <div className="absolute w-44 h-44 bg-primary/5 blur-2xl rounded-full pointer-events-none" />

                <span className="text-[10px] font-sans font-black tracking-widest text-[#5de391] uppercase mb-1">
                  Interval Countdown
                </span>
                
                <h1 className="font-display text-6xl sm:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_2px_15px_rgba(74,222,128,0.2)]">
                  {formatTime(timeLeft)}
                </h1>

                {/* Micro bars visual progress */}
                <div className="w-40 bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-4">
                  <div
                    className="bg-[#3ee17f] h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, (timeLeft / (currentSegment?.duration || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Panel Controls */}
              <div className="space-y-6">
                
                {/* Primary Action Row */}
                <div className="flex justify-center items-center gap-4">
                  {/* Reset */}
                  <button
                    onClick={handleReset}
                    type="button"
                    className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                    title="Restart Session"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Play / Pause Toggle button */}
                  <button
                    onClick={handlePauseToggle}
                    type="button"
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer ${
                      isTimerRunning 
                        ? "bg-[#183622] hover:bg-[#1f422b] text-white border border-[#2b593a]" 
                        : "bg-[#00aa50] hover:opacity-95 text-white"
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </button>

                  {/* Skip to Next */}
                  <button
                    onClick={handleSkip}
                    type="button"
                    className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                    title="Skip drill"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrolling Workout Stack */}
                <div className="bg-[#0b120c] border border-[#162a1c] rounded-2.5xl p-4 h-36 overflow-y-auto space-y-2">
                  <div className="text-[9px] font-sans font-bold text-gray-500 uppercase tracking-widest pb-1 border-b border-[#122316] mb-2">
                    Segment Progress Plan
                  </div>
                  {workout.segments.map((seg, sIdx) => {
                    const isCompleted = sIdx < currentIdx;
                    const isActive = sIdx === currentIdx;
                    return (
                      <div
                        key={seg.id}
                        className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-[#132a19] text-[#55db86]" 
                            : isCompleted 
                              ? "text-gray-500 line-through" 
                              : "text-gray-400"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#4ade80]" : isCompleted ? "bg-[#153a20]" : "bg-neutral-700"}`} />
                          <span className="font-semibold truncate max-w-[150px]">{seg.name}</span>
                        </div>
                        <span className="font-mono text-[10px] tabular-nums">
                          {isCompleted ? <Check className="w-3.5 h-3.5 inline text-green-500" /> : `${seg.duration}s`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Instant Skip & Finish Button */}
                <button
                  type="button"
                  onClick={handleWorkoutComplete}
                  className="w-full h-11 text-xs font-semibold text-gray-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-[#1e4428] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Award className="w-4 h-4" />
                  <span>I'm Finished! Stop Workout &amp; Save</span>
                </button>

              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
