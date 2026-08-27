import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  MessagesSquare,
  Megaphone,
  Boxes,
  CalendarCheck,
  Zap,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { useStats } from "@/lib/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Simtha's Smart Buyers AI Assistant" },
      {
        name: "description",
        content:
          "AI dashboard for Simtha's Smart Buyers — generate emails, summarize meetings, chat with customers and create promotions for hair pieces and cellphones.",
      },
      { property: "og:title", content: "Simtha's Smart Buyers — AI Business Dashboard" },
      {
        property: "og:description",
        content:
          "Serve customers faster, manage your business smarter and grow sales with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    text: "Order confirmations, delivery updates, payment reminders and more — written in seconds.",
  },
  {
    to: "/meetings",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    text: "Turn messy staff or supplier notes into decisions, action items and deadlines.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Customer Chatbot",
    text: "Answer wig, hair and cellphone questions plus delivery, payment and returns queries.",
  },
  {
    to: "/marketing",
    icon: Megaphone,
    title: "Marketing & Promotions",
    text: "WhatsApp, Facebook, Instagram and TikTok captions with hashtags and slogans.",
  },
] as const;

const EXTRAS = [
  { to: "/inventory", icon: Boxes, title: "Inventory Assistant", text: "Low stock alerts & restock advice" },
  { to: "/planner", icon: CalendarCheck, title: "Daily Business Planner", text: "Priority tasks & schedule" },
  { to: "/replies", icon: Zap, title: "Quick Customer Replies", text: "Instant WhatsApp answers" },
] as const;

const CATALOG = [
  {
    title: "Hair Pieces",
    items: [
      "Brazilian Straight Wig",
      "Body Wave Wig",
      "Curly Wig",
      "Lace Front Wig",
      "Closure Wig",
      "Frontal Wig",
      "Braiding Hair",
      "Hair Extensions",
    ],
  },
  {
    title: "Cellphones",
    items: [
      "Samsung Galaxy A36",
      "Samsung Galaxy A56",
      "Redmi Note 14",
      "Tecno Spark Series",
      "Infinix Smart Series",
      "iPhone 13",
      "iPhone 14",
    ],
  },
  {
    title: "Accessories",
    items: ["Chargers", "Earphones", "Phone Covers", "Screen Protectors", "Power Banks"],
  },
] as const;

function Dashboard() {
  const stats = useStats();

  const statCards = [
    { label: "Total Emails Generated", value: stats.emails },
    { label: "Meetings Summarized", value: stats.meetings },
    { label: "Customer Conversations", value: stats.conversations },
    { label: "Promotions Created", value: stats.promotions },
    { label: "Inventory Checks", value: stats.inventory },
    { label: "Daily Plans Created", value: stats.planner },
    { label: "Quick Replies Drafted", value: stats.replies },
  ];

  return (
    <div className="space-y-14">
      <section className="surface-luxe relative overflow-hidden rounded-3xl">
        <img
          src={heroImage}
          alt="Luxury wig and smartphone flat-lay in black and gold"
          width={1600}
          height={912}
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="relative bg-gradient-to-r from-black/90 via-black/75 to-transparent px-6 py-14 sm:px-12 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gold">
            <Sparkle className="size-3.5" /> AI Business Assistant
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
            Welcome to <span className="text-gradient-gold">Simtha&apos;s Smart Buyers</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
            Your affordable destination for quality hair pieces, cellphones and mobile
            accessories. Powered by AI to help you serve customers faster, manage your business
            smarter, and grow your sales.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02]"
            >
              Write an email
            </Link>
            <Link
              to="/chat"
              className="rounded-xl border border-gold/50 px-5 py-3 text-sm font-semibold text-gold transition-colors hover:bg-accent"
            >
              Open AI chatbot
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-luxe">
            <p className="text-3xl font-semibold text-gold">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold sm:text-2xl">AI Tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-6 shadow-luxe transition-all hover:-translate-y-1 hover:border-gold/50"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-gold">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold group-hover:text-gold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {EXTRAS.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-gold/50"
            >
              <Icon className="size-5 shrink-0 text-gold" />
              <span>
                <span className="block text-sm font-medium">{title}</span>
                <span className="block text-xs text-muted-foreground">{text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold sm:text-2xl">Our Product Categories</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {CATALOG.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-luxe">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
                {c.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {c.items.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-gold" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gold/45 bg-accent/40 p-6 shadow-gold sm:p-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-gold" />
          <h2 className="text-lg font-semibold text-gold">Responsible AI</h2>
        </div>
        <ul className="mt-4 grid gap-3 text-sm text-foreground/85 sm:grid-cols-2">
          <li>• Review AI-generated emails and replies before sending them to customers.</li>
          <li>• Always verify prices and stock availability before sharing them.</li>
          <li>• Protect customer privacy and confidential business information.</li>
          <li>• AI supports your decision-making — it does not replace human judgement.</li>
        </ul>
      </section>
    </div>
  );
}
