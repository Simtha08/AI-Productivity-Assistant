import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Wand2, Eraser } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AiOutput } from "@/components/AiResult";
import { Field, FormCard, SelectInput, TextArea, TextInput } from "@/components/FormBits";
import { useGenerate } from "@/lib/useGenerate";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "Marketing & Promotions | Simtha's Smart Buyers" },
      {
        name: "description",
        content:
          "Generate WhatsApp, Facebook, Instagram and TikTok captions, sale posts and hashtags for hair pieces and cellphones.",
      },
      { property: "og:title", content: "Marketing & Promotions | Simtha's Smart Buyers" },
      {
        property: "og:description",
        content: "AI-generated social media posts and promotions for your business.",
      },
    ],
  }),
  component: MarketingPage,
});

const PLATFORMS = ["WhatsApp Status", "Facebook", "Instagram", "TikTok"] as const;
const PROMO_TYPES = ["Sale / Discount", "New Stock Arrival", "Customer Testimonial", "Flash Deal", "Weekend Special"] as const;
const TONES = ["Friendly", "Hype", "Professional", "Simple"] as const;

function MarketingPage() {
  const { text, setText, loading, run, clear } = useGenerate("promotions");
  const [form, setForm] = useState({
    platform: PLATFORMS[0] as string,
    promoType: PROMO_TYPES[0] as string,
    product: "",
    offer: "",
    tone: TONES[0] as string,
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function generate() {
    if (!form.product.trim() || !form.offer.trim()) {
      toast.error("Please add the product and the offer details.");
      return;
    }
    run(
      `Write a ${form.promoType} post for ${form.platform}.
Product: ${form.product}
Offer: ${form.offer}
Tone: ${form.tone}

Include an eye-catching opening, a short description, the price or deal if relevant, a call to action, and relevant hashtags. Keep it suitable for a South African audience shopping for hair pieces and cellphones.`,
    );
  }

  return (
    <div>
      <PageHeader
        icon={Megaphone}
        title="Marketing & Promotions"
        description="Create WhatsApp, Facebook, Instagram and TikTok captions and sale posts that drive interest in your hair pieces and cellphones."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FormCard>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Platform">
              <SelectInput options={PLATFORMS} value={form.platform} onChange={set("platform")} />
            </Field>
            <Field label="Promotion Type">
              <SelectInput options={PROMO_TYPES} value={form.promoType} onChange={set("promoType")} />
            </Field>
          </div>
          <Field label="Product">
            <TextInput
              value={form.product}
              onChange={set("product")}
              placeholder="e.g. Brazilian body wave wig"
            />
          </Field>
          <Field label="Offer / Deal">
            <TextInput
              value={form.offer}
              onChange={set("offer")}
              placeholder="e.g. R200 off this weekend only"
            />
          </Field>
          <Field label="Tone">
            <SelectInput options={TONES} value={form.tone} onChange={set("tone")} />
          </Field>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              <Wand2 className="size-4" /> Generate Post
            </button>
            <button
              onClick={() => {
                setForm({
                  platform: PLATFORMS[0],
                  promoType: PROMO_TYPES[0],
                  product: "",
                  offer: "",
                  tone: TONES[0],
                });
                clear();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Eraser className="size-4" /> Clear
            </button>
          </div>
        </FormCard>

        <AiOutput text={text} loading={loading} empty="Your social media post will appear here." />
      </div>
    </div>
  );
}
