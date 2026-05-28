import { MainViewport } from "@/components/layout/main-viewport";
import { LoadingOrb } from "@/components/ui/loading-orb";

export default function NotesLoading() {
  return (
    <MainViewport>
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <LoadingOrb size="lg" />
          <p className="text-text-secondary text-sm">Loading notes...</p>
        </div>
      </div>
    </MainViewport>
  );
}