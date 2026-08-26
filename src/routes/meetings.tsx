import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, Wand2, Eraser } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiResult";
import { Field, FormCard, TextArea } from "@/components/FormBits";
import { useGenerate } from "@/lib/useGenerate";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Simtha's Smart Buyers" },
      {
        name: "description",
        content:
          "Paste staff, supplier or sales meeting notes and get a summary, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Simtha's Smart Buyers" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into clear decisions and action items.",
      },
    ],
  }),
  component: MeetingsPage,
});

type ActionItem = { task: string; owner: string; deadline: string };

const EXAMPLE = `Staff meeting - Monday
New Brazilian wig stock arriving Thursday from supplier in Durban.
Samsung A36 units running low, only 3 left.
Weekend promo idea: R100 off all closures.
Two customer complaints about late delivery last week.
Monthly sales target R45 000, currently at R28 000.`;

function MeetingsPage() {
  const { text, setText, loading, run, clear } = useGenerate("meetings");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ActionItem[]>([]);

  async function summarize() {
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes first.");
      return;
    }
    setItems([]);
    const raw = await run(
      `Summarize these meeting notes for the business owner.

NOTES:
${notes}

Output in this exact structure using markdown headings:
## Meeting Summary
## Key Discussion Points
## Decisions Made
## Follow-Up Tasks

Then, on the very last line, output only a JSON array of action items in this shape (no code fences):
ACTION_ITEMS: [{"task":"...","owner":"...","deadline":"..."}]`,
    );
    if (!raw) return;
    const match = raw.match(/ACTION_ITEMS:\s*(\[[\s\S]*\])/);
    if (match) {
      try {
        setItems(JSON.parse(match[1]) as ActionItem[]);
      } catch {
        /* ignore malformed JSON */
      }
      setText(raw.replace(/ACTION_ITEMS:[\s\S]*$/, "").trim());
    }
  }

  return (
    <div>
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste notes from staff meetings, supplier meetings or sales planning sessions and get a clean summary with decisions, owners and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FormCard>
          <Field label="Meeting Notes">
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting notes here…"
              className="min-h-72"
            />
          </Field>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={summarize}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <Wand2 className="size-4" /> Summarize Meeting
            </button>
            <button
              onClick={() => setNotes(EXAMPLE)}
              className="rounded-xl border border-gold/40 px-5 py-2.5 text-sm text-gold hover:bg-accent"
            >
              Use example notes
            </button>
            <button
              onClick={() => {
                setNotes("");
                setItems([]);
                clear();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Eraser className="size-4" /> Clear
            </button>
          </div>
        </FormCard>

        <AiOutput text={text} loading={loading} empty="Your meeting summary will appear here." />
      </div>

      {items.length > 0 && (
        <div className="surface-luxe mt-6 overflow-hidden rounded-2xl">
          <h3 className="border-b border-border px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            Action Items
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Task</th>
                  <th className="px-5 py-3">Responsible Person</th>
                  <th className="px-5 py-3">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-5 py-3">{it.task}</td>
                    <td className="px-5 py-3 text-gold">{it.owner}</td>
                    <td className="px-5 py-3 text-muted-foreground">{it.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
