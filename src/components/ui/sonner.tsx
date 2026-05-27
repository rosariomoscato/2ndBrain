"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()
  const resolvedTheme: "system" | "light" | "dark" =
    theme === "light" || theme === "dark" ? theme : "system"

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--brutal-border)",
          "--border-radius": "0px",
          "--border-width": "2px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!border-2 !border-brutal-border !rounded-none !shadow-[3px_3px_0px_0px_var(--brutal-shadow)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
