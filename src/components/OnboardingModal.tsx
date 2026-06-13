import { useState, FormEvent } from "react";
import { UserProfile, GoalType } from "../types";
import { Flame, Cake, Dumbbell, Sparkles, RefreshCcw, Smile, Check, ArrowRight } from "lucide-react";

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose?: () => void;
  isDismissable?: boolean;
}

export const AVATARS = [
  {
    name: "Alex",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsoNqunSen9sehBkZFKdTQ_cCbL-SVxJgi4MdxqLEp7JWDf6zYCXLAaLKUvwJ9LlLnPfWAEEGsPaaNpqjWlb4Gvkh_gjPMfahXnT80aWBQ4k6R4bS2mQ-QVB8dVVFh-pC4TNpeYr-AqBGUz0Hc9ix4lf4BqGNwzEZ-pTNIqiJwaz812ai7cP2llzFQjcApzPGZKZrZ1mRw4ONvcM5nzMZUW4aphVsDg1Ujc33zaoQni8bBNbYQZXy8jePHHuh5WUjC9iZgcR1JEAQ",
  },
  {
    name: "Mia",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPzjw_21Gq71nTW9kZrQs8DCrepzII30RoFWse9otGZooUqVQWzzUak2jlmC9rHXZ8Z9bUNN7Q4m_DpsqrW-_ubus0fzy5sOZ-BFgmhX7CevFc0cXi_86yzH7zzpjlJdlXghipUUv4bIGA8C6O9Sl4o55PLckTsob1mgi-P-HResKN8wfNtIB7i0PlXc7ctreKWdr5a1hBPEoP_0_ugCoI2RjSXEVutXWLlNc028FSp1MFWT-0-7sBoBH1M7xZxop9dE7NVTXo1jo",
  },
  {
    name: "Jordan",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBatAKuCUEdHMYgiqLYvQQ2LeFDqBMpYJgWi32Bwg78cze9OdmScPz_YkuW9I0bveyUb9u_FwvQGI2YJuYM3W1nBur5r402EMzyRxSKj7qnsc0KlMD2hzwz9Pu2NoTCJJog7oIK8qjVcc0kvW-KYGNcbccLeaJ34WSgKeUMZuWhJJXMGtpn49xzNJdDxePJR7A8nA-WQj5pCicImBcBIgY7evj2eaW7wz7OGUptTNfe8AXelnK5lm8kDSfZAn_FPqNucF94TBUFuw",
  },
  {
    name: "Zoe",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2-EBaXxR2Vf8H1pDHPxzrV0kHSqJmIIWRfIvHr91ZmB1HFoTJa2bunUIX1lAyweGo30TrPdNYxgLofK7etDuZOFOW71pWWCNvuXxD2Z1OTHZ8jetrj_e1MmS9VBcrjGTonEbTqIzzWU4GxjDDUSokDpxG0yKihATfKh_pmxRUr0tBxPeSsERuP_t3RSmhnrONjl2oTMSw-vW4vH9uM1roZjrpqkow7cPbU0pisIQ20Zc-LLqgLJafPqYz5B1hK3GPwiLj-TY_G4M",
  }
];

