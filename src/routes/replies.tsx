import { createFileRoute } from "@tanstack/react-router";
import { Zap, Wand2, Eraser } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiResult";
import { Field, FormCard, SelectInput, TextArea } from "@/components/FormBits";
import { useGenerate } from "@/lib/useGenerate";

export const Route = createFileRoute("/replies")({
  head: () => ({
    meta: [
      { title: "Quick Customer Replies | Simtha's Smart Buyers" },
      {
        name: "description",
        content:
          "Draft fast, friendly WhatsApp and message replies for customer questions about hair pieces, cellphones, delivery and orders.",
      },
      { property: "og:title", content: "Quick Customer Replies | Simtha's Smart Buyers" },
      {
        property: "og:description",
        content: "Instant customer message replies powered by AI.",
      },
    ],
  }),
  component: RepliesPage,
});

const TONES = ["Friendly", "Professional", "Warm & Salesy", "Apologetic", "Short"] as const;
const INTENTS = [
  "Price Question",
  "Stock Availability",
  "Delivery Time",
  "Payment Methods",
  "Order Follow-Up",
  "Complaint",
  "General Question",
] as const;

function RepliesPage() {
  const { text, setText, loading, run, clear } = useGenerate("replies");
  const [form, setForm] = useState({
    message: "",
    intent: INTENTS[0] as string,
    tone: TONES[0] as string,
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function generate() {
    if (!form.message.trim()) {
      toast.error("Please paste the customer message first.");
      return;
    }
    run(
      `You are the customer service assistant for Simtha's Smart Buyers, a South African shop selling hair pieces and cellphones. We are in Cape Town; phone/WhatsApp 077 1235524. Hair pieces range R1500-R3500 and cellphones start from R2000.

Draft a reply to this customer message.
Customer intent: ${form.intent}
Desired tone: ${form.tone}

Customer message:
"""
${form.message}
"""

Reply in a short, natural WhatsApp style. Be helpful and professional. If you don't have exact stock or price, guide the customer to contact 077 1235524 for current details.`,
    );
  }

  return (
    <div>
      <PageHeader
        icon={Zap}
        title="Quick Customer Replies"
        description="Paste a customer message and get a ready-to-send WhatsApp reply for prices, stock, delivery, payments and more."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FormCard>
          <Field label="Customer Message">
            <TextArea
              value={form.message}
              onChange={set("message")}
              placeholder="Paste the customer's WhatsApp or message here…"
              className="min-h-40"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Intent">
              <SelectInput options={INTENTS} value={form.intent} onChange={set("intent")} />
            </Field>
            <Field label="Tone">
              <SelectInput options={TONES} value={form.tone} onChange={set("tone")} />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <Wand2 className="size-4" /> Draft Reply
            </button>
            <button
              onClick={() => {
                setForm({ message: "", intent: INTENTS[0], tone: TONES[0] });
                clear();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Eraser className="size-4" /> Clear
            </button>
          </div>
        </FormCard>

        <AiOutput text={text} loading={loading} empty="Your reply will appear here." />
      </div>
    </div>
  );
}
