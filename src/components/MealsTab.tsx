import { useState } from "react";
import { LoggedMeal, MealRecommendation, UserProfile, GoalType, getCalorieTarget, getMacroTargets } from "../types";
import classicShakshukaImg from "../assets/images/classic_shakshuka_1781110434725.png";
import chickenAvocadoWrapImg from "../assets/images/chicken_avocado_wrap_1781110450427.png";
import supremeAvocadoToastImg from "../assets/images/supreme_avocado_toast_1781110907675.png";
import { Flame, Check, Trophy, Droplets, Dumbbell, Sparkles, ChevronDown, ChevronUp, ClipboardList, Scale, Info, Search, Filter, Calendar, TrendingUp, TrendingDown, Clock, ArrowRight, Smile } from "lucide-react";

interface MealsTabProps {
  profile: UserProfile;
  loggedMeals: LoggedMeal[];
  onAddMeal: (meal: Omit<LoggedMeal, "id" | "timestamp">) => void;
  hydration: number;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
}

const CATEGORIES = [
  { label: "🍽️ All Categories", value: "All" },
  { label: "🥞 Breakfast", value: "Breakfast" },
  { label: "🥗 Lunch", value: "Lunch" },
  { label: "🍖 Dinner", value: "Dinner" },
  { label: "🥨 Snacks", value: "Snack" }
];

