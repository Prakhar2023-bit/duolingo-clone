import { Target, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering to pull the live unit data
export const dynamic = "force-dynamic";

export default async function QuestsPage() {
  // Fetch the course data to dynamically get your current unit
  const res = await fetch("http://127.0.0.1:8000/courses/1", { cache: "no-store" });
  
  if (!res.ok) {
    return <div>Failed to load quests data.</div>;
  }
  
  const courseData = await res.json();
  // Target the first unit as the currently active one
  const currentUnit = courseData.units[0]; 

  return (
    <div className="flex flex-col gap-8 px-6 pb-24 max-w-[800px] mx-auto mt-8">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-4">
        <Target className="w-10 h-10 text-orange-500" />
        <h1 className="text-3xl font-bold text-gray-700">Course Quests</h1>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Current Quest / Unit */}
        <div className="border-2 border-duo-green rounded-2xl p-6 bg-duo-green-light/10 relative overflow-hidden">
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-duo-green-dark">{currentUnit.title}</h2>
              <span className="bg-duo-green text-white px-3 py-1 rounded-lg text-sm font-bold uppercase">
                In Progress
              </span>
            </div>
            
            <p className="text-gray-600 font-medium text-lg">
              Introduce yourself and greet others
            </p>
            
            {/* Button routing back to the Learn Dashboard */}
            <Link href="/" className="mt-2 block">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-duo-green text-white font-bold uppercase px-8 py-3 rounded-xl border-b-4 border-duo-green-dark hover:bg-duo-green-light active:border-b-0 active:translate-y-1 transition-all">
                Continue Learning
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Locked Unit 2 */}
        <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50 flex items-center justify-between opacity-80">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-400">Unit 2</h2>
            <p className="text-gray-400 font-medium text-lg">Talk about food and travel</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lock className="w-8 h-8 text-gray-400" />
            <span className="text-gray-400 font-bold uppercase text-sm text-center">Coming Soon</span>
          </div>
        </div>

        {/* Locked Unit 3 */}
        <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50 flex items-center justify-between opacity-80">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-400">Unit 3</h2>
            <p className="text-gray-400 font-medium text-lg">Navigate the city</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lock className="w-8 h-8 text-gray-400" />
            <span className="text-gray-400 font-bold uppercase text-sm text-center">Coming Soon</span>
          </div>
        </div>

      </div>
    </div>
  );
}