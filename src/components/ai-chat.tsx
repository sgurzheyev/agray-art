"use client";

import { FormEvent, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [demo, setDemo] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Здравствуйте. Я консультант A.GRAY. Могу подсказать по размеру, металлу, пробе и наличию в каталоге. Что подбираем?",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json()) as { reply?: string; demo?: boolean; error?: string };
      if (data.demo) setDemo(true);
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Сейчас не могу ответить. Напишите в ателье.",
        },
      ]);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Связь прервалась. Попробуйте ещё раз." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 border border-gold bg-ink px-4 py-3 text-[11px] tracking-[0.18em] text-gold uppercase shadow-[0_0_40px_rgba(201,169,98,0.12)] hover:bg-gold hover:text-ink sm:right-6 sm:bottom-6"
      >
        <MessageCircle className="size-4" strokeWidth={1.5} />
        Спросить A.GRAY
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex h-[min(34rem,88dvh)] flex-col border-t border-gold/30 bg-ink sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[36rem] sm:w-[24rem] sm:border">
          <div className="flex items-center justify-between border-b border-gold/20 px-4 py-3">
            <div>
              <p className="font-serif text-lg text-gold">A.GRAY</p>
              <p className="text-[10px] tracking-[0.2em] text-muted uppercase">
                Консультант{demo ? " · демо" : ""}
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть" className="p-1 text-ivory">
              <X className="size-5" />
            </button>
          </div>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={
                  m.role === "user"
                    ? "ml-8 border border-gold/20 bg-gold/10 px-3 py-2 text-sm text-ivory"
                    : "mr-8 border border-gold/15 px-3 py-2 text-sm text-ivory/90"
                }
              >
                {m.content}
              </div>
            ))}
            {pending && <p className="text-xs tracking-widest text-muted uppercase">Печатает…</p>}
          </div>
          <form onSubmit={onSubmit} className="flex gap-2 border-t border-gold/20 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Размер, металл, повод…"
              className="flex-1 bg-transparent px-2 py-2 text-sm text-ivory outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={pending}
              className="bg-gold p-2 text-ink disabled:opacity-50"
              aria-label="Отправить"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
