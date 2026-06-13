import { LoggedMeal, UserProfile, getCalorieTarget } from "../types";
import { Flame, Droplet, Footprints, Plus, ChevronRight, Scale, Activity, Check, Apple } from "lucide-react";

interface DashTabProps {
  profile: UserProfile;
  loggedMeals: LoggedMeal[];
  hydration: number;
  steps: number;
  dailyActivityCal: number;
  dailyActivityMin: number;
  onAddWater: () => void;
  onAddSteps: () => void;
  onEatSnack: (snackName: string, calories: number) => void;
  onOpenLogMeal: () => void;
  isSnackEaten: boolean;
}

export default function DashTab({
  profile,
  loggedMeals,
  hydration,
  steps,
  dailyActivityCal,
  dailyActivityMin,
  onAddWater,
  onAddSteps,
  onEatSnack,
  onOpenLogMeal,
  isSnackEaten
}: DashTabProps) {
  
  // Dynamic kcal calculation
  const targetKcal = getCalorieTarget(profile);
  const consumedKcal = loggedMeals.reduce((sum, m) => sum + m.calories, 0);
  const percentKcal = Math.min(100, Math.round((consumedKcal / targetKcal) * 100));
  const kcalToGo = Math.max(0, targetKcal - consumedKcal);

  // Circular progress math
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentKcal / 100) * circumference;

  return (
    <div className="space-y-8 pb-32 animate-fade-in">
      {/* Welcome Header */}
      <section className="flex justify-between items-center bg-transparent mt-2">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-on-background">
            Hey, {profile.name}! 👋
          </h2>
          <p className="font-sans text-[#3d4a3e] font-semibold">
            You're crushing your goals today. Keep it up!
          </p>
        </div>
      </section>

      {/* Primary Calorie Progress Card */}
      <section className="bg-gradient-to-br from-[#4ade80] to-[#006d36] p-6 rounded-[2rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <p className="font-sans text-xs font-bold uppercase tracking-widest opacity-90">
              Daily Fuel
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold">
                {consumedKcal.toLocaleString()}
              </span>
              <span className="font-sans text-base opacity-80">
                / {targetKcal.toLocaleString()} kcal
              </span>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-white animate-pulse" />
              <span className="font-sans font-bold text-xs">
                {kcalToGo > 0 ? `${kcalToGo} kcal to go!` : "Goal met! Fuel target achieved! 🚀"}
              </span>
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-white/20"
                cx="56"
                cy="56"
                fill="transparent"
                r={normalizedRadius}
                stroke="currentColor"
                strokeWidth={stroke}
              />
              <circle
                className="text-white transition-all duration-500 ease-in-out"
                cx="56"
                cy="56"
                fill="transparent"
                r={normalizedRadius}
                stroke="currentColor"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-xl font-extrabold">{percentKcal}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 gap-4">
        {/* Hydration Card */}
        <div className="bg-surface-container-low p-5 rounded-[1.5rem] border border-white/60 shadow-sm space-y-3 hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <button
              onClick={onAddWater}
              className="text-xs text-blue-600 font-extrabold bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
            >
              + Glass
            </button>
          </div>
          <div>
            <h3 className="font-sans font-bold text-xs text-[#3d4a3e] uppercase tracking-wide">
              Hydration
            </h3>
            <p className="font-display text-xl font-bold text-on-background">
              {hydration.toFixed(1)}{" "}
              <span className="font-sans text-xs font-medium text-[#3d4a3e]">
                / 2.5L
              </span>
            </p>
          </div>
          <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (hydration / 2.5) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-surface-container-low p-5 rounded-[1.5rem] border border-white/60 shadow-sm space-y-3 hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Footprints className="w-5 h-5" />
            </div>
            <button
              onClick={onAddSteps}
              className="text-xs text-orange-600 font-extrabold bg-orange-50 px-2 py-1 rounded-full hover:bg-orange-100 cursor-pointer transition-colors"
            >
              + Steps
            </button>
          </div>
          <div>
            <h3 className="font-sans font-bold text-xs text-[#3d4a3e] uppercase tracking-wide">
              Steps
            </h3>
            <p className="font-display text-xl font-bold text-on-background">
              {steps.toLocaleString()}
            </p>
          </div>
          <div className="w-full bg-orange-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Daily Activity (Full Width for alignment) */}
        <div className="col-span-2 bg-surface-container-low p-5 rounded-[1.5rem] border border-white/60 shadow-sm space-y-3 hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-xs text-[#3d4a3e] uppercase tracking-wide">
                  Daily Activity
                </h3>
                <p className="font-display text-lg font-bold text-on-background">
                  {dailyActivityCal} kcal
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-sans text-xs font-bold text-primary bg-primary-container/20 px-3 py-1 rounded-full">
                {dailyActivityMin} mins active
              </span>
            </div>
          </div>
          <div className="w-full bg-primary-container/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (dailyActivityMin / 60) * 100)}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Suggested Snack Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-display text-lg font-bold text-on-surface">Suggested Snack</h3>
          <span className="text-xs font-bold text-[#3d4a3e]">Healthy Choice</span>
        </div>
        <div className="relative rounded-[2rem] overflow-hidden shadow-lg group">
          <img
            alt="Rainbow Acai Recovery Bowl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoNA7EcrnMqRKPo-BH5BdAqEh-DelV54Tw5UsVVCLybJfDJCx37gCZcYGZTdVxGhLBJgpMQQFoeIDuTXweuSgUlwSqrbHsWofJTZF_GKyCIjq36GCCM6kdYPy-6zCeELMBgx5i1b6KhdGjw3bEnQehN-s1SnGpaE9G7aulOzLAre1fkqpNL1vpJCIHDzqmnVE_n-3cPpdBZ7l5kCjbQwnB7gYsUyhB-31rC0IiOo67GwREodHW-_pw3xnIvzoChdl-NNH5S4eeGNo"
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white font-sans text-xs font-semibold">
                    High Protein
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white font-sans text-xs font-semibold">
                    Under 300 kcal
                  </span>
                </div>
                <h4 className="text-white font-display text-xl font-bold mb-1">
                  Rainbow Acai Recovery Bowl
                </h4>
                <p className="text-white/80 font-sans text-sm">
                  Packed with antioxidants and energy-boosting organic granola.
                </p>
              </div>
              <button
                onClick={() => onEatSnack("Rainbow Acai Recovery Bowl", 280)}
                disabled={isSnackEaten}
                className={`flex-shrink-0 w-12 h-12 rounded-full cursor-pointer transition-all flex items-center justify-center ${
                  isSnackEaten
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-white text-primary hover:scale-110 shadow-lg"
                }`}
              >
                {isSnackEaten ? <Check className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Weight & Body Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-2 border border-white/20 shadow-sm">
          <div className="text-3xl text-secondary">⚖️</div>
          <p className="font-sans font-bold text-xs text-[#3d4a3e] uppercase">Current Weight</p>
          <p className="font-display text-2xl font-black text-on-surface">
            {profile.weight} <span className="font-sans text-sm font-semibold text-[#3d4a3e]">kg</span>
          </p>
        </div>
        <div className="bg-surface-container p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-2 border border-white/20 shadow-sm">
          <div className="text-3xl text-primary">💪</div>
          <p className="font-sans font-bold text-xs text-[#3d4a3e] uppercase">Muscle Mass</p>
          <p className="font-display text-2xl font-black text-on-surface">
            32.1 <span className="font-sans text-sm font-semibold text-[#3d4a3e]">%</span>
          </p>
        </div>
      </section>

      {/* FAB: Log Meal */}
      <button
        onClick={onOpenLogMeal}
        className="fixed right-6 bottom-24 w-15 h-15 rounded-full bg-gradient-to-tr from-[#006d36] to-[#4ade80] text-white shadow-2xl shadow-primary/40 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </button>
    </div>
  );
}
