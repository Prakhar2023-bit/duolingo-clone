import { Sidebar } from "@/components/Sidebar";
import { RightBar } from "@/components/RightBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      {/* 
        The main content area is now pushed in from BOTH sides on large screens 
        to account for the left sidebar (256px) and right sidebar (300px). 
      */}
      <main className="lg:pl-[256px] lg:pr-[300px] h-full pt-[50px] lg:pt-0">
        <div className="max-w-[1056px] mx-auto pt-6 h-full">
          {children}
        </div>
      </main>
      <RightBar />
    </>
  );
}