import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Mic, Sparkles, BookOpen } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto relative">
        {/* Decorative elements behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/40 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground/80">AI-Powered Personalized Messages</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
            Vocal<span className="text-primary">Vizz</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-xl mx-auto">
            "From far to near, we make love clear"
          </p>
          
          <div className="pt-8">
            <Link href="/upload">
              <button className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Create Message <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
            <FeatureCard 
              icon={<Mic className="w-6 h-6 text-primary" />}
              title="Your Voice"
              desc="Upload a sample and we'll narrate stories in your voice."
            />
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6 text-secondary" />}
              title="Magical Stories"
              desc="Choose from bedtime stories, rhymes, or lessons."
            />
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-purple-500" />}
              title="Instant Video"
              desc="Get a personalized video with your photo and voice."
            />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/40 border border-white/30 backdrop-blur-sm hover:bg-white/60 transition-colors">
      <div className="mb-4 p-3 bg-white rounded-xl w-fit shadow-sm">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
