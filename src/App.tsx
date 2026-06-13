import { useState, useEffect, FormEvent } from "react";
import { UserProfile, LoggedMeal, LoggedActivity, GoalType } from "./types";
import DashTab from "./components/DashTab";
import MealsTab from "./components/MealsTab";
import ActivityTab from "./components/ActivityTab";
import StatsTab from "./components/StatsTab";
import ProfileTab from "./components/ProfileTab";
import OnboardingModal, { AVATARS } from "./components/OnboardingModal";
import { LayoutDashboard, Utensils, BarChart3, User, Plus, X, Bell, Dumbbell, Flame, Sparkles } from "lucide-react";

export default function App() {
  // 1. Core Profile state (persisted or default)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("vitality_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      name: "Alex",
      age: 16,
      weight: 68.5,
      targetWeight: 72.0,
      avatarUrl: AVATARS[0].url,
      avatarName: AVATARS[0].name,
      goalType: GoalType.MUSCLE_GAIN
    };
  });

  // 2. Tab selection
  const [activeTab, setActiveTab] = useState<"Dash" | "Meals" | "Activity" | "Stats" | "Profile">("Dash");

  // 3. Hydration state
  const [hydration, setHydration] = useState(() => {
    const saved = localStorage.getItem("vitality_hydration");
    return saved ? Number(saved) : 1.8;
  });

  // 4. Steps state
  const [steps, setSteps] = useState(() => {
    const saved = localStorage.getItem("vitality_steps");
    return saved ? Number(saved) : 8432;
  });

  // 5. Daily workout stats
  const [dailyActivityCal, setDailyActivityCal] = useState(() => {
    const saved = localStorage.getItem("vitality_act_cal");
    return saved ? Number(saved) : 420;
  });
  const [dailyActivityMin, setDailyActivityMin] = useState(() => {
    const saved = localStorage.getItem("vitality_act_min");
    return saved ? Number(saved) : 45;
  });

  // 6. Logged meals (Prepopulate with items that sum to exactly 1,450 kcal to match start visuals!)
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(() => {
    const saved = localStorage.getItem("vitality_meals");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: "m-base-1",
        name: "Morning Berry Smoothie",
        calories: 320,
        protein: 15,
        carbs: 45,
        fats: 6,
        category: "Breakfast",
        timestamp: new Date().toISOString()
      },
      {
        id: "m-base-2",
        name: "Supreme Avocado Toast Platter",
        calories: 550,
        protein: 20,
        carbs: 65,
        fats: 22,
        category: "Breakfast",
        timestamp: new Date().toISOString()
      },
      {
        id: "m-base-3",
        name: "Tuna Quinoa Fit Bowl",
        calories: 580,
        protein: 40,
        carbs: 50,
        fats: 12,
        category: "Lunch",
        timestamp: new Date().toISOString()
      }
    ];
  });

  // 7. Logged activities list
  const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>(() => {
    const saved = localStorage.getItem("vitality_activities");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: "act-1",
        name: "Warmup Run & Drills",
        minutes: 25,
        caloriesBurned: 240,
        type: "Cardio",
        timestamp: new Date().toISOString()
      },
      {
        id: "act-2",
        name: "HIIT Endurance Work",
        minutes: 20,
        caloriesBurned: 180,
        type: "Intense",
        timestamp: new Date().toISOString()
      }
    ];
  });

  // Local indicators
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [logMealOpen, setLogMealOpen] = useState(false);
  const [isSnackEaten, setIsSnackEaten] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    const id = setTimeout(() => {
      setToastMessage((cur) => cur === message ? null : cur);
    }, 3000);
    return () => clearTimeout(id);
  };

  // Custom log meal form state
  const [customMealName, setCustomMealName] = useState("");
  const [customMealCategory, setCustomMealCategory] = useState<"Breakfast" | "Lunch" | "Dinner" | "Snack">("Breakfast");
  const [customMealKcal, setCustomMealKcal] = useState(300);
  const [customMealProtein, setCustomMealProtein] = useState(15);
  const [customMealCarbs, setCustomMealCarbs] = useState(35);
  const [customMealFats, setCustomMealFats] = useState(10);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("vitality_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("vitality_hydration", String(hydration));
  }, [hydration]);

  useEffect(() => {
    localStorage.setItem("vitality_steps", String(steps));
  }, [steps]);

  useEffect(() => {
    localStorage.setItem("vitality_act_cal", String(dailyActivityCal));
    localStorage.setItem("vitality_act_min", String(dailyActivityMin));
  }, [dailyActivityCal, dailyActivityMin]);

  useEffect(() => {
    localStorage.setItem("vitality_meals", JSON.stringify(loggedMeals));
  }, [loggedMeals]);

  useEffect(() => {
    localStorage.setItem("vitality_activities", JSON.stringify(loggedActivities));
  }, [loggedActivities]);

  // Actions
  const handleAddWater = () => {
    setHydration((prev) => Math.min(4.5, prev + 0.25));
    showToast("Gulp! Logged 250ml of hydration. Keep flowing! 💧");
  };

  const handleAddSteps = () => {
    setSteps((prev) => prev + 650);
    showToast("Nice stride! Added 650 steps to your journey. 🚶‍♂️");
  };

  const handleAddMeal = (meal: Omit<LoggedMeal, "id" | "timestamp">) => {
    const newMeal: LoggedMeal = {
      ...meal,
      id: "m-" + Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setLoggedMeals((prev) => [newMeal, ...prev]);
  };

  const handleEatSnack = (snackName: string, calories: number) => {
    if (isSnackEaten) return;
    setIsSnackEaten(true);
    handleAddMeal({
      name: snackName,
      calories: calories,
      protein: 12,
      carbs: 38,
      fats: 6,
      category: "Snack"
    });
    showToast(`Energy fuel! "${snackName}" logged successfully! 🍓`);
  };

  const handleAddWorkout = (workout: Omit<LoggedActivity, "id" | "timestamp">) => {
    const newAct: LoggedActivity = {
      ...workout,
      id: "act-" + Date.now(),
      timestamp: new Date().toISOString()
    };
    setLoggedActivities((prev) => [newAct, ...prev]);
    setDailyActivityCal((c) => c + workout.caloriesBurned);
    setDailyActivityMin((m) => m + workout.minutes);
    showToast(`Logged "${workout.name}"! +${workout.caloriesBurned} kcal burned. 🔥`);
  };

  const handleSyncDevice = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      // Simulate fitness bands updates
      setSteps((s) => s + 1200);
      setDailyActivityCal((c) => c + 150);
      setDailyActivityMin((m) => m + 15);
      
      const newAct: LoggedActivity = {
        name: "Synced Fitbit Move",
        minutes: 15,
        caloriesBurned: 150,
        type: "Active Sync",
        id: "act-" + Date.now(),
        timestamp: new Date().toISOString()
      };
      setLoggedActivities((prev) => [newAct, ...prev]);
      
      showToast("Wearbase synced successfully! Loaded workouts & steps. ⌚");
    }, 1500);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setOnboardingOpen(false);
    showToast(`Welcome, ${newProfile.name}! Goals successfully re-calibrated. ⚡`);
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("vitality_profile", JSON.stringify(next));
      return next;
    });
    showToast("Profile updated! Meal suggestions dynamically adapted. ⚡");
  };

  const handleCustomMealSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customMealName.trim()) return;
    handleAddMeal({
      name: customMealName,
      calories: Number(customMealKcal),
      protein: Number(customMealProtein),
      carbs: Number(customMealCarbs),
      fats: Number(customMealFats),
      category: customMealCategory
    });
    setCustomMealName("");
    setLogMealOpen(false);
    showToast(`Logged customized intake: "${customMealName}" [${customMealKcal} kcal]! 🍽️`);
  };

  return (
    <div className="bg-background text-on-background font-sans min-h-screen relative flex flex-col no-scrollbar">

      {/* TopAppBar Navigation Header */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="flex justify-between items-center px-5 h-16 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-container">
              <img
                src={profile.avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="font-display text-xl font-extrabold text-primary">Vitality Hub</h1>
          </div>
          
          <button
            onClick={() => {
              // Notification micro-interaction
              showToast(`Hey ${profile.name}! You've logged ${loggedMeals.length} fuel entries today. Your streak is safe! 🔥`);
            }}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-primary cursor-pointer active:scale-95 transition-all"
          >
            <Bell className="w-5 h-5 text-primary stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 w-full max-w-2xl mx-auto pt-20 px-5 relative h-full">
        {activeTab === "Dash" && (
          <DashTab
            profile={profile}
            loggedMeals={loggedMeals}
            hydration={hydration}
            steps={steps}
            dailyActivityCal={dailyActivityCal}
            dailyActivityMin={dailyActivityMin}
            onAddWater={handleAddWater}
            onAddSteps={handleAddSteps}
            onEatSnack={handleEatSnack}
            onOpenLogMeal={() => setLogMealOpen(true)}
            isSnackEaten={isSnackEaten}
          />
        )}

        {activeTab === "Meals" && (
          <MealsTab
            profile={profile}
            loggedMeals={loggedMeals}
            onAddMeal={handleAddMeal}
            hydration={hydration}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === "Activity" && (
          <ActivityTab
            loggedActivities={loggedActivities}
            onAddWorkout={handleAddWorkout}
            onSync={handleSyncDevice}
            syncing={syncing}
          />
        )}

        {activeTab === "Stats" && (
          <StatsTab
            profile={profile}
            loggedMeals={loggedMeals}
          />
        )}

        {activeTab === "Profile" && (
          <ProfileTab
            profile={profile}
            totalCalBurned={dailyActivityCal}
            onTriggerOnboarding={() => setOnboardingOpen(true)}
          />
        )}
      </main>

      {/* Form Dialog Option: Log Custom Meal Modal */}
      {logMealOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-6 w-full max-w-md shadow-2xl relative animate-scale-up border border-white">
            <button
              type="button"
              onClick={() => setLogMealOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-display text-xl font-bold text-on-surface mb-2">Log Intake</h3>
            <p className="font-sans text-xs text-[#3d4a3e] font-semibold mb-6">Record custom physical fuel & nutrient variables.</p>
            
            <form onSubmit={handleCustomMealSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#3d4a3e] uppercase">Meal Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scrambled Eggs & Granola"
                  value={customMealName}
                  onChange={(e) => setCustomMealName(e.target.value)}
                  className="w-full h-12 px-3 bg-gray-50 border border-[#bccabb] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3d4a3e] uppercase">Category</label>
                  <select
                    value={customMealCategory}
                    onChange={(e: any) => setCustomMealCategory(e.target.value)}
                    className="w-full h-12 px-3 bg-gray-50 border border-[#bccabb] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container font-sans"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3d4a3e] uppercase">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={customMealKcal}
                    onChange={(e) => setCustomMealKcal(Number(e.target.value))}
                    className="w-full h-12 px-3 bg-gray-50 border border-[#bccabb] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-1">
                <div className="space-y-1 text-center">
                  <label className="text-[10px] font-bold text-[#3d4a3e] uppercase">Protein (g)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={customMealProtein}
                    onChange={(e) => setCustomMealProtein(Number(e.target.value))}
                    className="w-full h-10 px-2 bg-gray-50 border border-[#bccabb] rounded-xl text-center"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <label className="text-[10px] font-bold text-[#3d4a3e] uppercase">Carbs (g)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={customMealCarbs}
                    onChange={(e) => setCustomMealCarbs(Number(e.target.value))}
                    className="w-full h-10 px-2 bg-gray-50 border border-[#bccabb] rounded-xl text-center"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <label className="text-[10px] font-bold text-[#3d4a3e] uppercase">Fats (g)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={customMealFats}
                    onChange={(e) => setCustomMealFats(Number(e.target.value))}
                    className="w-full h-10 px-2 bg-gray-50 border border-[#bccabb] rounded-xl text-center"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setLogMealOpen(false)}
                  className="w-1/2 py-3.5 bg-gray-100 hover:bg-gray-200 text-[#3d4a3e] rounded-full font-sans font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-sans font-bold text-sm shadow-md hover:opacity-95 cursor-pointer"
                >
                  Save Energy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Primary Onboarding setup */}
      {onboardingOpen && (
        <OnboardingModal
          initialProfile={profile}
          onSave={handleSaveProfile}
          isDismissable={true}
          onClose={() => setOnboardingOpen(false)}
        />
      )}

      {/* Navigation Footer Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/80 backdrop-blur-xl border-t border-white/40 shadow-[0_-4px_20px_rgba(0,109,54,0.05)] rounded-t-2xl pb-1.5 pt-1.5">
        <div className="flex justify-around items-center h-16 max-w-2xl mx-auto text-center px-2">
          
          {/* Dash tab controller */}
          <button
            onClick={() => setActiveTab("Dash")}
            className={`flex flex-col items-center justify-center cursor-pointer py-1.5 transition-all text-on-surface-variant ${
              activeTab === "Dash"
                ? "bg-primary-container/20 text-[#005e2d] px-5 rounded-full font-bold scale-105"
                : "hover:text-primary px-3"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-sans text-[10px] font-bold mt-0.5">Dash</span>
          </button>

          {/* Meals tab controller */}
          <button
            onClick={() => setActiveTab("Meals")}
            className={`flex flex-col items-center justify-center cursor-pointer py-1.5 transition-all text-on-surface-variant ${
              activeTab === "Meals"
                ? "bg-primary-container/20 text-[#005e2d] px-5 rounded-full font-bold scale-105"
                : "hover:text-primary px-3"
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span className="font-sans text-[10px] font-bold mt-0.5">Meals</span>
          </button>

          {/* Activity tab controller */}
          <button
            onClick={() => setActiveTab("Activity")}
            className={`flex flex-col items-center justify-center cursor-pointer py-1.5 transition-all text-on-surface-variant ${
              activeTab === "Activity"
                ? "bg-primary-container/20 text-[#005e2d] px-5 rounded-full font-bold scale-105"
                : "hover:text-primary px-3"
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="font-sans text-[10px] font-bold mt-0.5">Activity</span>
          </button>

          {/* Stats tab controller */}
          <button
            onClick={() => setActiveTab("Stats")}
            className={`flex flex-col items-center justify-center cursor-pointer py-1.5 transition-all text-on-surface-variant ${
              activeTab === "Stats"
                ? "bg-primary-container/20 text-[#005e2d] px-5 rounded-full font-bold scale-105"
                : "hover:text-[#005e2d] px-3"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-sans text-[10px] font-bold mt-0.5">Stats</span>
          </button>

          {/* Profile/Onboarding editor controller */}
          <button
            onClick={() => setActiveTab("Profile")}
            className={`flex flex-col items-center justify-center cursor-pointer py-1.5 transition-all text-on-surface-variant ${
              activeTab === "Profile"
                ? "bg-primary-container/20 text-[#005e2d] px-5 rounded-full font-bold scale-105"
                : "hover:text-primary px-3"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-sans text-[10px] font-bold mt-0.5">Profile</span>
          </button>

        </div>
      </nav>

      {/* Elegant Toast notification banner overlay */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#111c2d] text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-2xl border border-white/20 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-primary-container animate-pulse shrink-0" />
          <span className="font-sans text-xs font-bold leading-none select-none whitespace-nowrap">
            {toastMessage}
          </span>
        </div>
      )}

    </div>
  );
}

