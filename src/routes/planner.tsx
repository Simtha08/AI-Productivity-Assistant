import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Wand2, Eraser } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiResult";
import { Field, FormCard, TextArea } from "@/components/FormBits";
import { useGenerate } from "@/lib/useGenerate";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Daily Business Planner | Simtha's Smart Buyers" },
      {
        name: "description",
        content:
          "Plan your day, prioritise tasks and turn business notes into a focused action plan for hair and cellphone sales.",
      },
      { property: "og:title", content: "Daily Business Planner | Simtha's Smart Buyers" },
      {
        property: "og:description",
        content: "AI-powered daily schedule and priority plan for your business.",
      },
    ],
  }),
  component: PlannerPage,
});

const EXAMPLE = `Reply to 3 WhatsApp orders
Post new wig stock on Instagram
Follow up with supplier about delayed delivery
Count Samsung A36 stock
Pack weekend orders`;

function PlannerPage() {
  const { text, setText, loading, run, clear } = useGenerate("planner");
  const [notes, setNotes] = useState("");

  function generate() {
    if (!notes.trim()) {
      toast.error("Please add your tasks or notes first.");
      return;
    }
    run(
      `You are a business planner for a South African hair-and-cellphone shop.
Turn the following tasks and notes into a clear daily plan with priorities, time blocks and quick wins.

Tasks / Notes:
${notes}

Format the output with markdown headings:
## Top Priorities
## Time-Blocked Schedule
## Quick Wins
## End-of-Day Checklist`,
    );
  }

  return (
    <div>
      <PageHeader
        icon={CalendarCheck}
        title="Daily Business Planner"
        description="Paste your tasks and notes to get a prioritised daily schedule with time blocks and quick wins."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FormCard>
          <Field label="Tasks & Notes">
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="List everything you need to do today…"
              className="min-h-72"
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <Wand2 className="size-4" /> Plan My Day
            </button>
            <button
              onClick={() => setNotes(EXAMPLE)}
              className="rounded-xl border border-gold/40 px-5 py-2.5 text-sm text-gold hover:bg-accent"
            >
              Use example tasks
            </button>
            <button
              onClick={() => {
                setNotes("");
                clear();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Eraser className="size-4" /> Clear
            </button>
          </div>
        </FormCard>

        <AiOutput text={text} loading={loading} empty="Your daily plan will appear here." />
      </div>
    </div>
  );
}
