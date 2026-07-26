import { Zap, Flame, Heart } from "lucide-react";

// Ensure this page always fetches the freshest data from FastAPI
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const res = await fetch("http://127.0.0.1:8000/users/1", { 
    cache: "no-store" 
  });

  if (!res.ok) {
    return <div>Error loading profile data.</div>;
  }

  const user = await res.json();

  return (
    <div className="flex flex-col gap-8 px-6 pb-24 max-w-[800px] mx-auto">
      
      {/* 1. User Header */}
      <div className="flex items-center gap-6 border-b-2 border-gray-200 pb-8 mt-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-duo-green-light/20 rounded-full flex items-center justify-center border-4 border-duo-green-light">
          <span className="text-4xl sm:text-6xl">🧑‍💻</span>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-700">Default User</h1>
          <p className="text-gray-500 font-bold text-lg">Learner since 2026</p>
        </div>
      </div>

      {/* 2. Statistics Grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          
          <div className="flex items-center gap-4 border-2 border-gray-200 rounded-2xl p-4">
            <Flame className="w-8 h-8 text-duo-yellow fill-duo-yellow" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-700">{user.streak}</span>
              <span className="text-gray-500 text-sm font-bold">Day Streak</span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-2 border-gray-200 rounded-2xl p-4">
            <Zap className="w-8 h-8 text-orange-500 fill-orange-500" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-700">{user.total_xp}</span>
              <span className="text-gray-500 text-sm font-bold">Total XP</span>
            </div>
          </div>

          <div className="flex items-center gap-4 border-2 border-gray-200 rounded-2xl p-4">
            <Heart className="w-8 h-8 text-duo-red fill-duo-red" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-700">{user.hearts}</span>
              <span className="text-gray-500 text-sm font-bold">Current Hearts</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Ongoing Courses */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-2xl font-bold text-gray-700">Ongoing Courses</h2>
        <div className="flex items-center justify-between border-2 border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl border-2 border-blue-200">
              🇫🇷
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-700">French</span>
              <span className="text-gray-500 font-bold">Unit 1 in progress</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}