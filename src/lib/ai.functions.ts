import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BRAND_CONTEXT, callAI } from "./ai.server";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        instruction: z.string().min(1).max(8000),
        extraSystem: z.string().max(2000).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const text = await callAI([
      { role: "system", content: `${BRAND_CONTEXT}\n${data.extraSystem ?? ""}` },
      { role: "user", content: data.instruction },
    ]);
    return { text };
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ messages: z.array(messageSchema).min(1).max(40) }).parse(data),
  )
  .handler(async ({ data }) => {
    const text = await callAI([
      {
        role: "system",
        content: `${BRAND_CONTEXT}
You are the customer support chatbot. Help with wig and hair advice (Brazilian vs Peruvian, frontals vs closures, wig care), cellphone recommendations and comparisons (Samsung, Redmi, Tecno, Infinix, iPhone), delivery, payment methods (EFT, cash, card), stock availability, business hours, returns and exchanges, and drafting WhatsApp / Facebook / Instagram / TikTok content.
Keep answers concise, friendly and helpful. Use short paragraphs or bullets.`,
      },
      ...data.messages,
    ]);
    return { text };
  });
