const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

export const BRAND_CONTEXT = `You are the AI business assistant for "Simtha's Smart Buyers", a South African business selling affordable hair pieces, wigs, weaves, braids, closures, frontals, hair extensions, cellphones and phone accessories. We are based in Cape Town.
Prices are in South African Rand (R). Tone: warm, professional, sales-friendly, South African context (EFT, cash, WhatsApp, nationwide courier delivery).
Hair pieces, wigs, weaves and braids range from R1500 to R3500. Cellphones start from R2000 and vary upward depending on the model and condition.
For exact stock, current prices and orders, customers can phone or WhatsApp 077 1235524.
Never invent exact stock levels or firm prices as facts — phrase them as examples the owner should verify.
Return clean plain text or markdown. Never wrap the whole answer in code fences.`;

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("Too many requests right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits are exhausted. Please top up your workspace.");
    throw new Error(`AI request failed [${res.status}]: ${body}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
