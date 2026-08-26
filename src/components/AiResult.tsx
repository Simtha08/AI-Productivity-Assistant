import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Copied to clipboard");
          setTimeout(() => setCopied(false), 1600);
        } catch {
          toast.error("Could not copy — please select and copy manually.");
        }
      }}
      className="border-gold/40 text-gold hover:bg-accent hover:text-gold"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {label}
    </Button>
  );
}

export function GoldLoader({ label = "AI is working…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-14">
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
        <span className="absolute inset-0 rounded-full border-2 border-gold/25" />
        <Loader2 className="size-6 animate-spin text-gold" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function AiOutput({
  text,
  loading,
  empty = "Your AI result will appear here.",
  actions,
}: {
  text: string;
  loading: boolean;
  empty?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="surface-luxe rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">AI Result</h3>
        <div className="flex flex-wrap gap-2">
          {actions}
          <CopyButton text={text} />
        </div>
      </div>
      {loading ? (
        <GoldLoader />
      ) : text ? (
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground/90">
          {text}
        </pre>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}
