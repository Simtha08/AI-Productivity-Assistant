import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Wand2, Eraser } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiResult";
import { Field, FormCard, SelectInput, TextInput, TextArea } from "@/components/FormBits";
import { useGenerate } from "@/lib/useGenerate";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Assistant | Simtha's Smart Buyers" },
      {
        name: "description",
        content:
          "Track hair pieces, wigs, cellphones and accessories. Get low-stock alerts and restock recommendations.",
      },
      { property: "og:title", content: "Inventory Assistant | Simtha's Smart Buyers" },
      {
        property: "og:description",
        content: "AI restock advice and low-stock alerts for your shop.",
      },
    ],
  }),
  component: InventoryPage,
});

const CATEGORIES = ["Hair Pieces", "Cellphones", "Accessories"] as const;

function InventoryPage() {
  const { text, setText, loading, run, clear } = useGenerate("inventory");
  const [form, setForm] = useState({
    product: "",
    category: CATEGORIES[0] as string,
    currentStock: "",
    notes: "",
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function generate() {
    if (!form.product.trim()) {
      toast.error("Please enter a product name.");
      return;
    }
    run(
      `Act as an inventory assistant for a South African retail business selling hair pieces and cellphones.
Product: ${form.product}
Category: ${form.category}
Current stock level: ${form.currentStock || "not provided"}
Notes: ${form.notes || "none"}

Provide:
1. A quick stock status verdict (healthy / low / out of stock)
2. A recommended reorder quantity
3. A short restock message the owner can send to the supplier on WhatsApp
4. A short customer-facing message if the item is low or out of stock`,
    );
  }

  return (
    <div>
      <PageHeader
        icon={Boxes}
        title="Inventory Assistant"
        description="Check stock levels, get reorder suggestions and draft supplier or customer messages in seconds."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FormCard>
          <Field label="Product Name">
            <TextInput
              value={form.product}
              onChange={set("product")}
              placeholder="e.g. Brazilian straight wig 16 inch"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <SelectInput options={CATEGORIES} value={form.category} onChange={set("category")} />
            </Field>
            <Field label="Current Stock Level">
              <TextInput
                value={form.currentStock}
                onChange={set("currentStock")}
                placeholder="e.g. 3 left"
              />
            </Field>
          </div>
          <Field label="Extra Notes">
            <TextArea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Supplier, expected delivery, popular sizes, etc."
            />
          </Field>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <Wand2 className="size-4" /> Check Inventory
            </button>
            <button
              onClick={() => {
                setForm({ product: "", category: CATEGORIES[0], currentStock: "", notes: "" });
                clear();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Eraser className="size-4" /> Clear
            </button>
          </div>
        </FormCard>

        <AiOutput text={text} loading={loading} empty="Your inventory advice will appear here." />
      </div>
    </div>
  );
}
