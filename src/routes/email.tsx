import { createFileRoute } from "@tanstack/react-router";
import { Mail, RefreshCw, Eraser, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiResult";
import { Field, FormCard, SelectInput, TextArea, TextInput } from "@/components/FormBits";
import { useGenerate } from "@/lib/useGenerate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Simtha's Smart Buyers" },
      {
        name: "description",
        content:
          "Generate professional customer, supplier and team emails for hair pieces and cellphone orders in seconds.",
      },
      { property: "og:title", content: "Smart Email Generator | Simtha's Smart Buyers" },
      {
        property: "og:description",
        content: "AI-written order confirmations, delivery updates, reminders and promotions.",
      },
    ],
  }),
  component: EmailPage,
});

const EMAIL_TYPES = [
  "Customer Order Confirmation",
  "Delivery Update",
  "Payment Reminder",
  "Promotional Sale Announcement",
  "Supplier Stock Request",
  "Customer Follow-Up",
  "Thank You Email",
] as const;
const RECIPIENT_TYPES = ["Customer", "Supplier", "Manager", "Team Member"] as const;
const TONES = ["Professional", "Friendly", "Promotional", "Apology"] as const;
const CATEGORIES = ["Hair Pieces", "Cellphones", "Accessories", "Mixed Order"] as const;

function EmailPage() {
  const { text, loading, run, clear } = useGenerate("emails");
  const [form, setForm] = useState({
    emailType: EMAIL_TYPES[0] as string,
    name: "",
    recipientType: RECIPIENT_TYPES[0] as string,
    purpose: "",
    tone: TONES[0] as string,
    category: CATEGORIES[0] as string,
    details: "",
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function generate() {
    if (!form.name.trim() || !form.purpose.trim()) {
      toast.error("Please add the recipient name and the purpose of the email.");
      return;
    }
    run(
      `Write a ${form.emailType} email.
Recipient name: ${form.name}
Recipient type: ${form.recipientType}
Purpose: ${form.purpose}
Tone: ${form.tone}
Product category: ${form.category}
Key details: ${form.details || "none provided"}

Format the output exactly as:
Subject: <subject line>

<greeting>

<email body, 2-4 short paragraphs>

<closing signature ending with "Simtha's Smart Buyers Team">`,
    );
  }

  return (
    <div>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Create polished business emails for customers, suppliers and your team — order confirmations, delivery updates, payment reminders, promotions and more."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FormCard>
          <Field label="Email Type">
            <SelectInput options={EMAIL_TYPES} value={form.emailType} onChange={set("emailType")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recipient Name">
              <TextInput value={form.name} onChange={set("name")} placeholder="e.g. Thandi Mokoena" />
            </Field>
            <Field label="Recipient Type">
              <SelectInput
                options={RECIPIENT_TYPES}
                value={form.recipientType}
                onChange={set("recipientType")}
              />
            </Field>
          </div>
          <Field label="Purpose">
            <TextInput
              value={form.purpose}
              onChange={set("purpose")}
              placeholder="e.g. Confirm her Brazilian body wave wig order"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tone">
              <SelectInput options={TONES} value={form.tone} onChange={set("tone")} />
            </Field>
            <Field label="Product Category">
              <SelectInput options={CATEGORIES} value={form.category} onChange={set("category")} />
            </Field>
          </div>
          <Field label="Key Details">
            <TextArea
              value={form.details}
              onChange={set("details")}
              placeholder="Order number, price, delivery date, courier, payment method…"
            />
          </Field>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <Wand2 className="size-4" /> Generate Email
            </button>
            <button
              onClick={() => {
                setForm({
                  emailType: EMAIL_TYPES[0],
                  name: "",
                  recipientType: RECIPIENT_TYPES[0],
                  purpose: "",
                  tone: TONES[0],
                  category: CATEGORIES[0],
                  details: "",
                });
                clear();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Eraser className="size-4" /> Clear
            </button>
          </div>
        </FormCard>

        <AiOutput
          text={text}
          loading={loading}
          empty="Fill in the details and generate your email."
          actions={
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-3 py-1.5 text-sm text-gold hover:bg-accent disabled:opacity-60"
            >
              <RefreshCw className="size-4" /> Regenerate
            </button>
          }
        />
      </div>
    </div>
  );
}
