import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, Mic, Image as ImageIcon, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useCreateProject } from "@/hooks/use-projects";
import { Layout } from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  "Bedtime Story", 
  "Rhymes", 
  "Educational Message", 
  "Motivation / Emotional Comfort"
];

export default function Upload() {
  const [, setLocation] = useLocation();
  const createProject = useCreateProject();
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [contentType, setContentType] = useState("");
  const [topic, setTopic] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo || !audio || !contentType || !topic) return;
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("image", photo);
    formData.append("audio", audio);
    formData.append("contentType", contentType);
    formData.append("topic", topic);
    
    try {
      const project = await createProject.mutateAsync(formData);
      setLocation(`/output/${project.id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Create Magic</h1>
          <p className="text-muted-foreground">Upload your details to generate a personalized message.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo Upload */}
            <FileUploadField 
              label="Your Photo"
              icon={<ImageIcon className="w-8 h-8 mb-2 text-primary/50" />}
              accept="image/*"
              file={photo}
              setFile={setPhoto}
            />

            {/* Audio Upload */}
            <FileUploadField 
              label="Your Voice (10s sample)"
              icon={<Mic className="w-8 h-8 mb-2 text-secondary/50" />}
              accept="audio/*"
              file={audio}
              setFile={setAudio}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base font-semibold text-foreground/80">Message Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger id="type" className="h-12 bg-white/50 border-white/40 focus:ring-primary/20 rounded-xl">
                  <SelectValue placeholder="Select content type..." />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic" className="text-base font-semibold text-foreground/80">Topic or Theme</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Courage, The Alphabet, Missing You"
                className="h-12 bg-white/50 border-white/40 focus:ring-primary/20 rounded-xl"
              />
            </div>
          </motion.div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!photo || !audio || !contentType || !topic || isSubmitting}
              className={cn(
                "w-full md:w-auto px-10 py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-300",
                isSubmitting 
                  ? "bg-muted cursor-wait" 
                  : "bg-gradient-to-r from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Generate Video <Sparkles className="w-5 h-5" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

function FileUploadField({ 
  label, 
  icon, 
  accept, 
  file, 
  setFile 
}: { 
  label: string, 
  icon: React.ReactNode, 
  accept: string, 
  file: File | null, 
  setFile: (f: File | null) => void 
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      className={cn(
        "relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center h-48",
        file 
          ? "bg-green-50/50 border-green-200" 
          : "bg-white/40 border-primary/10 hover:border-primary/30 hover:bg-white/60"
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) setFile(e.target.files[0]);
        }}
      />
      
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="bg-green-100 p-3 rounded-full text-green-600 mb-1">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-green-700 truncate max-w-[180px]">{file.name}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-xs text-muted-foreground hover:text-destructive mt-1"
            >
              Remove
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <p className="font-semibold text-foreground/80">{label}</p>
            <p className="text-xs text-muted-foreground">Click to upload</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
