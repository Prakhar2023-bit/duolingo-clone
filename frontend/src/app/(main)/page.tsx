import { Star, Check, Lock, BookOpen } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering so the progression updates immediately after a lesson
export const dynamic = "force-dynamic";

export default async function Home() {
  const res = await fetch("https://duolingo-clone-backend-370q.onrender.com/courses/1", { cache: "no-store" });
  const userRes = await fetch("https://duolingo-clone-backend-370q.onrender.com/users/1", { cache: "no-store" });

  if (!res.ok || !userRes.ok) {
    return <div>Failed to load course data.</div>;
  }

  const courseData = await res.json();
  const user = await userRes.json();

  // 1. Calculate the active skill
  let activeSkillIndex = Math.floor(user.total_xp / 10);
  const totalSkills = courseData.units[0].skills.length;
  
  // 2. Clamp the index: If XP pushes them past available lessons, keep the last node active
  if (activeSkillIndex >= totalSkills) {
    activeSkillIndex = totalSkills - 1;
  }

  return (
    <div className="flex flex-col gap-10 px-6 pb-24 max-w-[800px] mx-auto">
      
      {courseData.units.map((unit: any) => (
        <div key={unit.id} className="flex flex-col relative">
          
          {/* Unit Banner */}
          <div className="bg-duo-green rounded-xl p-4 sm:p-6 text-white flex items-center justify-between border-2 border-transparent border-b-4 border-b-duo-green-dark z-20">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">{unit.title}</h2>
              <p className="text-lg font-medium text-white/80">Introduce yourself and greet others</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 border-2 border-white/40 border-b-4 hover:bg-white/10 active:border-b-2 active:translate-y-[2px] transition-all rounded-xl px-4 py-2 uppercase font-bold text-sm">
              <BookOpen className="w-5 h-5" />
              Guidebook
            </button>
          </div>

          {/* The Winding Progression Path */}
          <div className="flex flex-col items-center py-12 gap-8 relative">
            {unit.skills.map((skill: any, index: number) => {
              
              // Determine Node State
              const isCompleted = index < activeSkillIndex;
              const isActive = index === activeSkillIndex;
              const isLocked = index > activeSkillIndex;

              // Winding Path Math
              const offsets = [0, 40, 80, 40, 0, -40, -80, -40];
              const translateX = offsets[index % offsets.length];

              // Replace "Order at a cafe" with "Introduction"
              const displayTitle = skill.title.includes("Order at a cafe") || skill.title.includes("Order at a café") 
                ? "Introduction" 
                : skill.title;

              return (
                <div 
                  key={skill.id} 
                  className="relative flex flex-col items-center"
                  style={{ transform: `translateX(${translateX}px)` }} 
                >
                  
                  {/* Active Tooltip (Now guaranteed to render on the active node) */}
                  {isActive && (
                    <div className="absolute -top-14 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 font-bold text-duo-green text-sm shadow-sm whitespace-nowrap z-10 animate-bounce">
                      Start {displayTitle}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-gray-200 rotate-45"></div>
                    </div>
                  )}

                  {/* The Node Button */}
                  {isLocked ? (
                    // LOCKED STATE (Gray)
                    <div className="h-[80px] w-[80px] rounded-full bg-gray-200 border-b-[8px] border-gray-300 flex items-center justify-center text-gray-400 opacity-80 cursor-not-allowed">
                      <Lock className="w-8 h-8 fill-gray-400" />
                    </div>
                  ) : (
                    // ACTIVE OR COMPLETED STATE
                    <Link href={`/lesson/${skill.id}`}>
                      <button className={`
                        h-[80px] w-[80px] rounded-full flex items-center justify-center transition-all relative z-0 border-b-[8px] active:border-b-[0px] active:translate-y-[8px]
                        ${isCompleted 
                          ? "bg-yellow-400 border-yellow-500 hover:bg-yellow-300" 
                          : "bg-duo-green border-duo-green-dark hover:bg-duo-green-light" 
                        }
                      `}>
                        <div className="absolute inset-2 rounded-full border-2 border-white/30"></div>
                        
                        {isCompleted ? (
                          <Check className="w-10 h-10 text-white" strokeWidth={4} />
                        ) : (
                          <Star className="w-10 h-10 fill-white text-white" />
                        )}
                      </button>
                    </Link>
                  )}
                  
                  {/* Skill Title Below Node */}
                  <span className={`text-sm font-bold mt-4 ${isLocked ? "text-gray-400" : "text-gray-600"}`}>
                    {displayTitle}
                  </span>

                </div>
              );
            })}
          </div>
          
        </div>
      ))}
    </div>
  );
}