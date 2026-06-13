import { useState } from "react";
import { UserProfile, LoggedMeal, GoalType, getMacroTargets } from "../types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Trophy, Egg, Flame, Droplets, Target, Award, ShieldAlert, Sparkles, Zap, Shield, HelpCircle, ChevronRight, ChevronDown } from "lucide-react";

interface StatsTabProps {
  profile: UserProfile;
  loggedMeals: LoggedMeal[];
}

const WEEK_DATA = [
  { name: "Week 1", Weight: 69.5, Activity: 40 },
  { name: "Week 2", Weight: 69.0, Activity: 60 },
  { name: "Week 3", Weight: 68.7, Activity: 85 },
  { name: "Week 4", Weight: 68.5, Activity: 95 }
];

export default function StatsTab({ profile, loggedMeals }: StatsTabProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [miaCheered, setMiaCheered] = useState(false);
  const [jordanCheered, setJordanCheered] = useState(false);
  const [zoeCheered, setZoeCheered] = useState(false);

  // calculate dynamic macros compiled today
  const proteinConsumed = loggedMeals.reduce((sum, m) => sum + (m.protein || 0), 0) + 75; // prefilled base
  const carbsConsumed = loggedMeals.reduce((sum, m) => sum + (m.carbs || 0), 0) + 160; // prefilled base
  const fatsConsumed = loggedMeals.reduce((sum, m) => sum + (m.fats || 0), 0) + 35; // prefilled base

  const macroTargets = getMacroTargets(profile);
  const proteinTarget = macroTargets.protein;
  const carbsTarget = macroTargets.carbs;
  const fatsTarget = macroTargets.fats;

  const proteinPercent = Math.min(100, Math.round((proteinConsumed / proteinTarget) * 100));
  const carbsPercent = Math.min(100, Math.round((carbsConsumed / carbsTarget) * 100));
  const fatsPercent = Math.min(100, Math.round((fatsConsumed / fatsTarget) * 100));

  // Dynamic goal tracking math based on user onboarding choices!
  const targetW = profile.targetWeight || 72.0;
  const currentW = profile.weight || 68.5;
  const diffW = Math.abs(targetW - currentW);
  
  // Decide target metric context based on goal
  let goalStatusText = "";
  let progressPercent = 75;

  if (profile.goalType === GoalType.MUSCLE_GAIN) {
    goalStatusText = diffW <= 0.1 
      ? "Target reached! Excellent muscle-building phase!" 
      : `You're only ${diffW.toFixed(1)}kg away from your target weight! Keep crushing.`;
    // calculate a reasonable percentage
    progressPercent = currentW < targetW ? Math.round((currentW / targetW) * 100) : 100;
  } else if (profile.goalType === GoalType.LEAN_DOWN) {
    goalStatusText = diffW <= 0.1 
      ? "Target met! Fabulous progress leaning down!" 
      : `You're only ${diffW.toFixed(1)}kg away from your lean target! Keep pushing.`;
    progressPercent = currentW > targetW ? Math.round((targetW / currentW) * 100) : 100;
  } else {
    goalStatusText = "Excellent daily calorie & workout pacing. Energy peak sustained!";
    progressPercent = 88;
  }

  return (
    <div className="space-y-8 pb-32 animate-fade-in text-on-background">
      
      {/* Hero Header Banner */}
      <section className="pt-2">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4ade80] to-[#006d36] p-8 text-white shadow-lg shadow-primary/10">
          <div className="relative z-10">
            <h1 className="font-display text-2xl font-extrabold mb-1">Level Up! 🚀</h1>
            <p className="font-sans text-sm opacity-90 max-w-[250px] font-semibold leading-relaxed">
              You've stayed on track for 12 days straight. Legend!
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 scale-150">
            <Trophy className="w-24 h-24" />
          </div>
        </div>
      </section>

      {/* Recharts Progress & Bento Grid */}
      <section className="space-y-4">
        
        {/* Weekly Weight progress */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <span className="font-sans font-bold text-xs text-primary uppercase tracking-wide block mb-1">
              Weekly Weight
            </span>
            <span className="font-display text-2xl font-extrabold text-on-surface">
              {profile.weight} <span className="font-sans text-sm font-semibold text-[#3d4a3e]">kg</span>
            </span>
          </div>
          <div className="h-14 w-28 relative">
            <svg className="w-full h-full" viewBox="0 0 100 40">
              <path
                d="M5 35 Q 30 30, 45 28 T 80 15 T 95 5"
                fill="none"
                stroke="#4ade80"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="95" cy="5" fill="#006d36" r="4" />
            </svg>
          </div>
        </div>

        {/* Recharts Monthly Trends Column Bar Chart (Weight vs Workout) */}
        <div className="bg-surface-container-low rounded-[2rem] p-5 border border-primary-container/30">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans font-bold text-xs text-[#3d4a3e] uppercase tracking-wide">
              Monthly Trends
            </span>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-on-surface">Weight</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-[10px] font-bold text-on-surface">Activity</span>
              </div>
            </div>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEK_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "transparent" }} wrapperStyle={{ fontSize: 11, fontFamily: "Quicksand" }} />
                <Bar dataKey="Weight" fill="#006d36" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Activity" fill="#fd933d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macros: Protein & Carbs stack */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Macro: Protein */}
          <div className="bg-primary-container/10 rounded-[2rem] p-5 border border-primary-container/20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center mb-2.5 text-primary">
              <Egg className="w-5 h-5" />
            </div>
            <span className="font-sans font-bold text-xs text-primary uppercase tracking-wide">
              Protein
            </span>
            <span className="font-display text-xl font-bold text-on-background mt-0.5">
              {proteinConsumed}g
            </span>
            <div className="w-full h-1.5 bg-primary/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${proteinPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Macro: Carbs */}
          <div className="bg-secondary-container/10 rounded-[2rem] p-5 border border-secondary-container/20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center mb-2.5 text-secondary">
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-sans font-bold text-xs text-secondary uppercase tracking-wide">
              Carbs
            </span>
            <span className="font-display text-xl font-bold text-on-background mt-0.5">
              {carbsConsumed}g
            </span>
            <div className="w-full h-1.5 bg-secondary/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-300"
                style={{ width: `${carbsPercent}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Macro Fats: Full Width */}
        <div className="bg-tertiary-container/15 rounded-[2rem] p-6 border border-tertiary-container/20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-tertiary-container/30 rounded-[1rem] flex items-center justify-center text-tertiary">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-tertiary uppercase block">
                Healthy Fats
              </span>
              <span className="font-display text-lg font-bold text-on-background">
                {fatsConsumed}g / {fatsTarget}g
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-sans">
            <span>Target met!</span>
          </div>
        </div>

      </section>

      {/* Goal Tracking Widget */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-lg font-bold text-on-background">Goal Tracking 🎯</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
            Active Quest
          </span>
        </div>
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-end mb-1">
            <div>
              <span className="font-display text-3xl font-black text-on-surface">
                {progressPercent}%
              </span>
              <span className="font-sans text-xs font-bold text-[#3d4a3e] ml-1.5 uppercase">
                Complete
              </span>
            </div>
            <div className="text-right">
              <span className="block font-sans text-[10px] font-bold text-secondary uppercase tracking-wider">
                Target Weight
              </span>
              <span className="font-display text-base font-bold text-primary">
                {targetW.toFixed(1)} kg
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 shadow-inner"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="font-sans text-xs text-[#3d4a3e] font-semibold leading-relaxed leading-relaxed opacity-90">
            {goalStatusText}
          </p>
        </div>
      </section>

      {/* Achievements / Trophy Milestones card cabinet */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-lg font-bold text-on-background">Milestones 🏆</h2>
          <span className="text-primary font-sans text-xs font-bold">Cabinet view</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar scroll-smooth">
          
          {/* Badge 1 */}
          <div className="min-w-[140px] bg-white border border-gray-100 rounded-3xl p-5 flex flex-col items-center text-center transition-all hover:scale-105">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center mb-3 shadow-md shadow-amber-500/10">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="font-sans font-bold text-sm text-on-background leading-tight">
              Glow Up Badge
            </span>
            <span className="font-sans text-[11px] text-primary font-bold mt-1">Unlocked</span>
          </div>

          {/* Badge 2 */}
          <div className="min-w-[140px] bg-white border border-gray-100 rounded-3xl p-5 flex flex-col items-center text-center transition-all hover:scale-105">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-600 flex items-center justify-center mb-3 shadow-md shadow-blue-500/10">
              <Zap className="w-7 h-7 text-white animate-pulse" />
            </div>
            <span className="font-sans font-bold text-sm text-on-background leading-tight">
              Fast Mover
            </span>
            <span className="font-sans text-[11px] text-primary font-bold mt-1">Unlocked</span>
          </div>

          {/* Badge 3 (Locked) */}
          <div className="min-w-[140px] bg-white border border-gray-100 rounded-3xl p-5 flex flex-col items-center text-center transition-all hover:scale-105 opacity-65 grayscale">
            <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center mb-3">
              <Shield className="w-7 h-7 text-[#3d4a3e]" />
            </div>
            <span className="font-sans font-bold text-sm text-[#3d4a3e] leading-tight">
              Iron Will
            </span>
            <span className="font-sans text-[10px] text-[#3d4a3e] font-bold mt-1">Locked (8/10)</span>
          </div>

        </div>
      </section>

      {/* Friends crushing it Activity hook */}
      <section className="mb-4">
        <button
          type="button"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="w-full bg-[#111c2d] hover:bg-[#18273d] text-white rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-between text-left transition-all cursor-pointer shadow-md select-none focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF5_tajLPIHktJureYvf8vTjgYF1RjseYf43rtpHFTYHER2_RTh2BWtvknBJGZgzdkomhRZnT-Af7qOHNdtQ6nH_9mUy1TZvzAD3kGpKa1DF4YZoZ7M3wg9hrUuat811UYFJ2y0JbHVnP7nunSP8OSO1MCxL4AuTa21p_Do2v8Xe5lbnh3jEPyQUXEV51OC2N44k8N6UfKEEAIBDTimHLOU4jaPLdGoAy20VtWa2juFk7CtSA1NhE_pqZzq0tBjLS69wPec_OkBPY"
                alt="Friend 1"
                className="w-10 h-10 rounded-full border-2 border-[#111c2d] object-cover"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZyJ2ee6P30zx1vWA0t09UJ0vLaGdZASwLtf_M2Mc6E45M35GhP_g6OVislTvf_OugT0OzDdM2CaOUvM8bpYP62I8lgf8ihLW_oQ7KlBzD3EV9k1BysALPfV41USD-pQy69S-XROWaVl1ZrLPd_OK-L9OWECZbDef4Pq-nTHMh7r6_uoX9dEtSSlTUC_mDvTfXCyFUICQIR4aBLjednE3p2QBg84_Qw4Rlmg4JQNuWRYbGfHK6Nk2OH4fVHAFolfaG66Effmpgujg"
                alt="Friend 2"
                className="w-10 h-10 rounded-full border-2 border-[#111c2d] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="w-10 h-10 rounded-full border-2 border-[#111c2d] bg-primary-container text-[#005e2d] flex items-center justify-center text-[11px] font-bold">
                +12
              </div>
            </div>
            <div>
              <p className="font-sans font-bold text-sm leading-tight text-white flex items-center gap-1.5">
                Friends are crushing it! <span className="bg-[#4ade80]/20 text-[#4ade80] px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Live</span>
              </p>
              <p className="font-sans text-xs text-white/70 font-semibold mt-0.5">Alex just hit a 10km run. Tap to view scoreboard!</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0">
            {showLeaderboard ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </button>

        {/* Dynamic community leaderboards overlay segment */}
        {showLeaderboard && (
          <div className="mt-4 p-5 bg-white border border-gray-100 rounded-[2rem] shadow-lg animate-fade-in-down space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <span className="font-sans text-xs font-bold text-[#3d4a3e] uppercase tracking-wide">
                Community Standings
              </span>
              <span className="text-[10px] font-bold text-[#006d36] bg-[#006d36]/10 px-2 py-0.5 rounded-full">
                Weekly Active Log
              </span>
            </div>
            
            <div className="space-y-3.5">
              {/* Leaderboard Item: Mia */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF5_tajLPIHktJureYvf8vTjgYF1RjseYf43rtpHFTYHER2_RTh2BWtvknBJGZgzdkomhRZnT-Af7qOHNdtQ6nH_9mUy1TZvzAD3kGpKa1DF4YZoZ7M3wg9hrUuat811UYFJ2y0JbHVnP7nunSP8OSO1MCxL4AuTa21p_Do2v8Xe5lbnh3jEPyQUXEV51OC2N44k8N6UfKEEAIBDTimHLOU4jaPLdGoAy20VtWa2juFk7CtSA1NhE_pqZzq0tBjLS69wPec_OkBPY"
                      alt="Mia Flores"
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary/25"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full w-4 h-4 text-[9px] font-black flex items-center justify-center border border-white">
                      1
                    </span>
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-xs text-on-surface">Mia Flores</h5>
                    <p className="font-sans text-[10px] text-[#3d4a3e] font-semibold">9,420 steps today</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#e0a905] bg-amber-500/10 px-2 py-0.5 rounded-full">
                    🔥 12 days
                  </span>
                  <button
                    type="button"
                    onClick={() => setMiaCheered(!miaCheered)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                      miaCheered
                        ? "bg-red-50 border-red-200 text-red-500 font-extrabold"
                        : "bg-primary-container/10 border-primary/20 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {miaCheered ? "❤️ Cheered" : "✨ Cheer"}
                  </button>
                </div>
              </div>

              {/* Leaderboard Item: Jordan */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZyJ2ee6P30zx1vWA0t09UJ0vLaGdZASwLtf_M2Mc6E45M35GhP_g6OVislTvf_OugT0OzDdM2CaOUvM8bpYP62I8lgf8ihLW_oQ7KlBzD3EV9k1BysALPfV41USD-pQy69S-XROWaVl1ZrLPd_OK-L9OWECZbDef4Pq-nTHMh7r6_uoX9dEtSSlTUC_mDvTfXCyFUICQIR4aBLjednE3p2QBg84_Qw4Rlmg4JQNuWRYbGfHK6Nk2OH4fVHAFolfaG66Effmpgujg"
                      alt="Jordan K."
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary/25"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-gray-300 text-white rounded-full w-4 h-4 text-[9px] font-black flex items-center justify-center border border-white">
                      2
                    </span>
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-xs text-on-surface">Jordan K.</h5>
                    <p className="font-sans text-[10px] text-[#3d4a3e] font-semibold">12,100 steps today</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#e0a905] bg-amber-500/10 px-2 py-0.5 rounded-full">
                    🔥 9 days
                  </span>
                  <button
                    type="button"
                    onClick={() => setJordanCheered(!jordanCheered)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                      jordanCheered
                        ? "bg-red-50 border-red-200 text-red-500 font-extrabold"
                        : "bg-primary-container/10 border-primary/20 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {jordanCheered ? "❤️ Cheered" : "✨ Cheer"}
                  </button>
                </div>
              </div>

              {/* Leaderboard Item: Zoe */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold border-2 border-primary/15 text-primary">
                      Z
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-amber-600 text-white rounded-full w-4 h-4 text-[9px] font-black flex items-center justify-center border border-white">
                      3
                    </span>
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-xs text-on-surface">Zoe Bell</h5>
                    <p className="font-sans text-[10px] text-[#3d4a3e] font-semibold">6,800 steps today</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#e0a905] bg-amber-500/10 px-2 py-0.5 rounded-full">
                    🔥 5 days
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoeCheered(!zoeCheered)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                      zoeCheered
                        ? "bg-red-50 border-red-200 text-red-500 font-extrabold"
                        : "bg-primary-container/10 border-primary/20 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {zoeCheered ? "❤️ Cheered" : "✨ Cheer"}
                  </button>
                </div>
              </div>

              {/* You Item */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#006d36]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-sans font-extrabold text-xs text-primary">You ({profile.name})</h5>
                    <p className="font-sans text-[9px] text-[#3d4a3e] font-bold uppercase">Weight: {profile.weight} kg</p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#006d36] bg-[#eefaf4] border border-[#d2f3e2] px-3 py-1 rounded-full">
                    🔥 Active State
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

    </div>
  );
}
