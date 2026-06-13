import { UserProfile, GoalType } from "../types";
import { Dumbbell, Trophy, Rocket, Shield, Activity, Settings, UserCheck, Flame, RefreshCw, Sparkles, TrendingUp } from "lucide-react";

interface ProfileTabProps {
  profile: UserProfile;
  totalCalBurned: number;
  onTriggerOnboarding: () => void;
}

export default function ProfileTab({ profile, totalCalBurned, onTriggerOnboarding }: ProfileTabProps) {
  return (
    <div className="space-y-8 pb-32 animate-fade-in text-on-background">
      
      {/* Profile Header Block */}
      <section className="bg-white/40 border border-white/50 backdrop-blur-md rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-container ring-4 ring-primary/5">
            <img
              src={profile.avatarUrl}
              alt={profile.avatarName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-on-surface">
              {profile.name}
            </h2>
            <p className="font-sans text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase mt-1 inline-block">
              {profile.goalType}
            </p>
          </div>
        </div>
        
        <button
          onClick={onTriggerOnboarding}
          className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
          title="Edit Profile"
        >
          <Settings className="w-5 h-5" />
        </button>
      </section>

      {/* Welcome Hero Quest Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 bg-surface-container-low shadow-sm">
        <div className="relative z-10 max-w-lg">
          <h2 className="font-display text-xl font-black text-on-surface mb-2">Crush Your Goals!</h2>
          <p className="font-sans text-sm text-[#3d4a3e] font-semibold mb-6">
            You're on fire today. Let's see how much closer you are to youth athletic greatness.
          </p>
          <button
            onClick={onTriggerOnboarding}
            className="bg-gradient-to-r from-primary to-primary-container text-white font-sans font-bold text-xs px-6 py-3 rounded-full shadow-lg shadow-primary/10 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Set New Goal
          </button>
        </div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-secondary-container/25 rounded-full blur-2xl"></div>
      </section>

      {/* Main Goals / Active Quests */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-lg font-bold text-on-surface">Active Quests</h3>
          <span className="text-primary font-sans text-xs font-bold">Onward</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          
          {/* Quest 1: Muscle Gain */}
          <div className="bg-white/50 border border-white/60 rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-primary-container/20 rounded-2xl text-primary">
                <Dumbbell className="w-6 h-6" />
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-sans font-bold text-xs">
                On Track
              </span>
            </div>
            <div>
              <h4 className="font-display text-base font-extrabold text-on-surface">Muscle Gain</h4>
              <p className="font-sans text-xs text-[#3d4a3e] font-semibold">Target: +5kg Lean Mass</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between font-sans font-bold text-xs text-[#3d4a3e]">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <div className="h-2.5 w-full bg-[#d8e3fb] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full w-[65%]" />
              </div>
            </div>
          </div>

          {/* Quest 2: Endurance */}
          <div className="bg-white/50 border border-white/60 rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-secondary-container/20 rounded-2xl text-secondary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-sans font-bold text-xs">
                Pushing Hard
              </span>
            </div>
            <div>
              <h4 className="font-display text-base font-extrabold text-on-surface">Endurance Focus</h4>
              <p className="font-sans text-xs text-[#3d4a3e] font-semibold">Target: 10km Non-stop Run</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between font-sans font-bold text-xs text-[#3d4a3e]">
                <span>Progress</span>
                <span>42%</span>
              </div>
              <div className="h-2.5 w-full bg-[#d8e3fb] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#944a00] to-[#fd933d] rounded-full w-[42%]" />
              </div>
            </div>
          </div>

          {/* Quest 3: Healthy Glow */}
          <div className="bg-white/50 border border-white/60 rounded-[2rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-tertiary-container/20 rounded-2xl text-tertiary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-display text-base font-extrabold text-on-surface">Healthy Glow</h4>
                <p className="font-sans text-xs text-[#3d4a3e] font-semibold">Target: 30-day hydration streak</p>
              </div>
              <div className="flex gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="text-xl">🏆</span>
                <span className="text-xl">💧</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between font-sans font-bold text-xs text-[#3d4a3e]">
                <span>22 Days Complete</span>
                <span>8 Days Left</span>
              </div>
              <div className="h-2.5 w-full bg-[#d8e3fb] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-[#ffb47f] rounded-full w-[73%]" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Personal Bests / Achievement Badges */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-lg font-bold text-on-surface">Hall of Fame</h3>
          <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">Honors</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar scroll-smooth">
          
          {/* Achievement 1 */}
          <div className="min-w-[150px] bg-white border border-[#dee8ff] rounded-3xl p-5 text-center flex flex-col items-center gap-2 shadow-sm shadow-[#006d36]/5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#006d36] to-[#4ade80] rounded-full flex items-center justify-center text-white shadow-md">
              <Rocket className="w-6 h-6" />
            </div>
            <p className="font-sans font-bold text-sm text-on-surface leading-tight">Early Bird</p>
            <p className="font-sans text-[11px] text-[#3d4a3e] font-semibold">5AM Workout x 5</p>
          </div>

          {/* Achievement 2 */}
          <div className="min-w-[150px] bg-white border border-[#dee8ff] rounded-3xl p-5 text-center flex flex-col items-center gap-2 shadow-sm shadow-[#006d36]/5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#944a00] to-[#fd933d] rounded-full flex items-center justify-center text-white shadow-md">
              <Flame className="w-6 h-6" />
            </div>
            <p className="font-sans font-bold text-sm text-on-surface leading-tight">PR: Squat</p>
            <p className="font-sans text-[11px] text-[#3d4a3e] font-semibold">Reached 80kg</p>
          </div>

          {/* Achievement 3 (Locked) */}
          <div className="min-w-[150px] bg-white border border-[#dee8ff] rounded-3xl p-5 text-center flex flex-col items-center gap-2 shadow-sm shadow-[#006d36]/5 opacity-60">
            <div className="w-14 h-14 bg-[#f0f3ff] rounded-full flex items-center justify-center text-gray-400">
              <Shield className="w-6 h-6" />
            </div>
            <p className="font-sans font-bold text-sm text-[#3d4a3e] leading-tight">Iron Lung</p>
            <p className="font-sans text-[11px] text-gray-400 font-semibold">Keep going!</p>
          </div>

        </div>
      </section>

      {/* Stats Summary overview panel */}
      <section className="pb-8">
        <div className="bg-[#111c2d] rounded-[2rem] p-6 text-white relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary-container">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display text-base font-bold text-white">Weekly Impact</h4>
              <p className="font-sans text-xs font-bold text-primary-container">Level 14 Sports Coach AI</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="font-sans text-[10px] font-bold text-white/60 tracking-wider uppercase">Energy Burnt</p>
              <p className="font-display text-lg font-extrabold text-white">
                {(12400 + totalCalBurned).toLocaleString()} <span className="text-xs font-normal">kcal</span>
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="font-sans text-[10px] font-bold text-white/60 tracking-wider uppercase">Consistency</p>
              <p className="font-display text-lg font-extrabold text-white">98%</p>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#006d36]/20 rounded-full blur-[80px]"></div>
        </div>
      </section>

    </div>
  );
}
