// This directive tells Next.js to never cache this specific component
export const dynamic = "force-dynamic";

export async function RightBar() {
  const res = await fetch("http://127.0.0.1:8000/users/1", { 
    cache: "no-store" 
  });
  
  if (!res.ok) {
    return <div className="p-4">Loading stats...</div>;
  }
  
  const user = await res.json();

  // Seeded Leaderboard Data
  // We inject your actual live XP into the array and sort it descending!
  const leaderboardStats = [
    { name: "Sarah", xp: 250, initial: "S", color: "bg-blue-500" },
    { name: "Alex", xp: 180, initial: "A", color: "bg-purple-500" },
    { name: "Default User", xp: user.total_xp, initial: "D", color: "bg-duo-green" },
    { name: "Maria", xp: 120, initial: "M", color: "bg-pink-500" },
    { name: "David", xp: 45, initial: "D", color: "bg-orange-500" },
  ].sort((a, b) => b.xp - a.xp); // Sorts highest XP to the top

  return (
    <div className="hidden lg:block w-[300px] fixed right-0 top-0 h-full p-4 border-l-2 border-duo-gray pt-8 bg-white z-20 overflow-y-auto">
      
      {/* 1. Top Stats Bar */}
      <div className="flex items-center justify-between gap-4 px-2 w-full mb-8">
        <div className="flex items-center gap-2 text-duo-yellow font-bold text-lg">
          🔥 {user.streak}
        </div>
        <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
          ⚡ {user.total_xp}
        </div>
        <div className="flex items-center gap-2 text-duo-red font-bold text-lg">
          ❤️ {user.hearts}
        </div>
      </div>

      {/* 2. Mock Leaderboard */}
      <div className="border-2 border-gray-200 rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-700">Bronze League</h3>
        </div>
        
        <div className="flex flex-col gap-2">
          {leaderboardStats.map((player, index) => {
            const isCurrentUser = player.name === "Default User";
            
            return (
              <div 
                key={index} 
                className={`flex items-center gap-4 p-2 rounded-xl ${isCurrentUser ? "bg-gray-100" : ""}`}
              >
                {/* Rank Number */}
                <div className={`font-bold w-4 text-center ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-duo-green"}`}>
                  {index + 1}
                </div>
                
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${player.color}`}>
                  {player.initial}
                </div>
                
                {/* Name and XP */}
                <div className="flex flex-col flex-1">
                  <span className={`font-bold text-sm ${isCurrentUser ? "text-gray-800" : "text-gray-600"}`}>
                    {player.name}
                  </span>
                  <span className="text-gray-500 text-xs font-bold">
                    {player.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}