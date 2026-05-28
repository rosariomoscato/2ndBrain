import { LoadingOrb } from "@/components/ui/loading-orb";

export default function AILoading() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <LoadingOrb size="lg" />
        <p className="text-text-secondary text-sm">Initializing AI systems...</p>
      </div>
    </div>
  );
}