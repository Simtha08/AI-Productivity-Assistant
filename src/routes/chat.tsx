import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { MessagesSquare, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { CopyButton } from "@/components/AiResult";
import { chatWithAssistant } from "@/lib/ai.functions";
import { bumpStat } from "@/lib/stats";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Customer Chatbot | Simtha's Smart Buyers" },
      {
        name: "description",
        content:
          "Ask about wigs, Brazilian vs Peruvian hair, affordable cellphones, delivery, payments, stock and returns — answered instantly by AI.",
      },
      { property: "og:title", content: "AI Customer Chatbot | Simtha's Smart Buyers" },
      {
        property: "og:description",
        content: "Instant AI answers for hair piece and cellphone customers.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Which wig do you recommend for a first-time buyer?",
  "Brazilian vs Peruvian hair — what's the difference?",
  "Compare Samsung A36 and Redmi Note 14",
  "Do you deliver anywhere in South Africa?",
  "Write a TikTok caption for a weekend wig sale",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi! 👋 I'm the Simtha's Smart Buyers assistant. Ask me about wigs, closures, frontals, braids, affordable cellphones, delivery, payments — or ask me to write a WhatsApp or social media post for you.",
};

function ChatPage() {
  const send = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || typing) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setTyping(true);
    try {
      const res = await send({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: res.text }]);
      bumpStat("conversations");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The assistant is unavailable right now.");
      setMessages(next);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div>
      <PageHeader
        icon={MessagesSquare}
        title="AI Customer Chatbot"
        description="A ChatGPT-style assistant that knows your hair pieces, cellphones, accessories and customer service policies — and remembers the current conversation."
      />

      <div className="surface-luxe flex h-[65vh] min-h-[480px] flex-col rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-gold" /> Smart Buyers Assistant
          </span>
          <button
            onClick={() => setMessages([WELCOME])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-gold"
          >
            <Trash2 className="size-3.5" /> Clear chat
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-gold px-4 py-3 text-sm text-primary-foreground"
                    : "max-w-[85%] space-y-2"
                }
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                {m.role === "assistant" && i > 0 && <CopyButton text={m.content} />}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-1.5 text-gold">
              <span className="size-2 animate-bounce rounded-full bg-gold [animation-delay:-0.2s]" />
              <span className="size-2 animate-bounce rounded-full bg-gold [animation-delay:-0.1s]" />
              <span className="size-2 animate-bounce rounded-full bg-gold" />
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about wigs, phones, delivery, payments…"
              className="flex-1 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            <button
              type="submit"
              disabled={typing}
              className="rounded-xl bg-gold px-4 py-3 text-primary-foreground shadow-gold disabled:opacity-60"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
