import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col font-sans">
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-[#2563EB]/10 p-2 rounded-xl group-hover:bg-[#2563EB]/20 transition-colors">
            <Heart className="w-6 h-6 text-[#2563EB] fill-[#2563EB]" />
          </div>
          <span className="font-display font-bold text-2xl text-[#2563EB] tracking-tight">
            VocalVizz
          </span>
        </Link>
        
        {!isHome && (
          <Link href="/upload">
             <button className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
               New Message
             </button>
          </Link>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col">
        {children}
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground/60">
        <p>© 2025 VocalVizz. Bridging distances with love.</p>
      </footer>
    </div>
  );
}