export const RECOMMENDATIONS: MealRecommendation[] = [
  // --- BREAKFAST ---
  {
    id: "rec-1",
    name: "Supreme Avocado Toast",
    calories: 420,
    description: "Creamy avocado on toasted artisanal sourdough, crowned with organic poached eggs and organic microgreens.",
    tags: ["High Protein", "Rich in Fiber"],
    image: supremeAvocadoToastImg,
    badges: ["Protein Rich"],
    protein: 22,
    carbs: 42,
    fats: 18,
    category: "Breakfast",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe whole Hass avocado",
      "2 organic free-range eggs",
      "10g organic microgreens",
      "Pinch of red chili flakes & pink sea salt"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-4",
    name: "Powerhouse Peanut Butter Oats",
    calories: 480,
    description: "Creamy warm rolled oats mixed with premium natural peanut butter, organic banana slices, and organic chia seeds.",
    tags: ["Energy Boost", "Sustained Power"],
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=600",
    badges: ["Pre-Workout Favorite"],
    protein: 16,
    carbs: 65,
    fats: 17,
    category: "Breakfast",
    ingredients: [
      "50g instant rolled organic wheat oats",
      "2 tbsp pure unsalted peanut butter",
      "1 medium ripe organic banana",
      "1 tbsp premium organic black chia seeds",
      "150ml milk or unsweetened almond milk"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-5",
    name: "Golden Fluffy Protein Waffles",
    calories: 390,
    description: "Light and protein-boosted waffles served with a drizzle of organic pure dark maple syrup and sweet fresh wild blueberries.",
    tags: ["High Protein", "Low Sugar"],
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=600",
    badges: ["Breakfast Legend"],
    protein: 25,
    carbs: 45,
    fats: 12,
    category: "Breakfast",
    ingredients: [
      "60g gluten-free protein waffle mix",
      "1 scoop pure vanilla whey isolate protein powder",
      "50ml organic whole milk",
      "2 tbsp clean Canadian amber maple syrup",
      "Handful of sweet organic wild blueberries"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-13",
    name: "Classic Mediterranean Shakshuka",
    calories: 330,
    description: "Hearty, poached organic eggs in a simmering spiced rich tomato and bell pepper sauce, finished with fresh crumbled feta and wild coriander.",
    tags: ["Antioxidant-Rich", "Low Carb"],
    image: classicShakshukaImg,
    badges: ["Veg Power"],
    protein: 18,
    carbs: 24,
    fats: 16,
    category: "Breakfast",
    ingredients: [
      "3 large organic free-range eggs",
      "1 cup freshly chopped red tomatoes and bell peppers",
      "30g crumbled rich Danish feta cheese",
      "1 clove crushed garlic & fresh coriander leaves",
      "1 tsp pristine cold-pressed olive oil"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-14",
    name: "High-Protein Salmon Scramble",
    calories: 410,
    description: "Soft fluffy organic egg whites scrambled with premium cold-smoked wild Nordic salmon and vibrant baby spinach.",
    tags: ["Omega-3 Rich", "High Protein"],
    image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&q=80&w=600",
    badges: ["Brain Booster"],
    protein: 34,
    carbs: 6,
    fats: 22,
    category: "Breakfast",
    ingredients: [
      "200ml organic liquid egg whites",
      "80g thinly sliced Scandinavian smoked salmon",
      "1 full cup of organic wild baby spinach",
      "1/4 organic sweet yellow onion",
      "1 tsp extra virgin coconut oil"
    ],
    dietType: "Non-Veg"
  },

  // --- LUNCH ---
  {
    id: "rec-2",
    name: "Zesty Garden Salad With Chicken",
    calories: 350,
    description: "Crisp organic garden greens topped with grilled lemon herb chicken, prebiotic chickpeas, and a citrus-herb emulsion.",
    tags: ["Vitamin Boost", "Lean Power"],
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
    badges: ["Light & Fresh"],
    protein: 32,
    carbs: 18,
    fats: 15,
    category: "Lunch",
    ingredients: [
      "150g skinless, boneless chicken breast",
      "2 cups of fresh romaine & raw baby spinach mix",
      "50g canned drained organic chickpeas",
      "1/2 sliced cucumber & 4 cherry tomatoes",
      "Traditional zesty vinaigrette with freshly squeezed lemon juice"
    ],
    dietType: "Non-Veg"
  },
  {
    id: "rec-6",
    name: "Triple-Decker Smoked Turkey Club",
    calories: 510,
    description: "Rustic whole-grain toast layered with smoked succulent turkey breast, turkey bacon, romaine lettuce, tomato, and clean avocado mayo.",
    tags: ["High Protein", "Fueling"],
    image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&q=80&w=600",
    badges: ["Active Athlete Meal"],
    protein: 38,
    carbs: 48,
    fats: 16,
    category: "Lunch",
    ingredients: [
      "3 slices premium multi-seed whole grain bread",
      "120g deli-cut hickory smoked turkey breast",
      "2 crispy strips of honey turkey bacon",
      "Crisp organic romaine leaf & ripe beefsteak tomato slice",
      "1 tbsp pure organic avocado oil mayonnaise"
    ],
    dietType: "Non-Veg"
  },
  {
    id: "rec-7",
    name: "Spicy Wild Salmon Poke Bowl",
    calories: 540,
    description: "Premium sashimi-grade wild salmon served over wholesome brown rice, with sweet edamame, shredded carrots, cucumber, and sriracha greek-yogurt glaze.",
    tags: ["Omega 3", "Good Fats"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    badges: ["Heart Healthy"],
    protein: 30,
    carbs: 55,
    fats: 18,
    category: "Lunch",
    ingredients: [
      "120g premium wild sockeye salmon fillet cubes",
      "1 full cup of steamed organic brown basmati rice",
      "50g boiled green organic shelled edamame",
      "Shredded organic carrots, white radish & cucumbers",
      "Sriracha whisked with low fat plain probiotic Greek yogurt"
    ],
    dietType: "Non-Veg"
  },
  {
    id: "rec-15",
    name: "Crispy Sesame Tofu Poke Bowl",
    calories: 430,
    description: "Golden pan-seared organic tofu chunks glazed in a low-sodium sesame ginger dressing, served over fluffy quinoa with vibrant matchstick raw veggies.",
    tags: ["100% Vegan", "Plant Power"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
    badges: ["Clean & Fresh"],
    protein: 20,
    carbs: 48,
    fats: 14,
    category: "Lunch",
    ingredients: [
      "150g extra-firm organic diced tofu cubes",
      "1 cup cooked red and white organic quinoa",
      "1 tbsp roasted sesame seeds & raw sliced cucumbers",
      "50g sweet edamame & shredded red cabbage",
      "Homemade light soy sesame ginger glaze"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-16",
    name: "Grilled Lime Chicken Avocado Wrap",
    calories: 470,
    description: "Char-grilled lime marinated chicken breast tucked inside a high-fiber dynamic flatbread wrap with fresh creamy sliced avocado and house salsa.",
    tags: ["Muscle Repair", "High Fiber"],
    image: chickenAvocadoWrapImg,
    badges: ["Post-Workout Fuel"],
    protein: 34,
    carbs: 38,
    fats: 15,
    category: "Lunch",
    ingredients: [
      "1 large high-fiber organic whole wheat flat tortilla",
      "130g premium skinless grilled chicken breast slices",
      "1/2 ripe Hass avocado premium diced",
      "2 tbsp clean vine-ripened tomato salsa",
      "Fistful of chopped coriander & shredded iceberg lettuce"
    ],
    dietType: "Non-Veg"
  },

  // --- DINNER ---
  {
    id: "rec-3",
    name: "The Recovery Bowl",
    calories: 580,
    description: "Roasted nutrient-dense sweet potatoes, fluffy quinoa base, halloumi cubes, and sautéed organic asparagus topped with a sunny farm egg.",
    tags: ["Muscle Repair", "Good Fats"],
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600",
    badges: ["Energy Recovery"],
    protein: 26,
    carbs: 60,
    fats: 22,
    category: "Dinner",
    ingredients: [
      "150g sweet potato chunks roasted skin-on",
      "1 cup cooked red and white organic quinoa",
      "60g premium pan-seared halloumi slices",
      "5 stalks of sweet organic green asparagus spears",
      "1 pasture-raised organic egg (fried or soft-boiled)"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-8",
    name: "Sweet Potato & Chickpea Curry",
    calories: 490,
    description: "Chilled sweet potato cubes and gut-friendly prebiotic chickpeas simmered in a creamy light coconut-tomato curry broth, served with wild brown rice.",
    tags: ["Vegan Power", "Rich in Fiber"],
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600",
    badges: ["Anti-inflammatory"],
    protein: 15,
    carbs: 72,
    fats: 14,
    category: "Dinner",
    ingredients: [
      "150g fresh orange sweet potato diced cubes",
      "100g soft ready-to-eat organic chickpeas",
      "1/2 cup organic light organic coconut milk",
      "1/3 cup rich organic stewed tomato puree",
      "1 cup steamed short-grain nutty brown jasmine rice"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-9",
    name: "Grass-Fed Lean Steak Frites",
    calories: 620,
    description: "Tender, high-protein grass-fed beef medallions paired with crispy herb-dusted air-fried potato wedges and char-grilled green asparagus spears.",
    tags: ["Iron Rich", "Muscle Builder"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
    badges: ["Champion dinner"],
    protein: 42,
    carbs: 40,
    fats: 24,
    category: "Dinner",
    ingredients: [
      "180g grass-fed lean beef strip medallions",
      "150g russet potato spears, skin-on and air-fried",
      "8 tender stems of seasonal organic asparagus",
      "1 tsp extra virgin olive oil & fresh wild rosemary sprigs",
      "Pinch of cracked black peppercorns and sea salt flakes"
    ],
    dietType: "Non-Veg"
  },
  {
    id: "rec-17",
    name: "Grilled Paneer & Veggie Kebab Plate",
    calories: 512,
    description: "Juicy chunks of high-protein organic paneer skewered with cherry tomatoes and crunchy bell peppers, served alongside clean cucumber-mint yogurt dip.",
    tags: ["High Calcium", "Muscle Recovery"],
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600",
    badges: ["Pure Veg Supreme"],
    protein: 24,
    carbs: 18,
    fats: 28,
    category: "Dinner",
    ingredients: [
      "180g organic block paneer premium cubed",
      "1/2 red & yellow capsicum bell pepper sliced",
      "6 organic cherry tomatoes",
      "1/2 cup organic Greek yogurt mixed with diced mint & cucumber",
      "1 tsp pure cold-pressed sunflower oil"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-18",
    name: "Roasted Honey-Glazed Turkey Breast",
    calories: 460,
    description: "Lean honey and mustard-marinated turkey breast slow roasted to juicy perfection, served with air-fried broccoli florets and pure sweet potato mash.",
    tags: ["Ultra Lean Protein", "Zero Trans-Fats"],
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&q=80&w=600",
    badges: ["Lean & Strong"],
    protein: 38,
    carbs: 32,
    fats: 8,
    category: "Dinner",
    ingredients: [
      "160g premium sliced skinless turkey breast crown",
      "1 cup local sweet potatoes steamed & lightly smashed",
      "150g fresh green broccoli air-fried with garlic",
      "1 tsp raw honey and organic Dijon mustard glaze",
      "Pinch of wild thyme and kosher sea salt"
    ],
    dietType: "Non-Veg"
  },

  // --- SNACKS ---
  {
    id: "rec-10",
    name: "Probiotic Berry Greek Parfait",
    calories: 220,
    description: "Velvety probiotic non-fat Greek yogurt layered with raw organic honey, antioxidant rich forest berries, and crispy slivered almonds.",
    tags: ["Prebiotic", "Zero Junk"],
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600",
    badges: ["Gut Health Champion"],
    protein: 18,
    carbs: 22,
    fats: 6,
    category: "Snack",
    ingredients: [
      "150g unsweetened plain non-fat Greek yogurt",
      "1 tbsp raw locally-sourced organic honey",
      "50g mixed organic forest berries (blueberries, raspberries)",
      "15g crunchy organic slivered blanched almonds"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-11",
    name: "Antioxidant Matcha Green Smoothie",
    calories: 180,
    description: "Bright Japanese ceremonial matcha blended smoothly with light baby spinach, sweet pineapple chucks, unsweetened coconut milk, and active ground flaxseed.",
    tags: ["Metabolism Boost", "Antioxidants"],
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600",
    badges: ["Glow & Go"],
    protein: 6,
    carbs: 28,
    fats: 5,
    category: "Snack",
    ingredients: [
      "1 full tsp ceremonial Japanese matcha powder",
      "1 cup organic baby spinach leaves",
      "1/2 cup fresh organic frozen sweet pineapple cubes",
      "1 cup creamy carton organic unsweetened coconut milk",
      "1 tbsp ground raw golden flaxseed"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-12",
    name: "No-Bake Fudge Trail Mix Energy Bites",
    calories: 240,
    description: "Convenient chewy dates mixed with high fiber oats, premium dark cocoa nibs, flax seeds, and ground raw walnuts rolled into bite-sized snack balls.",
    tags: ["Quick Bites", "Brain Booster"],
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600",
    badges: ["Study Snack"],
    protein: 8,
    carbs: 32,
    fats: 9,
    category: "Snack",
    ingredients: [
      "120g whole pitted organic Deglet Noor or Medjool dates",
      "50g instant gluten-free organic rolled oats",
      "20g raw unsweetened organic cocoa nibs",
      "1 tbsp milled organic golden flaxseeds",
      "30g ground, raw walnut pieces"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-19",
    name: "Spiced Roasted Chickpeas Booster",
    calories: 190,
    description: "Extremely crunchy dry-roasted organic chickpeas seasoned in vibrant smoked paprika, garlic dust, and a pinch of active nutritional yeast.",
    tags: ["High Fiber", "Clean Energy"],
    image: "https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&q=80&w=600",
    badges: ["Guilt-Free Crunch"],
    protein: 10,
    carbs: 26,
    fats: 4,
    category: "Snack",
    ingredients: [
      "150g boiled, well-dried organic chickpeas",
      "1 tsp smoked Spanish paprika powder",
      "1/2 tsp fragrant garlic powder & pink salt",
      "1 tsp cold-pressed organic light avocado oil",
      "1 tsp cheese-flavored organic nutritional yeast"
    ],
    dietType: "Veg"
  },
  {
    id: "rec-20",
    name: "Healthy Herb Turkey Jerky",
    calories: 160,
    description: "Slices of premium grass-fed tender turkey breast spiced with robust ground herbs and dried in a clean low-heat dehydrator.",
    tags: ["Pure Lean Mass", "Sugar Free"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
    badges: ["A-Grade Keto Snack"],
    protein: 24,
    carbs: 2,
    fats: 3,
    category: "Snack",
    ingredients: [
      "120g wild smoked organic free-range turkey breast strips",
      "1/2 tsp dried organic oregano and sweet onion flakes",
      "1 tbsp low-sodium organic coconut aminos savory glaze",
      "A squeeze of fresh lemon zest and cracked organic black pepper"
    ],
    dietType: "Non-Veg"
  }
];

export default function MealsTab({ profile, loggedMeals, onAddMeal, hydration, onUpdateProfile }: MealsTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  const [addedRecId, setAddedRecId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dietFilter, setDietFilter] = useState<"All" | "Veg" | "Non-Veg">("All");
  const [selectedInterest, setSelectedInterest] = useState<string>("All");
  const [onlyShowSuggestPlanMeals, setOnlyShowSuggestPlanMeals] = useState<boolean>(false);
  const [weeklyRate, setWeeklyRate] = useState<number>(0.5); // kg per week (weekly pace slider)

  // Filter recommendations based on activeCategory, searchQuery, dietFilter, selectedInterest
  const getFilteredRecommendations = () => {
    return RECOMMENDATIONS.filter((rec) => {
      // 1. Category Filter
      if (activeCategory !== "All" && rec.category !== activeCategory) return false;
      
      // 2. Diet Filter (Veg / Non-Veg)
      if (dietFilter !== "All" && rec.dietType !== dietFilter) return false;
      
      // 3. Interest Tag Filter
      if (selectedInterest !== "All") {
        const matchesInterest = rec.tags.some(tag => {
          const t = tag.toLowerCase();
          const target = selectedInterest.toLowerCase();
          return t.includes(target) || target.includes(t);
        });
        if (!matchesInterest) return false;
      }
      
      // 4. Text Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = rec.name.toLowerCase().includes(query);
        const matchesDesc = rec.description.toLowerCase().includes(query);
        const matchesIngredient = rec.ingredients.some(ing => ing.toLowerCase().includes(query));
        const matchesTag = rec.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesBadge = rec.badges.some(badge => badge.toLowerCase().includes(query));
        
        if (!matchesName && !matchesDesc && !matchesIngredient && !matchesTag && !matchesBadge) {
          return false;
        }
      }

      // 5. User Need / Plan Suggestion Filter
      if (onlyShowSuggestPlanMeals) {
        if (profile.goalType === GoalType.LEAN_DOWN) {
          // Weight Loss Plan matches low/medium calorie or lower-carb foods
          return rec.calories <= 450 || rec.tags.some(t => t.toLowerCase().includes("lean") || t.toLowerCase().includes("carb") || t.toLowerCase().includes("fiber"));
        } else if (profile.goalType === GoalType.MUSCLE_GAIN) {
          // Weight Gain Plan matches high energy/protein dense foods
          return rec.calories >= 430 || rec.tags.some(t => t.toLowerCase().includes("protein") || t.toLowerCase().includes("energy") || t.toLowerCase().includes("power"));
        }
      }
      
      return true;
    });
  };

  const handleAdd = (rec: MealRecommendation) => {
    const mealCategory = rec.category === "Breakfast" ? "Breakfast" : rec.category === "Lunch" ? "Lunch" : rec.category === "Dinner" ? "Dinner" : "Snack";
    onAddMeal({
      name: rec.name,
      calories: rec.calories,
      protein: rec.protein ?? (rec.category === "Breakfast" ? 22 : rec.category === "Lunch" ? 30 : 25),
      carbs: rec.carbs ?? (rec.category === "Breakfast" ? 40 : rec.category === "Lunch" ? 15 : 55),
      fats: rec.fats ?? (rec.category === "Breakfast" ? 18 : rec.category === "Lunch" ? 10 : 20),
      category: mealCategory
    });
    setSuccessMessage(`Added "${rec.name}" to your Plan!`);
    setAddedRecId(rec.id);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);
    setTimeout(() => {
      setAddedRecId(null);
    }, 2000);
  };

  // Dynamic Insight Calcs
  const targetKcal = getCalorieTarget(profile);
  const consumedKcal = loggedMeals.reduce((sum, m) => sum + m.calories, 0);
  const leftKcal = Math.max(0, targetKcal - consumedKcal);
  
  const consumedProtein = loggedMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const macroTargets = getMacroTargets(profile);
  const proteinGoal = macroTargets.protein; 

  return (
    <div className="space-y-8 pb-32 animate-fade-in text-on-background">
      {/* Hero Section */}
      <section className="pt-2">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-extrabold text-on-surface mb-2">
            Fuel Your Day 🚀
          </h2>
          <p className="font-sans text-base text-on-surface-variant font-semibold">
            Personalized meal recommendations tailored to your vitality goals and teen lifestyle.
          </p>
        </div>

        {/* Interactive Diet Planner & Configurator Card */}
        <div className="bg-gradient-to-br from-[#111c2d] to-[#1e2e4a] p-6 rounded-[2.2rem] text-white shadow-xl mb-6 relative overflow-hidden border border-white/10">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#4ade80]">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#4ade80] uppercase tracking-wider block">
                    Dynamic Nutrition Engine
                  </span>
                  <h3 className="font-display text-lg font-extrabold flex items-center gap-1.5 string-normal">
                    Interactive Weight & Target Planner
                  </h3>
                </div>
              </div>

              {/* Autodetected active blueprint notification badge */}
              <div className="flex items-center gap-2">
                {profile.targetWeight < profile.weight ? (
                  <span className="text-[10px] font-bold text-white bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                    Weight Loss Plan Active
                  </span>
                ) : profile.targetWeight > profile.weight ? (
                  <span className="text-[10px] font-bold text-white bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    Weight Gain Plan Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-white bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    Steady Maintenance Plan
                  </span>
                )}
                <span className="text-[10px] font-black text-white/80 bg-white/10 px-2.5 py-1 rounded-full uppercase shrink-0">
                  {profile.age} Yrs • {profile.weight} Kg
                </span>
              </div>
            </div>

            {/* Configurator Form inputs with elegant glassmorphism styling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Core Physical Parameters */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
                <span className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-wider mb-1">
                  Step 1: Physical Parameters
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {/* Age input */}
                  <div className="space-y-1">
                    <label htmlFor="planner-age" className="block text-[9px] font-bold text-slate-300 uppercase tracking-wide">
                      Your Age (yrs)
                    </label>
                    <input
                      id="planner-age"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="16"
                      value={profile.age || ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                        if (onUpdateProfile) {
                          onUpdateProfile({ age: val });
                        }
                      }}
                      className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 font-sans font-bold text-sm text-white"
                    />
                  </div>

                  {/* Weight input */}
                  <div className="space-y-1">
                    <label htmlFor="planner-weight" className="block text-[9px] font-bold text-slate-300 uppercase tracking-wide">
                      Weight (kg)
                    </label>
                    <input
                      id="planner-weight"
                      type="number"
                      step="0.1"
                      min="10"
                      max="300"
                      placeholder="68.5"
                      value={profile.weight || ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                        if (onUpdateProfile) {
                          onUpdateProfile({ weight: val });
                        }
                      }}
                      className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 font-sans font-bold text-sm text-white"
                    />
                  </div>
                </div>

                {/* Target Weight Weight */}
                <div className="space-y-1">
                  <label htmlFor="planner-target-weight" className="block text-[9px] font-bold text-slate-300 uppercase tracking-wide">
                    Goal Weight Target (kg)
                  </label>
                  <input
                    id="planner-target-weight"
                    type="number"
                    step="0.1"
                    min="10"
                    max="300"
                    placeholder="72.0"
                    value={profile.targetWeight || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : Number(e.target.value);
                      if (onUpdateProfile) {
                        onUpdateProfile({ targetWeight: val });
                      }
                    }}
                    className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 font-sans font-bold text-sm text-white"
                  />
                </div>
              </div>

              {/* Box 2: Goal Speed & Weekly Pace */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
                <span className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-wider mb-1">
                  Step 2: Plan Need & Goal Pace
                </span>

                {/* Fast Selector for Plan Goal Type to make it super easy */}
                <div className="space-y-1">
                  <label htmlFor="planner-goal-type" className="block text-[9px] font-bold text-slate-300 uppercase tracking-wide">
                    Nutrition Goal
                  </label>
                  <select
                    id="planner-goal-type"
                    value={profile.goalType}
                    onChange={(e) => {
                      if (onUpdateProfile) {
                        onUpdateProfile({ goalType: e.target.value as GoalType });
                      }
                    }}
                    className="w-full h-10 px-2 bg-[#1b2b40] border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 font-sans font-bold text-xs text-white"
                  >
                    <option value={GoalType.LEAN_DOWN}>📉 Weight Loss Plan</option>
                    <option value={GoalType.MUSCLE_GAIN}>📈 Weight Gain Plan</option>
                    <option value={GoalType.MAINTAIN}>⚡ Maintain Active Vibe</option>
                  </select>
                </div>

                {/* Change Pace selectors (Buttons are highly accessible) */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold text-slate-300 uppercase tracking-wide">
                    Weekly Focus Intensity
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { val: 0.25, label: "Gentle" },
                      { val: 0.50, label: "Optimal" },
                      { val: 0.75, label: "Intense" }
                    ].map((p) => {
                      const isSelected = weeklyRate === p.val;
                      return (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() => setWeeklyRate(p.val)}
                          className={`py-1.5 px-1 rounded-xl font-sans text-[10px] font-bold border transition-all ${
                            isSelected
                              ? "bg-white text-[#111c2d] border-white"
                              : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {p.label} ({p.val}kg)
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Box 3: Age-Adjusted Metabolism analysis */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Smile className="w-4 h-4 text-[#4ade80]" />
                    <span className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-wider">
                      Step 3: Age-Based Metabolic Zone
                    </span>
                  </div>

                  {(() => {
                    const ageNum = profile.age || 16;
                    if (ageNum < 13) {
                      return (
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-xs text-white">Pre-Teen Developmental Growth</h4>
                          <p className="font-sans text-[10px] text-slate-300 leading-relaxed">
                            Focus strictly on bone density, baseline proteins, and nutrient security. Moderate activity and low sugar are encouraged.
                          </p>
                        </div>
                      );
                    } else if (ageNum < 20) {
                      return (
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-xs text-[#4ade80] flex items-center gap-1">
                            Teen Active Growth Window ⚡
                          </h4>
                          <p className="font-sans text-[10px] text-slate-300 leading-relaxed">
                            Highly dynamic growth spurs. Carbohydrates shouldn't be too restricted. Keep protein at 1.8g to 2.2g per kg of weight to power muscle density.
                          </p>
                        </div>
                      );
                    } else if (ageNum < 36) {
                      return (
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-xs text-sky-300 flex items-center gap-1">
                            Peak Young Adult Anabolic Phase ✨
                          </h4>
                          <p className="font-sans text-[10px] text-slate-300 leading-relaxed">
                            High thermic effect of food. Excellent muscle retention. Caloric restriction generates immediate fat-burning results.
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-xs text-amber-300">Adult Metabolic Plateau</h4>
                          <p className="font-sans text-[10px] text-slate-300 leading-relaxed">
                            Metabolic scale starts to favor slow stabilization. Satiete fibers, resistance workouts, and daily hydration are paramount to protect hormone vitality.
                          </p>
                        </div>
                      );
                    }
                  })()}
                </div>

                <div className="mt-2 text-[9px] font-bold text-slate-400 border-t border-white/5 pt-2 flex items-center gap-1">
                  <Info className="w-3 h-3 text-[#4ade80]" />
                  Clinically calculated for weight goals.
                </div>
              </div>
            </div>

            {/* Calculated Plan Output & Adaptive Schedule Timeline */}
            <div className="bg-white text-[#111c2d] p-5 rounded-3xl space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#006d36]" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500">
                    YOUR CHRONOLOGICAL GOAL ROADMAP
                  </span>
                </div>
                
                {/* Duration banner */}
                <div className="bg-[#eefaf4] text-[#006d36] px-3.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Achieve goal in ~{weeklyRate > 0 && Math.abs(profile.targetWeight - profile.weight) > 0 ? Math.ceil(Math.abs(profile.targetWeight - profile.weight) / weeklyRate) : "0"} Weeks!
                  </span>
                </div>
              </div>

              {/* Grid representation of calculated weight change details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                  <span className="text-[9px] text-[#64748b] uppercase font-bold block">Current Weight</span>
                  <span className="font-display text-lg font-black text-[#1e293b]">{profile.weight || 0} kg</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                  <span className="text-[9px] text-[#64748b] uppercase font-bold block">Target Weight</span>
                  <span className="font-display text-lg font-black text-primary">{profile.targetWeight || 0} kg</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                  <span className="text-[9px] text-[#64748b] uppercase font-bold block">Delta Need</span>
                  <span className="font-display text-lg font-black text-[#e11d48] flex items-center justify-center gap-0.5">
                    {profile.targetWeight < profile.weight ? "-" : "+"}{(Math.abs(profile.targetWeight - profile.weight)).toFixed(1)} kg
                  </span>
                </div>
                <div className="bg-[#f0f9ff] p-3 rounded-2xl text-center border border-sky-100">
                  <span className="text-[9px] text-sky-700 uppercase font-black block">Pacing Speed</span>
                  <span className="font-sans text-xs font-black text-sky-950 block mt-0.5">{weeklyRate} kg / week</span>
                </div>
              </div>

              {/* Dynamic Progress Timeline Sequence */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-[#006d36]" />
                  Dynamic Meal Plan Phases Breakdown
                </h4>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {/* Phase 1 */}
                  <div className="flex items-start gap-4 relative">
                    <span className="w-6 h-6 rounded-full bg-primary text-white font-sans text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-md">
                      1
                    </span>
                    <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100/80 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-xs font-extrabold text-[#111c2d]">
                          Phase 1: Induction & Metabolic Preparation
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">Weeks 1-2</span>
                      </div>
                      <p className="font-sans text-[11px] text-[#3d4a3e] leading-relaxed">
                        Calibrate your cells to target <strong className="text-primary">{targetKcal} kcal</strong> with high protein density. Keep your hydration at minimum 3L to flush macro particulates.
                      </p>
                      
                      {/* Interactive recipe matching reminder */}
                      <div className="text-[9px] text-primary font-bold flex items-center gap-1.5 mt-2 pt-2 border-t border-dashed border-slate-200">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        <span>Use the "Interactive Dynamic Matcher" below to load customized Phase-1 dishes instantly!</span>
                      </div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="flex items-start gap-4 relative">
                    <span className="w-6 h-6 rounded-full bg-[#006d36] text-white font-sans text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-md">
                      2
                    </span>
                    <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100/80 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-xs font-extrabold text-[#111c2d]">
                          Phase 2: Target Adaptation & Steady Burn/Bulking
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          Weeks 3-{weeklyRate > 0 && Math.abs(profile.targetWeight - profile.weight) > 1 ? Math.max(3, Math.ceil(Math.abs(profile.targetWeight - profile.weight) / weeklyRate) - 1) : "N"}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-[#3d4a3e] leading-relaxed">
                        Targeting the midpoint metric: <strong className="text-on-surface">{(profile.weight + (profile.targetWeight > profile.weight ? 1 : -1) * (Math.abs(profile.targetWeight - profile.weight) / 2)).toFixed(1)} kg</strong>.
                        {profile.goalType === GoalType.LEAN_DOWN ? (
                          <span> Consume high-fiber snack packs to crush dynamic hunger pangs while maintaining active workouts.</span>
                        ) : (
                          <span> Integrate double carbohydrate waffles and heavy peanut butter oats between training triggers.</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="flex items-start gap-4 relative">
                    <span className="w-6 h-6 rounded-full bg-[#8b5cf6] text-white font-sans text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-md">
                      3
                    </span>
                    <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100/80 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-sans text-xs font-extrabold text-[#111c2d]">
                          Phase 3: Ultimate Realization & Vibe Consolidation
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">Culmination Epoch</span>
                      </div>
                      <p className="font-sans text-[11px] text-[#3d4a3e] leading-relaxed">
                        Goal of <strong className="text-[#8b5cf6]">{profile.targetWeight} kg</strong> achieved! Calibrate core values by switching plan need to <strong>Maintain Active Vibe</strong> to preserve fresh synthesis long-term.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutrition Targets Grid for Protein, Carbs, Fats */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Calculated Daily Macro Partitioning Split
                  </span>
                  <span className="text-[10px] font-bold text-primary-container bg-primary/10 px-2 py-0.5 rounded-full">
                    Target: {targetKcal} kcal
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Protein */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-[#0369a1]">Protein</span>
                      <span className="text-slate-600">{macroTargets.protein}g</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#0369a1] h-full rounded-full" style={{ width: `${Math.min(100, (macroTargets.protein / 200) * 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-[#be185d]">Carbohydrates</span>
                      <span className="text-slate-600">{macroTargets.carbs}g</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#be185d] h-full rounded-full" style={{ width: `${Math.min(100, (macroTargets.carbs / 400) * 100)}%` }}></div>
                    </div>
                  </div>

                  {/* Fats */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-[#a16207]">Healthy Fats</span>
                      <span className="text-slate-600">{macroTargets.fats}g</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#a16207] h-full rounded-full" style={{ width: `${Math.min(100, (macroTargets.fats / 120) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dietitian guidelines notice box */}
              <div className="bg-[#f0fdf4] border border-green-200 p-3.5 rounded-2xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#006d36] shrink-0 mt-0.5" />
                <div className="text-[11px] font-semibold text-[#006d36] leading-relaxed">
                  <span className="font-bold">Sports Nutritionist Guideline: </span>
                  {profile.goalType === GoalType.MUSCLE_GAIN ? (
                    <span>Your muscle bulking target implies a calculated nutritional surplus of +300 calories. Keep drinking water and check food icons for the purple matching labels.</span>
                  ) : profile.goalType === GoalType.LEAN_DOWN ? (
                    <span>Your lean deficit targets a reduction of -100 calories from baseline. Choose green-labeled meals. Ensure you do not drop below threshold metrics too fast.</span>
                  ) : (
                    <span>Maintenance mode. Maintain clean activity and balance macro goals nicely to defend metabolic peaked states.</span>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar scroll-smooth mb-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full font-sans text-sm font-bold whitespace-nowrap shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary-container text-white"
                    : "bg-white text-on-surface-variant border border-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search, Diet & Interests Discovery Engine */}
        <div className="bg-surface-container-low p-5 rounded-[2.5rem] border border-white/60 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-sans text-[11px] font-black text-primary uppercase tracking-wider">
              Food Finder Engine
            </span>
          </div>

          {/* Text Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d4a3e]/50" />
            <input
              type="text"
              placeholder="Search dishes, ingredients (e.g. avocado, chicken, oats, salmon, tofu)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-semibold text-on-surface placeholder-[#3d4a3e]/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded-full hover:bg-gray-100 transition-all"
              >
                ✕
              </button>
            )}
          </div>

          {/* Segmented Diet Switcher (Veg / Non-Veg) */}
          <div className="space-y-1.5">
            <span className="block font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
              Dietary Preference
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setDietFilter("All")}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                  dietFilter === "All"
                    ? "bg-gradient-to-r from-[#006d36] to-[#4ade80] text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-gray-50 hover:text-on-surface"
                }`}
              >
                All Foods
              </button>
              <button
                type="button"
                onClick={() => setDietFilter("Veg")}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  dietFilter === "Veg"
                    ? "bg-gradient-to-r from-[#006d36] to-green-500 text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-gray-50 hover:text-on-surface"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                Veg Only
              </button>
              <button
                type="button"
                onClick={() => setDietFilter("Non-Veg")}
                className={`py-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  dietFilter === "Non-Veg"
                    ? "bg-[#9a3412] text-white shadow-sm"
                    : "text-[#9a3412] hover:bg-red-50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                Non-Veg
              </button>
            </div>
          </div>

          {/* Interests Scrollable Row */}
          <div className="space-y-1.5 pb-2">
            <span className="block font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
              Select Interest Focus
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 no-scrollbar scroll-smooth">
              {[
                { label: "✨ All Interests", value: "All" },
                { label: "💪 High Protein", value: "Protein" },
                { label: "🍞 High Fiber", value: "Fiber" },
                { label: "⚡ Energy Boost", value: "Energy" },
                { label: "🥑 Healthy Fats", value: "Fats" },
                { label: "🍃 Plant Power", value: "Vegan" },
                { label: "🧠 Brain Booster", value: "Brain" },
                { label: "🍊 Vitamin Block", value: "Vitamin" }
              ].map((interest) => {
                const isSel = selectedInterest === interest.value;
                return (
                  <button
                    key={interest.value}
                    type="button"
                    onClick={() => setSelectedInterest(interest.value)}
                    className={`px-3 py-1.5 rounded-full font-sans text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      isSel
                        ? "bg-primary border-primary text-white shadow-sm scale-102"
                        : "bg-white border-gray-100 text-on-surface-variant hover:border-primary/30"
                    }`}
                  >
                    {interest.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan specific automated matching toggle */}
          <div className="pt-3 border-t border-dashed border-gray-200 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-extrabold text-on-surface">🎯 Interactive Dynamic Matcher</span>
              <span className="font-sans text-[9px] text-on-surface-variant font-semibold mt-0.5">
                Enable to filter only foods optimized for your <strong className="text-primary">{profile.goalType === GoalType.LEAN_DOWN ? "📉 Weight Loss Plan" : profile.goalType === GoalType.MUSCLE_GAIN ? "📈 Weight Gain Plan" : "⚡ Active Plan"}</strong>.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0 ml-4">
              <input
                id="plan_match_toggle"
                type="checkbox"
                checked={onlyShowSuggestPlanMeals}
                onChange={(e) => setOnlyShowSuggestPlanMeals(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-primary/10 border border-primary-container text-primary px-4 py-3 rounded-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" strokeWidth={3} />
          <span className="font-sans font-bold text-sm">{successMessage}</span>
        </div>
      )}

      {/* Recommended Food Bento Layout */}
      <section className="space-y-6">
        {getFilteredRecommendations().length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-on-surface">No matching foods found</h4>
              <p className="font-sans text-xs text-on-surface-variant font-medium mt-1 max-w-xs mx-auto leading-relaxed">
                No active <strong>{activeCategory}</strong> options match your "{searchQuery}" filters. Try broadening your criteria!
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setDietFilter("All");
                setSelectedInterest("All");
              }}
              className="px-5 py-2.5 bg-primary text-white font-sans text-xs font-bold rounded-full shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredRecommendations().map((rec) => (
              <div
                key={rec.id}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-md border border-white hover:shadow-xl transition-all duration-300"
              >
                <div className="h-60 relative overflow-hidden">
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[90%] pointer-events-none">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-sans font-extrabold shadow-sm border ${
                        rec.dietType === "Veg"
                          ? "bg-green-100 text-[#006d36] border-green-200"
                          : "bg-orange-100 text-[#9a3412] border-orange-200"
                      }`}
                    >
                      {rec.dietType === "Veg" ? "🟢 VEG" : "🥩 NON-VEG"}
                    </span>
                    {rec.badges.map((badge) => (
                      <span
                        key={badge}
                        className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-sans font-bold text-on-surface shadow-sm border border-white/20"
                      >
                        {badge}
                      </span>
                    ))}
                    {profile.goalType === GoalType.LEAN_DOWN && (rec.calories <= 450 || rec.tags.some(t => t.toLowerCase().includes("lean") || t.toLowerCase().includes("carb"))) && (
                      <span className="bg-[#f0fdf4]/90 backdrop-blur-sm text-green-800 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-sans font-extrabold flex items-center gap-0.5 shadow-sm">
                        📉 Weight Loss Match
                      </span>
                    )}
                    {profile.goalType === GoalType.MUSCLE_GAIN && (rec.calories >= 430 || rec.tags.some(t => t.toLowerCase().includes("protein") || t.toLowerCase().includes("power"))) && (
                      <span className="bg-[#f5f3ff]/90 backdrop-blur-sm text-purple-800 border border-purple-200 px-2.5 py-1 rounded-full text-[10px] font-sans font-extrabold flex items-center gap-0.5 shadow-sm">
                        📈 Weight Gain Match
                      </span>
                    )}
                    {profile.age && profile.age < 18 ? (
                      <span className="bg-amber-100/95 backdrop-blur-sm text-amber-950 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-sans font-extrabold shadow-sm">
                        🧒 Teen Grade
                      </span>
                    ) : (
                      <span className="bg-sky-100/90 backdrop-blur-sm text-sky-950 border border-sky-200 px-2.5 py-1 rounded-full text-[10px] font-sans font-extrabold shadow-sm">
                        🏃‍♂️ Adult Grade
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl font-extrabold text-on-surface">
                      {rec.name}
                    </h3>
                    <span className="text-primary font-display font-extrabold text-lg">
                      {rec.calories} kcal
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[#3d4a3e] font-semibold mb-5 leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rec.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary-container/10 text-on-primary-container border border-primary-container/20 px-3 py-1 rounded-full text-xs font-sans font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Ingredients Expandable Area */}
                  <button
                    type="button"
                    onClick={() => setExpandedRecId(expandedRecId === rec.id ? null : rec.id)}
                    className="w-full mb-4 py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-bold text-[#006d36] hover:bg-[#006d36]/10 bg-[#006d36]/5 rounded-xl transition-all cursor-pointer"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>{expandedRecId === rec.id ? "Hide Ingredients" : "Show Ingredients"}</span>
                    {expandedRecId === rec.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {expandedRecId === rec.id && (
                    <div className="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-fade-in-down">
                      <h5 className="font-display text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2.5 flex items-center gap-1.5 text-[#3d4a3e]">
                        <Sparkles className="w-3.5 h-3.5 text-[#006d36]" /> Required Ingredients
                      </h5>
                      <ul className="space-y-1.5">
                        {rec.ingredients.map((ing, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs font-semibold text-[#3d4a3e]">
                            <span className="text-[#006d36] mt-0.5 font-bold">✓</span>
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dynamic personal advice based of current user weight */}
                  <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-primary-container/10 to-transparent border-l-4 border-primary text-[11px] font-semibold text-on-surface-variant leading-relaxed">
                    <span className="font-bold text-primary flex items-center gap-1.5 mb-1 text-xs">
                      <Scale className="w-3.5 h-3.5" /> Weight Match Insight ({profile.weight} kg)
                    </span>
                    {profile.goalType === GoalType.MUSCLE_GAIN ? (
                      <span>This meal provides <strong>{rec.protein || 20}g protein</strong>. For your <strong>{profile.weight}kg</strong> standard, this fulfills approx. <strong>{Math.round(((rec.protein || 20) / macroTargets.protein) * 100)}%</strong> of your custom muscle synthesis target. Enjoy!</span>
                    ) : profile.goalType === GoalType.LEAN_DOWN ? (
                      <span>Packed with only <strong>{rec.calories} kcal</strong>, this optimizes your energy flow keeping your <strong>{profile.weight}kg</strong> status energetic. Helps reach your <strong>{profile.targetWeight}kg</strong> destination safely!</span>
                    ) : (
                      <span>A high-vitality macro block maintaining your <strong>{profile.weight}kg</strong> body composition in fine physical equilibrium.</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAdd(rec)}
                    disabled={addedRecId === rec.id}
                    className={`w-full py-4 text-white rounded-full font-sans font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                      addedRecId === rec.id
                        ? "bg-gradient-to-r from-green-700 to-green-600 scale-[0.97]"
                        : "bg-gradient-to-r from-[#006d36] to-[#4ade80] hover:opacity-95 active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    {addedRecId === rec.id ? (
                      <>
                        <Check className="w-4 h-4 animate-scale-up" strokeWidth={3} />
                        <span>Added to Plan!</span>
                      </>
                    ) : (
                      <span>Add to Plan</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Quick Insight Grid */}
      <section className="space-y-4">
        <h4 className="font-display text-lg font-bold text-on-surface">Daily Insight</h4>
        <div className="grid grid-cols-2 gap-4">
          
          {/* Calories Left */}
          <div className="p-5 bg-surface-container-low rounded-3xl border border-white/50 flex flex-col items-center text-center shadow-sm">
            <Flame className="w-8 h-8 text-primary mb-2" />
            <span className="font-display text-xl font-bold text-on-surface">
              {leftKcal.toLocaleString()}
            </span>
            <span className="font-sans text-xs font-bold text-[#3d4a3e] uppercase tracking-wider mt-0.5">
              Cals Left
            </span>
          </div>

          {/* Protein Tracker */}
          <div className="p-5 bg-surface-container-low rounded-3xl border border-white/50 flex flex-col items-center text-center shadow-sm">
            <Dumbbell className="w-8 h-8 text-secondary mb-2" />
            <span className="font-display text-xl font-bold text-on-surface">
              {consumedProtein}g / {proteinGoal}g
            </span>
            <span className="font-sans text-xs font-bold text-[#3d4a3e] uppercase tracking-wider mt-0.5">
              Protein
            </span>
          </div>

          {/* Hydration Tracker */}
          <div className="p-5 bg-surface-container-low rounded-3xl border border-white/50 flex flex-col items-center text-center shadow-sm">
            <Droplets className="w-8 h-8 text-[#0284c7] mb-2" />
            <span className="font-display text-xl font-bold text-on-surface">
              {hydration.toFixed(1)}L
            </span>
            <span className="font-sans text-xs font-bold text-[#3d4a3e] uppercase tracking-wider mt-0.5">
              Hydration
            </span>
          </div>

          {/* Streaks Tracker */}
          <div className="p-5 bg-surface-container-low rounded-3xl border border-white/50 flex flex-col items-center text-center shadow-sm">
            <Trophy className="w-8 h-8 text-yellow-500 mb-2 animate-bounce" />
            <span className="font-display text-xl font-bold text-on-surface">
              Day 12
            </span>
            <span className="font-sans text-xs font-bold text-[#3d4a3e] uppercase tracking-wider mt-0.5">
              Streak
            </span>
          </div>

        </div>
      </section>
    </div>
  );
}
