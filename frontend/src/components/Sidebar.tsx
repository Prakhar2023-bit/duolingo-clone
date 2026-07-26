"import client"; // Makes this a Client Component so we can read the current route
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, User } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname(); // Get the current URL path

  return (
    <div className="hidden lg:flex h-full w-[256px] flex-col border-r-2 border-duo-gray px-4 py-4 fixed left-0 top-0 bg-white z-30">
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-duo-green tracking-wide">duolingo</h1>
        </div>
      </Link>

      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem 
          icon={<Home className="w-8 h-8" />} 
          label="Learn" 
          href="/" 
          active={pathname === "/"} 
        />
        <SidebarItem 
          icon={<Target className="w-8 h-8" />} 
          label="Quests" 
          href="/quests" 
          active={pathname === "/quests"} 
        />
        <SidebarItem 
          icon={<User className="w-8 h-8" />} 
          label="Profile" 
          href="/profile" 
          active={pathname === "/profile"} 
        />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, href, active }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-x-4 px-4 py-3 rounded-xl font-bold uppercase tracking-wide cursor-pointer transition-all border-2 ${
        active 
        ? "bg-duo-blue-light/20 border-duo-blue-light text-duo-blue" 
        : "border-transparent text-gray-500 hover:bg-gray-100"
      }`}>
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}