import { useState, FormEvent } from "react";
import { LoggedActivity } from "../types";
import { WORKOUTS, WorkoutData } from "../data/workouts";
import WorkoutPlayerModal from "./WorkoutPlayerModal";
import { Flame, Clock, RefreshCw, Smartphone, Play, Compass, Sun, Check, Plus, Video, Sparkles } from "lucide-react";

interface ActivityTabProps {
  loggedActivities: LoggedActivity[];
  onAddWorkout: (workout: Omit<LoggedActivity, "id" | "timestamp">) => void;
  onSync: () => void;
  syncing: boolean;
}

export default function ActivityTab({
  loggedActivities,
  onAddWorkout,
  onSync,
  syncing
}: ActivityTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [customName, setCustomName] = useState("Running");
  const [customMin, setCustomMin] = useState(30);
  const [customKcal, setCustomKcal] = useState(250);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutData | null>(null);

  // Total metrics
  const totalCal = loggedActivities.reduce((sum, act) => sum + act.caloriesBurned, 0);
  const totalMin = loggedActivities.reduce((sum, act) => sum + act.minutes, 0);
  
  // Percent complete towards the 60 minutes target
  const dailyTargetMin = 60;
  const percentComplete = Math.min(100, Math.round((totalMin / dailyTargetMin) * 100));

  const handleCreateWorkout = (e: FormEvent) => {
    e.preventDefault();
    onAddWorkout({
      name: customName,
      minutes: Number(customMin),
      caloriesBurned: Number(customKcal),
      type: "Intense"
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 pb-32 animate-fade-in text-on-background">
      {/* Active Living Hero Header */}
      <section className="relative overflow-hidden rounded-[2rem] p-8 bg-gradient-to-br from-[#944a00] to-[#fd933d] text-white shadow-lg">
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-extrabold mb-1">Active Living</h2>
          <p className="font-sans text-sm text-amber-50 opacity-90 max-w-[250px] font-semibold leading-relaxed">
            Keep moving, keep growing. Your daily athletic energy starts here.
          </p>
          <button
            onClick={onSync}
            disabled={syncing}
            className="mt-6 px-6 py-3.5 bg-white text-secondary hover:bg-amber-50 rounded-full font-sans font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing Vibe..." : "Sync Device"}
          </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-20 transform rotate-12">
          <Smartphone className="w-40 h-40" />
        </div>
      </section>

      {/* Daily Workout Stats */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-lg font-bold text-on-surface">Daily Workout</h3>
          <span className="text-primary font-sans font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
            Today
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Calories Burned card */}
          <div className="bg-white/40 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/60 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mb-3">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <span className="font-display text-3xl font-black text-primary">
              {totalCal}
            </span>
            <span className="font-sans text-xs text-[#3d4a3e] font-bold uppercase tracking-wider mt-1">
              kcal burned
            </span>
          </div>

          {/* Active Minutes card */}
          <div className="bg-white/40 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/60 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <span className="font-display text-3xl font-black text-tertiary">
              {totalMin}
            </span>
            <span className="font-sans text-xs text-[#3d4a3e] font-bold uppercase tracking-wider mt-1">
              min active
            </span>
          </div>
        </div>
      </section>

      {/* Quick Add Activity Trigger */}
      <section className="bg-transparent">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full h-14 border-2 border-dashed border-primary-container hover:bg-primary-container/5 rounded-2xl flex items-center justify-center gap-2 text-primary font-sans font-bold text-sm cursor-pointer transition-all"
          >
            <Plus className="w-5 h-5" />
            Log Activity
          </button>
        ) : (
          <form
            onSubmit={handleCreateWorkout}
            className="p-5 bg-white/70 border border-white/40 rounded-3xl space-y-4 shadow-md"
          >
            <h4 className="font-display text-sm font-bold text-on-surface">Log New Workout</h4>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Workout Name (e.g., Running)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                className="h-11 px-3 bg-white border border-[#bccabb] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Minutes"
                  value={customMin}
                  onChange={(e) => setCustomMin(Number(e.target.value))}
                  required
                  min={1}
                  className="h-11 px-3 bg-white border border-[#bccabb] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
                <input
                  type="number"
                  placeholder="Kcal Burned"
                  value={customKcal}
                  onChange={(e) => setCustomKcal(Number(e.target.value))}
                  required
                  min={1}
                  className="h-11 px-3 bg-white border border-[#bccabb] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-bold text-[#3d4a3e] hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-95"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Activity Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-lg font-bold text-on-surface">Interactive Workout Videos</h3>
          <span className="text-[10px] text-gray-400 font-mono tracking-wider flex items-center gap-1.5 uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Stream
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {WORKOUTS.map((workout) => (
            <div
              key={workout.id}
              className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all group duration-300"
            >
              {/* Card Banner Image */}
              <div className="relative h-44 overflow-hidden w-full bg-neutral-100">
                <img
                  src={workout.image}
                  alt={workout.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float type tags */}
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider text-white shadow-sm ${
                  workout.type === "Intense" 
                    ? "bg-red-600/90" 
                    : workout.type === "Zen" 
                      ? "bg-purple-600/95" 
                      : "bg-[#00aa50]/90"
                }`}>
                  {workout.type}
                </span>

                {/* Instant Quick Log overlay button */}
                <button
                  type="button"
                  title="Quick-Log Workout without watching"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddWorkout({
                      name: workout.name,
                      minutes: workout.durationMinutes,
                      caloriesBurned: workout.caloriesBurned,
                      type: workout.type
                    });
                  }}
                  className="absolute top-4 right-4 h-9 px-3 bg-white/40 hover:bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-primary transition-all shadow-md cursor-pointer border border-white/20 hover:scale-105 gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-sans font-bold select-none">Log</span>
                </button>

                {/* Video Indicator bottom left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  <Video className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-white font-mono text-[9px] font-bold">Watch &amp; Do It!</span>
                </div>
              </div>

              {/* Descriptive details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-sans font-bold text-sm text-on-surface group-hover:text-primary transition-colors leading-snug">
                    {workout.name}
                  </h4>
                  <p className="font-sans text-[11px] text-[#3d4a3e] font-semibold mt-1.5 leading-relaxed">
                    {workout.description}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {/* Workout Info badge row */}
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-semibold font-sans">
                    <div className="flex items-center gap-1 bg-white/50 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{workout.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 px-2.5 py-1 rounded-lg">
                      <Flame className="w-3.5 h-3.5 text-[#ff8138] fill-current" />
                      <span>{workout.caloriesBurned} kcal</span>
                    </div>
                  </div>

                  {/* Play video follow along action */}
                  <button
                    type="button"
                    onClick={() => setSelectedWorkout(workout)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#006d36] to-[#4ade80] text-white rounded-full font-sans font-bold text-xs shadow-sm hover:shadow-md hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                    <span>Watch Exercise &amp; Gym Play</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Circle Goals Progress */}
      <section className="mb-8">
        <div className="bg-white/40 border border-white/50 backdrop-blur-md p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex-shrink-0">
              {/* Progress Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-200"
                  cx="40"
                  cy="40"
                  fill="transparent"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <circle
                  className="text-primary transition-all duration-500"
                  cx="40"
                  cy="40"
                  fill="transparent"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 - (percentComplete / 100) * (2 * Math.PI * 34)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-sm font-black text-primary">
                  {percentComplete}%
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-display text-base font-bold text-on-surface">Daily Goal</h4>
              <p className="font-sans text-xs text-[#3d4a3e] font-semibold leading-relaxed mt-0.5">
                {percentComplete >= 100
                  ? "Congrats! Your dynamic daily active goal is completed! 🌟"
                  : `You're only ${Math.max(0, dailyTargetMin - totalMin)} minutes away from your custom daily target goal!`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {selectedWorkout && (
        <WorkoutPlayerModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onAddWorkout={onAddWorkout}
        />
      )}
    </div>
  );
}
