import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  MessagesSquare,
  Megaphone,
  Boxes,
  CalendarCheck,
  Zap,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Emails", icon: Mail },
  { to: "/meetings", label: "Meetings", icon: NotebookPen },
  { to: "/chat", label: "Chatbot", icon: MessagesSquare },
  { to: "/marketing", label: "Marketing", icon: Megaphone },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/planner", label: "Planner", icon: CalendarCheck },
  { to: "/replies", label: "Quick Replies", icon: Zap },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gold font-bold text-primary-foreground">
              S
            </span>
            <span className="hidden text-sm font-semibold leading-tight sm:block">
              Simtha&apos;s Smart Buyers
              <span className="block text-[11px] font-normal text-muted-foreground">
                AI Business Assistant
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground [&.active]:bg-accent [&.active]:text-gold"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>

          <button
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto rounded-lg border border-border p-2 text-gold lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>

        <div className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}>
          <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-1 p-3 sm:grid-cols-4">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary [&.active]:bg-accent [&.active]:text-gold"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>

      <footer className="mt-10 border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Simtha&apos;s Smart Buyers · Affordable hair pieces,
        cellphones &amp; accessories · Made in South Africa
      </footer>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-gold">
          <Icon className="size-5" />
        </span>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{description}</p>
      <div className="gold-divider mt-5 opacity-40" />
    </div>
  );
}
