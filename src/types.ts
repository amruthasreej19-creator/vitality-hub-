export enum GoalType {
  MUSCLE_GAIN = "Get stronger & gain muscle",
  MAINTAIN = "Maintain & feel energetic",
  LEAN_DOWN = "Lean down & get healthy"
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  targetWeight: number;
  avatarUrl: string;
  avatarName: string;
  goalType: GoalType;
}

export interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  timestamp: string;
}

export interface LoggedActivity {
  id: string;
  name: string;
  minutes: number;
  caloriesBurned: number;
  type: string;
  timestamp: string;
}

export interface MealRecommendation {
  id: string;
  name: string;
  calories: number;
  description: string;
  tags: string[];
  image: string;
  badges: string[];
  protein?: number;
  carbs?: number;
  fats?: number;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  ingredients: string[];
  dietType: "Veg" | "Non-Veg";
}

export function getCalorieTarget(profile: UserProfile): number {
  const W = profile.weight || 68.5;
  if (profile.goalType === GoalType.MUSCLE_GAIN) {
    return Math.round((W * 32) + 300);
  } else if (profile.goalType === GoalType.LEAN_DOWN) {
    return Math.round((W * 26) - 100);
  } else {
    return Math.round(W * 29);
  }
}

export function getMacroTargets(profile: UserProfile) {
  const W = profile.weight || 68.5;
  if (profile.goalType === GoalType.MUSCLE_GAIN) {
    return {
      protein: Math.round(W * 2.1),
      carbs: Math.round(W * 4.6),
      fats: Math.round(W * 1.1)
    };
  } else if (profile.goalType === GoalType.LEAN_DOWN) {
    return {
      protein: Math.round(W * 2.3),
      carbs: Math.round(W * 2.4),
      fats: Math.round(W * 0.8)
    };
  } else {
    return {
      protein: Math.round(W * 1.9),
      carbs: Math.round(W * 3.6),
      fats: Math.round(W * 1.0)
    };
  }
}
