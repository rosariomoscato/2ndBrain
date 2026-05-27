"use client";

import { useState, useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Camera state interface for localStorage
interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

export function CameraControls() {
  const { zoomIn, zoomOut, fitView, setCenter, getViewport } = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const savedCamera = localStorage.getItem("graph-camera");
      if (savedCamera) {
        try {
          const cameraState: CameraState = JSON.parse(savedCamera);
          return cameraState.zoom;
        } catch (error) {
          console.error("Failed to load camera state:", error);
        }
      }
    }
    return 1;
  });
  const [isPanning, setIsPanning] = useState(false);
  const cameraLoadedRef = useRef(false);

  // Load camera state from localStorage on mount
  useEffect(() => {
    if (cameraLoadedRef.current) return;

    const savedCamera = localStorage.getItem("graph-camera");
    if (savedCamera) {
      try {
        const cameraState: CameraState = JSON.parse(savedCamera);
        setCenter(cameraState.x, cameraState.y, { zoom: cameraState.zoom, duration: 0 });
      } catch (error) {
        console.error("Failed to load camera state:", error);
      }
    }
    cameraLoadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save camera state to localStorage on zoom change
  const saveCameraState = () => {
    try {
      const viewport = getViewport();
      const cameraState: CameraState = {
        x: viewport.x,
        y: viewport.y,
        zoom: viewport.zoom,
      };
      localStorage.setItem("graph-camera", JSON.stringify(cameraState));
    } catch (error) {
      console.error("Failed to save camera state:", error);
    }
  };

  const handleZoomIn = () => {
    zoomIn({ duration: 300 });
    setZoomLevel((prev) => Math.min(prev + 0.1, 2.0));
    setTimeout(saveCameraState, 350);
  };

  const handleZoomOut = () => {
    zoomOut({ duration: 300 });
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
    setTimeout(saveCameraState, 350);
  };

  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 800 });
    setTimeout(() => {
      const viewport = getViewport();
      setZoomLevel(viewport.zoom);
      saveCameraState();
    }, 850);
  };

  const handleResetCamera = () => {
    setCenter(0, 0, { zoom: 1, duration: 500 });
    setZoomLevel(1);
    setTimeout(saveCameraState, 550);
  };

  const togglePanMode = () => {
    setIsPanning(!isPanning);
  };

  return (
    <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
      {/* Main Controls Panel */}
      <div className="glass-panel rounded-xl p-2 flex flex-col gap-2">
        {/* Zoom Level Display */}
        <div className="text-center mb-1">
          <span className="font-tech text-neon-cyan text-xs">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-glass-border mb-1" />

        {/* Zoom Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:scale-110 focus-ring"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:scale-110 focus-ring"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        {/* Divider */}
        <div className="w-full h-px bg-glass-border my-1" />

        {/* Action Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:scale-110 focus-ring"
          onClick={handleFitView}
          title="Fit View"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:scale-110 focus-ring"
          onClick={handleResetCamera}
          title="Reset Camera"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Pan Mode Toggle Panel */}
      <div className="glass-panel rounded-xl p-2">
        <Button
          variant={isPanning ? "neon" : "ghost"}
          size="icon"
          className="h-8 w-8 hover:scale-110 focus-ring"
          onClick={togglePanMode}
          title={isPanning ? "Pan Mode: On" : "Pan Mode: Off"}
        >
          <Move className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}