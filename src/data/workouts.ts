import hiitSessionImg from "../assets/images/hiit_session_1781194446130.jpg";
import yogaFlowImg from "../assets/images/yoga_flow_1781194468913.jpg";

export interface WorkoutSegment {
  id: string;
  name: string;
  duration: number; // in seconds
  instructions: string;
}

export interface WorkoutData {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  caloriesBurned: number;
  videoUrl: string;
  image: string;
  type: "Cardio" | "Intense" | "Zen";
  badge: string;
  segments: WorkoutSegment[];
}

export const WORKOUTS: WorkoutData[] = [
  {
    id: "hiit-1",
    name: "Intense HIIT Burnout",
    description: "High-intensity interval training designed to maximize fat burn and elevate metabolic rate with no equipment required.",
    durationMinutes: 15,
    caloriesBurned: 185,
    type: "Intense",
    badge: "Fat Loss & Power",
    videoUrl: "https://www.youtube.com/embed/gC_L9qAHVJ8",
    image: hiitSessionImg,
    segments: [
      { id: "h-seg-1", name: "Dynamic Body warm-up", duration: 60, instructions: "Warm up with light arm swings, hips rotations, and marching." },
      { id: "h-seg-2", name: "Explosive Squat Jumps", duration: 45, instructions: "Drop your hips low then explode upwards with hands high!" },
      { id: "h-seg-3", name: "Active Recovery Rest", duration: 15, instructions: "Catch your breath, march in place." },
      { id: "h-seg-4", name: "High-Knee Sprint segment", duration: 45, instructions: "Drive knees high and fast up to your chest level." },
      { id: "h-seg-5", name: "Active Recovery Rest", duration: 15, instructions: "Breathe deep, sip tiny bit of water." },
      { id: "h-seg-6", name: "Rapid Mountain Climbers", duration: 45, instructions: "In plank position, rapidly pump knees to chest." },
      { id: "h-seg-7", name: "Active Recovery Rest", duration: 15, instructions: "Hold steady, shake out wrists." },
      { id: "h-seg-8", name: "Chest-To-Floor Burpees", duration: 45, instructions: "Drop into pressup, jump up high. Give it your all!" },
      { id: "h-seg-9", name: "Active Recovery Rest", duration: 15, instructions: "Stay focused, only two intense moves left!" },
      { id: "h-seg-10", name: "Slowing Tempo Push-Ups", duration: 45, instructions: "Clean forms. Descend slow, push high with chest." },
      { id: "h-seg-11", name: "Full-Body Core Plank", duration: 60, instructions: "Prone position, elbows aligned. Squeeze glutes and abs tight!" },
      { id: "h-seg-12", name: "Dynamic cool-down", duration: 120, instructions: "Deep breaths, hamstring and quadriceps stretches." }
    ]
  },
  {
    id: "yoga-1",
    name: "Calming Vinyasa Yoga Flow",
    description: "Connect your breath with elegant yoga movement in this centering routine suited for muscle flexibility and stress reduction.",
    durationMinutes: 30,
    caloriesBurned: 110,
    type: "Zen",
    badge: "Mindfulness & Flexibility",
    videoUrl: "https://www.youtube.com/embed/v7AYKMP6rOE",
    image: yogaFlowImg,
    segments: [
      { id: "y-seg-1", name: "Centering & Breath-work", duration: 120, instructions: "Sit cross-legged, focus on pranayama deep breathing." },
      { id: "y-seg-2", name: "Dynamic Cat-Cow Warm-up", duration: 90, instructions: "Hands and knees. Inhale arching spine, exhale round it." },
      { id: "y-seg-3", name: "Downward-Facing Dog (Adho Mukha)", duration: 120, instructions: "Lift hips up and back, press chest towards thighs." },
      { id: "y-seg-4", name: "Strong Warrior II Pose (Virabhadrasana)", duration: 90, instructions: "Deep lunge with back foot flat, arms stretched out wide." },
      { id: "y-seg-5", name: "Releasing Child's Pose (Balasana)", duration: 120, instructions: "Sit on heels, forehead down to the mat. Release lower back." },
      { id: "y-seg-6", name: "Balancing Tree Pose (Vrksasana)", duration: 120, instructions: "Balance on one foot, opposite foot on groin. Place hands at heart." },
      { id: "y-seg-7", name: "Elegant Triangle Pose (Trikonasana)", duration: 90, instructions: "Stretch sideways, look up at extended hand." },
      { id: "y-seg-8", name: "Cobra Pose (Bhujangasana)", duration: 90, instructions: "Lie on belly, gently peer up lifting upper back." },
      { id: "y-seg-9", name: "Savasana Final Relaxation (Corpse Pose)", duration: 180, instructions: "Completely relax on mat. Release all tension. Just breathe." }
    ]
  },
  {
    id: "cardio-1",
    name: "Outdoor Run & Cardio Prep",
    description: "An expert pacing guide and athletic audio-cue run sequence to boost lung capacity and cardio endurance.",
    durationMinutes: 15,
    caloriesBurned: 130, // scaled standard time
    type: "Cardio",
    badge: "Cardio & Lung Capacity",
    videoUrl: "https://www.youtube.com/embed/506n7_Zg864",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1000",
    segments: [
      { id: "r-seg-1", name: "Brisk warm-up walk", duration: 180, instructions: "Keep a quick pace to warm up lower body and mobilize hips." },
      { id: "r-seg-2", name: "Steady-state dynamic jogging", duration: 300, instructions: "Maintain comfortable running speed where you can talk." },
      { id: "r-seg-3", name: "High-tempo sprint intervals", duration: 180, instructions: "Increase speed to 85% maximum effort. Feel the power!" },
      { id: "r-seg-4", name: "Recovery jog pacing", duration: 120, instructions: "Slightly ease speed to recover breathing rhythm." },
      { id: "r-seg-5", name: "Cool-down and stretches", duration: 120, instructions: "Slow walk to return heart rate safely. Quadricep stretches." }
    ]
  }
];
