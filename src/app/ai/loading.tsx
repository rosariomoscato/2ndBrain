import { LoadingOrb } from "@/components/ui/loading-orb";

export default function AILoading() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingOrb size="lg" />
        <p className="text-text-secondary text-sm">Initializing AI systems...</p>
      </div>
    </div>
  );
}
