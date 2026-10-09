import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Fetch a single project by ID
export function useProject(id: number) {
  return useQuery({
    queryKey: [api.projects.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.projects.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch project");
      return await res.json() as Project;
    },
    // Poll every 2 seconds if status is pending or processing
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      return data.status === "pending" || data.status === "processing" ? 2000 : false;
    },
    staleTime: 0,
  });
}

// Create a new project (Upload)
export function useCreateProject() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // NOTE: We do NOT set Content-Type header manually for FormData, 
      // browser sets it with boundary automatically.
      const res = await fetch(api.projects.create.path, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create project");
      }
      
      return await res.json() as Project;
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
