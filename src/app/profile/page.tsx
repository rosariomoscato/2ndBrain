"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Calendar, User, Shield, ArrowLeft, Lock, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [emailPrefsOpen, setEmailPrefsOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-3 font-[family-name:var(--font-display)] text-sm tracking-wider uppercase">
          <div className="bg-neon h-2 w-2 animate-pulse rounded-full" />
          Caricamento...
        </div>
      </div>
    );
  }

  const user = session.user;
  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("it-IT", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const handleEditProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.info("Gli aggiornamenti del profilo richiedono l'implementazione del backend");
    setEditProfileOpen(false);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider uppercase">
            Il tuo Profilo
          </h1>
          <p className="text-muted-foreground font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
            Gestisci le impostazioni del tuo account
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Profile Overview Card */}
        <Card className="overflow-visible">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="border-neon h-20 w-20 border-2 shadow-[3px_3px_0px_0px_var(--brutal-shadow)]">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "Utente"}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="bg-neon text-primary-foreground text-lg">
                  {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wider uppercase">
                  {user.name}
                </h2>
                <div className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-sm">{user.email}</span>
                  {user.emailVerified && (
                    <Badge variant="neon">
                      <Shield className="mr-1 h-2.5 w-2.5" />
                      Verificato
                    </Badge>
                  )}
                </div>
                {createdDate && (
                  <div className="text-muted-foreground flex items-center gap-2 font-[family-name:var(--font-display)] text-xs tracking-wider uppercase">
                    <Calendar className="h-3 w-3" />
                    <span>Membro dal {createdDate}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Informazioni Account</CardTitle>
              <span className="tag-terminal">Info</span>
            </div>
            <CardDescription>Dettagli e impostazioni del tuo account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <div className="border-brutal-border bg-surface brutal-shadow-sm border-2 p-3 text-sm">
                  {user.name || "Non fornito"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Indirizzo Email</Label>
                <div className="border-brutal-border bg-surface brutal-shadow-sm flex items-center justify-between border-2 p-3">
                  <span className="text-sm">{user.email}</span>
                  {user.emailVerified && <Badge variant="neon">Verificato</Badge>}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-base font-bold tracking-wider uppercase">
                Stato Account
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="border-brutal-border bg-surface flex items-center justify-between border-2 p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Verifica Email</p>
                    <p className="text-muted-foreground text-xs">Stato di verifica</p>
                  </div>
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? "Verificato" : "Non verificato"}
                  </Badge>
                </div>
                <div className="border-brutal-border bg-surface flex items-center justify-between border-2 p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Tipo Account</p>
                    <p className="text-muted-foreground text-xs">Livello di accesso</p>
                  </div>
                  <Badge variant="outline">Standard</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Attivit&agrave; Recenti</CardTitle>
              <span className="tag-terminal">Log</span>
            </div>
            <CardDescription>Le tue sessioni recenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-brutal-border bg-surface flex items-center justify-between border-2 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-neon animate-pulse-neon h-2 w-2 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Sessione Corrente</p>
                  <p className="text-muted-foreground text-xs">Attiva ora</p>
                </div>
              </div>
              <Badge variant="neon">Attiva</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Azioni Rapide</CardTitle>
              <span className="tag-terminal">Actions</span>
            </div>
            <CardDescription>Gestisci le impostazioni del tuo account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Button
                variant="outline"
                className="h-auto justify-start p-4 text-left"
                onClick={() => setEditProfileOpen(true)}
              >
                <User className="mr-3 h-4 w-4 shrink-0" />
                <div>
                  <div className="text-sm font-medium">Modifica Profilo</div>
                  <div className="text-muted-foreground text-xs">Aggiorna le tue informazioni</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto justify-start p-4 text-left"
                onClick={() => setSecurityOpen(true)}
              >
                <Shield className="mr-3 h-4 w-4 shrink-0" />
                <div>
                  <div className="text-sm font-medium">Sicurezza</div>
                  <div className="text-muted-foreground text-xs">Gestisci le opzioni</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto justify-start p-4 text-left"
                onClick={() => setEmailPrefsOpen(true)}
              >
                <Mail className="mr-3 h-4 w-4 shrink-0" />
                <div>
                  <div className="text-sm font-medium">Preferenze Email</div>
                  <div className="text-muted-foreground text-xs">Configura notifiche</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifica Profilo</DialogTitle>
            <DialogDescription>Aggiorna le informazioni del tuo profilo.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue={user.name || ""} placeholder="Inserisci il tuo nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email || ""}
                disabled
                className="opacity-50"
              />
              <p className="text-muted-foreground font-[family-name:var(--font-display)] text-xs">
                L&apos;email non pu&ograve; essere modificata per gli account OAuth
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditProfileOpen(false)}>
                Annulla
              </Button>
              <Button type="submit">Salva Modifiche</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Security Settings Dialog */}
      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Impostazioni Sicurezza</DialogTitle>
            <DialogDescription>
              Gestisci la sicurezza e l&apos;autenticazione del tuo account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="border-brutal-border bg-surface flex items-center justify-between border-2 p-4">
              <div className="flex items-center gap-3">
                <Lock className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-muted-foreground text-xs">
                    {user.email?.includes("@gmail") ? "Gestita da Google" : "Imposta una password"}
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                {user.email?.includes("@gmail") ? "OAuth" : "Non impostata"}
              </Badge>
            </div>

            <div className="border-brutal-border bg-surface flex items-center justify-between border-2 p-4">
              <div className="flex items-center gap-3">
                <Smartphone className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Autenticazione a Due Fattori</p>
                  <p className="text-muted-foreground text-xs">
                    Aggiungi un ulteriore livello di sicurezza
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Prossimamente
              </Button>
            </div>

            <div className="border-brutal-border bg-surface flex items-center justify-between border-2 p-4">
              <div className="flex items-center gap-3">
                <Shield className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Sessioni Attive</p>
                  <p className="text-muted-foreground text-xs">Dispositivi connessi</p>
                </div>
              </div>
              <Badge variant="default">1 Attiva</Badge>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setSecurityOpen(false)}>
              Chiudi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Preferences Dialog */}
      <Dialog open={emailPrefsOpen} onOpenChange={setEmailPrefsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Preferenze Email</DialogTitle>
            <DialogDescription>Configura le notifiche email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="border-brutal-border bg-surface flex items-center justify-between border-2 p-4">
              <div>
                <p className="text-sm font-medium">Email Marketing</p>
                <p className="text-muted-foreground text-xs">
                  Aggiornamenti e annunci sui prodotti
                </p>
              </div>
              <Badge variant="secondary">Prossimamente</Badge>
            </div>
            <div className="border-brutal-border bg-surface flex items-center justify-between border-2 p-4">
              <div>
                <p className="text-sm font-medium">Avvisi di Sicurezza</p>
                <p className="text-muted-foreground text-xs">Notifiche di sicurezza importanti</p>
              </div>
              <Badge variant="neon">Sempre Attivo</Badge>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setEmailPrefsOpen(false)}>
              Chiudi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
