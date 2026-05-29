import { Bold, Italic, Code, Link2, List, Quote, CheckSquare } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

interface ToolbarProps {
  onAction: (action: string) => void;
  isReadOnly?: boolean;
}

export function Toolbar({ onAction, isReadOnly = false }: ToolbarProps) {
  const toolbarButtons = [
    { icon: Bold, action: "bold", shortcut: "Ctrl+B", label: "Bold" },
    { icon: Italic, action: "italic", shortcut: "Ctrl+I", label: "Italic" },
    { icon: Code, action: "code", shortcut: "Ctrl+`", label: "Code" },
    { icon: Link2, action: "link", shortcut: "Ctrl+K", label: "Link" },
    { icon: List, action: "list", shortcut: "Ctrl+L", label: "List" },
    { icon: Quote, action: "quote", shortcut: "Ctrl+Q", label: "Quote" },
    { icon: CheckSquare, action: "checkbox", shortcut: "Ctrl+X", label: "Checkbox" },
  ];

  if (isReadOnly) {
    return null;
  }

  return (
    <div className="glass-panel border-glass-border flex items-center gap-2 border-b px-4 py-2">
      {toolbarButtons.map((button) => (
        <CyberButton
          key={button.action}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onAction(button.action)}
          title={`${button.label} (${button.shortcut})`}
        >
          <button.icon className="h-4 w-4" />
        </CyberButton>
      ))}
    </div>
  );
}
