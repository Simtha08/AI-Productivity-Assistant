import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { generateContent } from "./ai.functions";
import { bumpStat, type StatKey } from "./stats";

export function useGenerate(statKey?: StatKey) {
  const generate = useServerFn(generateContent);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(instruction: string, extraSystem?: string) {
    setLoading(true);
    try {
      const res = await generate({ data: { instruction, extraSystem } });
      setText(res.text);
      if (statKey) bumpStat(statKey);
      toast.success("AI result ready");
      return res.text;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
      return "";
    } finally {
      setLoading(false);
    }
  }

  return { text, setText, loading, run, clear: () => setText("") };
}
