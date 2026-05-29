"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";

export function UserProfile() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <div className="border-brutal-border bg-surface h-8 w-8 animate-pulse border-2" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Accedi
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Registrati</Button>
        </Link>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="border-brutal-border hover:border-neon size-9 cursor-pointer border-2 shadow-[2px_2px_0px_0px_var(--brutal-shadow)] transition-colors">
          <AvatarImage
            src={session.user?.image || ""}
            alt={session.user?.name || "User"}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-surface text-xs">
            {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold tracking-wider uppercase">{session.user?.name}</p>
            <p className="text-muted-foreground truncate text-xs">{session.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profilo
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
