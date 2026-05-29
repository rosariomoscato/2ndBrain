import { CheckCircle, AlertCircle, FileText } from "lucide-react";
import { LoadingOrb } from "@/components/ui/loading-orb";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
  files: Array<{
    name: string;
    size: number;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
  }>;
}

export function UploadProgress({ files }: UploadProgressProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-2 mt-4">
      {files.map((file, index) => {
        const isUploading = file.status === "uploading";
        const isSuccess = file.status === "success";
        const isError = file.status === "error";

        return (
          <div
            key={`${file.name}-${index}`}
            className={cn(
              "glass-panel flex items-center gap-3 p-3 rounded-lg transition-all",
              isSuccess && "border-neon-cyan/50",
              isError && "border-neon-pink/50"
            )}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {isUploading && <LoadingOrb size="icon" className="scale-50" />}
              {isSuccess && (
                <CheckCircle className="w-6 h-6 text-neon-cyan" />
              )}
              {isError && (
                <AlertCircle className="w-6 h-6 text-neon-pink" />
              )}
              {file.status === "pending" && (
                <FileText className="w-5 h-5 text-text-secondary" />
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {file.name}
              </p>
              <p className="text-xs text-text-dim">
                {formatFileSize(file.size)}
              </p>
              {isError && file.error && (
                <p className="text-xs text-neon-pink mt-1">{file.error}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}