export default function OnboardingModal({
  initialProfile,
  onSave,
  onClose,
  isDismissable = false
}: OnboardingModalProps) {
  const [name, setName] = useState(initialProfile.name || "Alex");
  const [age, setAge] = useState(initialProfile.age || 16);
  const [weight, setWeight] = useState(initialProfile.weight || 68.5);
  const [targetWeight, setTargetWeight] = useState(initialProfile.targetWeight || 72.0);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl || AVATARS[0].url);
  const [avatarName, setAvatarName] = useState(initialProfile.avatarName || AVATARS[0].name);
  const [goalType, setGoalType] = useState<GoalType>(initialProfile.goalType || GoalType.MUSCLE_GAIN);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name,
      age: Number(age),
      weight: Number(weight),
      targetWeight: Number(targetWeight),
      avatarUrl,
      avatarName,
      goalType
    });
  };

  const handleSelectAvatar = (url: string, avName: string) => {
    setAvatarUrl(url);
    setAvatarName(avName);
    // Also use avatar's name as user key placeholder if current name equals a default avatar name
    if (AVATARS.some(a => a.name === name)) {
      setName(avName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 overflow-y-auto no-scrollbar py-8 text-on-background">
      <main className="relative flex flex-col items-center px-5 max-w-lg mx-auto">
        <header className="text-center mb-8 pt-6">
          <h1 className="font-display text-3xl font-extrabold text-primary mb-2">
            Hey! Let's fuel your vibe.
          </h1>
          <p className="font-sans text-lg text-[#3d4a3e]">
            Your journey to peak vitality starts here.
          </p>
        </header>

        {/* Avatar Selection */}
        <section className="w-full mb-8">
          <label className="block font-sans font-bold text-sm text-[#3d4a3e] mb-4 px-2 tracking-wide uppercase">
            Pick your avatar
          </label>
          <div className="grid grid-cols-4 gap-4">
            {AVATARS.map((item) => {
              const isActive = avatarUrl === item.url;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleSelectAvatar(item.url, item.name)}
                  className={`relative aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                    isActive ? "border-primary-container ring-4 ring-primary/10 scale-105" : "border-transparent hover:border-primary-container/40"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/25 backdrop-blur-[1px]">
                      <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="bg-white/40 border border-white/40 backdrop-blur-md rounded-3xl p-6 space-y-6 shadow-xl shadow-primary/5">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block font-sans font-bold text-sm text-[#3d4a3e] tracking-wide uppercase">
                What should we call you?
              </label>
              <div className="relative">
                <Smile className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex"
                  className="w-full h-14 pl-12 pr-4 bg-white/70 border border-transparent rounded-2xl ring-2 ring-transparent focus:ring-primary-container focus:bg-white focus:outline-none shadow-sm transition-all text-on-background font-sans font-semibold text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Age Input */}
              <div className="space-y-2">
                <label htmlFor="age" className="block font-sans font-bold text-sm text-[#3d4a3e] tracking-wide uppercase">
                  Age
                </label>
                <div className="relative">
                  <Cake className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <input
                    id="age"
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    placeholder="16"
                    className="w-full h-14 pl-12 pr-4 bg-white/70 border border-transparent rounded-2xl ring-2 ring-transparent focus:ring-primary-container focus:bg-white focus:outline-none shadow-sm transition-all text-on-background font-sans font-semibold text-lg"
                  />
                </div>
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <label htmlFor="weight" className="block font-sans font-bold text-sm text-[#3d4a3e] tracking-wide uppercase">
                  Weight (kg)
                </label>
                <div className="relative">
                  <Dumbbell className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    required
                    min={10}
                    max={300}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    placeholder="68.5"
                    className="w-full h-14 pl-12 pr-4 bg-white/70 border border-transparent rounded-2xl ring-2 ring-transparent focus:ring-primary-container focus:bg-white focus:outline-none shadow-sm transition-all text-on-background font-sans font-semibold text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Target Weight Input (Specifically relevant for target tracking!) */}
            <div className="space-y-2">
              <label htmlFor="targetWeight" className="block font-sans font-bold text-sm text-[#3d4a3e] tracking-wide uppercase">
                Goal weight (kg)
              </label>
              <div className="relative">
                <Flame className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  required
                  min={10}
                  max={300}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  placeholder="72.0"
                  className="w-full h-14 pl-12 pr-4 bg-white/70 border border-transparent rounded-2xl ring-2 ring-transparent focus:ring-primary-container focus:bg-white focus:outline-none shadow-sm transition-all text-on-background font-sans font-semibold text-lg"
                />
              </div>
            </div>

            {/* Goal selection */}
            <div className="space-y-3">
              <label className="block font-sans font-bold text-sm text-[#3d4a3e] tracking-wide uppercase">
                What's your main goal?
              </label>
              <div className="grid grid-cols-1 gap-3">
                {Object.values(GoalType).map((g) => {
                  const isChecked = goalType === g;
                  let icon = <Sparkles className="w-5 h-5 text-primary" />;
                  if (g === GoalType.MUSCLE_GAIN) {
                    icon = <Dumbbell className="w-5 h-5 text-primary" />;
                  } else if (g === GoalType.MAINTAIN) {
                    icon = <RefreshCcw className="w-5 h-5 text-secondary-container" />;
                  } else {
                    icon = <Flame className="w-5 h-5 text-tertiary" />;
                  }

                  return (
                    <label key={g} className="cursor-pointer block">
                      <input
                        type="radio"
                        name="goal"
                        checked={isChecked}
                        onChange={() => setGoalType(g)}
                        className="sr-only"
                      />
                      <div
                        className={`flex items-center justify-between p-4 bg-white/80 rounded-2xl border-2 transition-all ${
                          isChecked
                            ? "border-primary-container bg-primary/10 shadow-md"
                            : "border-transparent hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {icon}
                          <span className="font-sans font-semibold text-sm text-on-background">
                            {g}
                          </span>
                        </div>
                        {isChecked && (
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check className="w-3. h-3" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 pb-8 space-y-3">
            <button
              type="submit"
              className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-white font-display text-lg font-bold rounded-full shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
            >
              Start My Vibe
              <ArrowRight className="w-5 h-5" />
            </button>
            {isDismissable && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center py-2 text-sm text-[#3d4a3e] font-sans font-semibold hover:underline"
              >
                Go Back
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
