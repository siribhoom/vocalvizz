import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Download, RefreshCw, AlertCircle, PlayCircle, Loader2 } from "lucide-react";
import { useProject } from "@/hooks/use-projects";
import { Layout } from "@/components/Layout";
import { Progress } from "@/components/ui/progress";

export default function Output() {
  const { id } = useParams();
  const { data: project, isLoading, error } = useProject(Number(id));

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="bg-destructive/10 p-4 rounded-full text-destructive mb-4">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">We couldn't load your project.</p>
          <Link href="/">
            <button className="px-6 py-2 rounded-xl bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors">
              Go Home
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isPending = project.status === "pending" || project.status === "processing";
  const isCompleted = project.status === "completed";
  const isFailed = project.status === "failed";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full py-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header Status */}
          <div className="mb-10">
            {isPending && (
              <>
                <h1 className="text-3xl font-bold mb-3 animate-pulse text-gradient">Creating Magic...</h1>
                <p className="text-muted-foreground">We're weaving your voice and story together. Hang tight!</p>
              </>
            )}
            {isCompleted && (
              <>
                <h1 className="text-3xl font-bold mb-3 text-foreground">Your Message is Ready!</h1>
                <p className="text-muted-foreground">A special gift for your special one.</p>
              </>
            )}
            {isFailed && (
              <>
                <h1 className="text-3xl font-bold mb-3 text-destructive">Generation Failed</h1>
                <p className="text-muted-foreground">Sorry, we encountered an issue generating your video.</p>
              </>
            )}
          </div>

          {/* Main Content Card */}
          <div className="glass-card rounded-3xl p-4 md:p-8 overflow-hidden relative min-h-[400px] flex items-center justify-center">
            
            {/* Loading State */}
            {isPending && (
              <div className="w-full max-w-md mx-auto space-y-8">
                 <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-4 border-muted rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <PlayCircle className="w-10 h-10 text-primary/50" />
                    </div>
                 </div>
                 <div className="space-y-2">
                   <Progress value={66} className="h-2 bg-muted/50" />
                   <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Processing</p>
                 </div>
              </div>
            )}

            {/* Completed State */}
            {isCompleted && project.videoUrl && (
              <div className="w-full h-full flex flex-col gap-6">
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video w-full">
                   <video 
                     controls 
                     className="w-full h-full object-contain"
                     src={project.videoUrl}
                     poster={project.imageUrl} // Use parent photo as poster
                   />
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <a 
                     href={project.videoUrl} 
                     download={`vocalvizz-${project.id}.mp4`}
                     className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
                   >
                     <Download className="w-5 h-5" /> Download Video
                   </a>
                   <Link href="/upload">
                     <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-border text-foreground rounded-xl font-semibold hover:bg-gray-50 transition-all">
                       <RefreshCw className="w-5 h-5" /> Create Another
                     </button>
                   </Link>
                 </div>
              </div>
            )}

            {/* Failed State */}
            {isFailed && (
              <div className="text-center space-y-6">
                <div className="bg-red-50 p-6 rounded-full inline-block">
                  <AlertCircle className="w-12 h-12 text-destructive" />
                </div>
                <p className="text-lg font-medium text-foreground max-w-md mx-auto">
                  We couldn't generate the video this time. Please check your file formats and try again.
                </p>
                <Link href="/upload">
                  <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
                    Try Again
                  </button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
