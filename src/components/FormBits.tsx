import type { ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const base =
  "w-full rounded-xl border border-border bg-secondary/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/25";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${base} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${base} min-h-32 resize-y ${props.className ?? ""}`} />;
}

export function SelectInput({
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] }) {
  return (
    <select {...props} className={`${base} ${props.className ?? ""}`}>
      {options.map((o) => (
        <option key={o} value={o} className="bg-card">
          {o}
        </option>
      ))}
    </select>
  );
}

export function FormCard({ children }: { children: ReactNode }) {
  return <div className="surface-luxe space-y-4 rounded-2xl p-5 sm:p-6">{children}</div>;
}
