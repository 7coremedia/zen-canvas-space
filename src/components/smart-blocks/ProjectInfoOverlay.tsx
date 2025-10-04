import { useState } from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";

/**
 * Represents the detailed information for a portfolio project.
 * This structure will eventually map to your Supabase table.
 */
export type ProjectDetails = {
  client?: string;
  industry?: string;
  location?: string;
  our_role?: string;
  the_challenge?: string;
  the_solution?: string;
  notes?: any; // Using 'any' for now to represent the rich-text editor content (e.g., JSON)
  is_notes_downloadable?: boolean;
};

type Props = {
  className?: string;
  projectData: ProjectDetails;
};

/**
 * A floating action button that reveals a popover with detailed project information.
 * Inspired by the DesignSelector component.
 */
export default function ProjectInfoOverlay({ className, projectData }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="hero"
          size="lg"
          className={cn(
            "px-5 h-12 rounded-xl border border-black/10 bg-white/40 shadow-sm backdrop-blur-md text-sm text-neutral-900 hover:bg-white/60 hover:shadow-md",
            "flex items-center gap-2",
            className
          )}
          aria-label="Open project details"
        >
          <Info className="h-4 w-4 opacity-80" />
          <span className="opacity-90">About project</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        sideOffset={10}
        className={cn(
          "w-[min(92vw,680px)] p-0 rounded-xl overflow-hidden border border-black/10 bg-white/35 backdrop-blur-2xl shadow-2xl",
          "data-[state=open]:animate-in data-[side=bottom]:slide-in-from-top-2"
        )}
      >
        <ProjectInfoCard
          details={projectData}
          isEditable={false} // In the portfolio view, notes are read-only
          onDownloadNotes={() => {
            // This function will handle the download logic, similar to BrandProfileDetails.
            // We can use a library like html-to-image or jsPDF to generate the file.
            console.log("Downloading notes...");
            alert("Note download functionality will be implemented here.");
          }}
        />
      </PopoverContent>
    </Popover>
  );
}