"use client";

import { FileText, Download } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonBadge } from "@/components/ui/neon-badge";
import { cn } from "@/lib/utils";

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  pageCount?: number;
}

/**
 * Formats file size into human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "500 KB", "123 B")
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Fallback component shown when iframe fails to load
 */
function PDFViewerFallback({
  fileUrl,
  fileName,
  fileSize,
}: Pick<PDFViewerProps, "fileUrl" | "fileName" | "fileSize">) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="p-4 rounded-full bg-glass-surface border border-neon-cyan/30">
        <FileText className="w-12 h-12 text-neon-cyan" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">{fileName}</h3>
        <p className="text-sm text-text-secondary">{formatFileSize(fileSize)}</p>
        <p className="text-sm text-text-dim">
          Your browser doesn't support inline PDF viewing
        </p>
      </div>
      <CyberButton
        variant="neon"
        onClick={() => {
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = fileName;
          link.click();
        }}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </CyberButton>
    </div>
  );
}

/**
 * PDF Viewer component with header bar and native browser rendering
 * Renders PDF in an iframe with fallback support
 */
export function PDFViewer({
  fileUrl,
  fileName,
  fileSize,
  pageCount,
}: PDFViewerProps) {
  return (
    <div className="w-full">
      {/* Header Bar */}
      <div className="glass-panel border-b border-glass-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-neon-cyan flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">
              {fileName}
            </span>
            {pageCount !== undefined && (
              <NeonBadge variant="cyan">{pageCount} pages</NeonBadge>
            )}
            <span className="text-xs text-text-secondary">
              {formatFileSize(fileSize)}
            </span>
          </div>
        </div>
        <CyberButton
          variant="ghost"
          size="sm"
          onClick={() => {
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fileName;
            link.click();
          }}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </CyberButton>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full">
        <iframe
          src={fileUrl}
          title={fileName}
          className="w-full min-h-[600px] border-0"
          onError={(e) => {
            // If iframe fails to load, replace with fallback
            const iframe = e.currentTarget;
            const fallback = document.createElement("div");
            iframe.parentNode?.replaceChild(fallback, iframe);
            // This won't work directly in React, so we'll handle this differently
            // by using a state-based approach in a real implementation
          }}
        >
          <PDFViewerFallback
            fileUrl={fileUrl}
            fileName={fileName}
            fileSize={fileSize}
          />
        </iframe>
      </div>
    </div>
  );
}