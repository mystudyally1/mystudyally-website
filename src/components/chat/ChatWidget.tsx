"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CHAT_NODES, CHAT_OPENING, CHAT_STARTERS, type ChatNode } from "@/data/chat";
import { CONTACT_WHATSAPP_LINK } from "@/lib/constants";

// Styling mirrors "website design/ChatWidget.dc.html".
interface Message {
  id: number;
  from: "bot" | "visitor";
  text: string;
  node?: ChatNode;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: CHAT_OPENING },
  ]);
  const [chips, setChips] = useState<string[]>(CHAT_STARTERS);
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chips]);

  function pick(id: string) {
    const node = CHAT_NODES[id];
    if (!node) return;
    setMessages((m) => [
      ...m,
      { id: nextId.current++, from: "visitor", text: node.question },
      { id: nextId.current++, from: "bot", text: node.answer, node },
    ]);
    setChips(node.followUps ?? []);
  }

  function reset() {
    setMessages([{ id: nextId.current++, from: "bot", text: CHAT_OPENING }]);
    setChips(CHAT_STARTERS);
  }

  const lastNode = [...messages].reverse().find((m) => m.node)?.node;
  const showActions = Boolean(lastNode?.actions?.length) || chips.length === 0;

  return (
    <div className="fixed bottom-0 right-0 z-[900] font-sans text-ink">
      {open ? (
        <div
          role="dialog"
          aria-label="Chat assistant"
          className="fixed bottom-[24px] right-[24px] flex h-[min(560px,calc(100vh-48px))] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_18px_48px_rgba(19,31,36,0.18)]"
        >
          <div className="flex h-[56px] shrink-0 items-center gap-[10px] bg-surface-dark px-[14px] text-white">
            <span className="inline-flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-primary text-14 font-extrabold text-white">
              M
            </span>
            <div className="flex-1">
              <div className="text-14 font-bold leading-[18px]">MyStudyAlly</div>
              <div className="text-11 text-white/70">Answers common questions</div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-[8px] px-[8px] py-[4px] text-11 font-bold text-white/80 hover:text-white"
            >
              Restart
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-[32px] w-[32px] shrink-0 cursor-pointer rounded-[8px] bg-transparent text-15 font-bold text-white"
            >
              ✕
            </button>
          </div>

          <div ref={listRef} className="flex flex-1 flex-col gap-[8px] overflow-y-auto bg-white px-[14px] py-[16px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-[4px]",
                  m.from === "visitor" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap rounded-[18px] px-[14px] py-[10px] text-14 leading-[22px]",
                    m.from === "visitor" ? "bg-ink text-white" : "bg-[#F7F6F2] text-ink",
                  )}
                >
                  {m.text}
                </div>
                {m.node?.link && (
                  <Link
                    href={m.node.link.href}
                    onClick={() => setOpen(false)}
                    className="self-start border-b-2 border-primary pb-[2px] text-12 font-bold text-ink"
                  >
                    {m.node.link.label} →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[10px] border-t border-border bg-white px-[14px] py-[12px]">
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-[8px]">
                {chips.map((id) => {
                  const node = CHAT_NODES[id];
                  if (!node) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => pick(id)}
                      className="cursor-pointer rounded-pill border border-border bg-white px-[14px] py-[8px] text-13 font-semibold text-ink hover:bg-surface-alt"
                    >
                      {node.question}
                    </button>
                  );
                })}
              </div>
            )}

            {showActions && (
              <div className="flex flex-col gap-[10px]">
                <Link
                  href="/contact/"
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] rounded-[8px] bg-primary px-[12px] py-[11px] text-center text-14 font-bold text-white hover:bg-primary-hover hover:text-white"
                >
                  Submit an inquiry
                </Link>
                <a
                  href={CONTACT_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener"
                  className="min-h-[44px] rounded-[8px] border border-border px-[12px] py-[11px] text-center text-14 font-bold text-ink hover:bg-surface-alt"
                >
                  Message us on WhatsApp
                </a>
                {chips.length === 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="cursor-pointer text-12 font-bold text-muted hover:text-ink"
                  >
                    ← Back to all questions
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-[24px] right-[24px] inline-flex h-[56px] w-[56px] cursor-pointer items-center justify-center rounded-pill bg-primary text-20 font-extrabold text-white shadow-[0_8px_24px_rgba(19,31,36,0.18)]"
        >
          M
        </button>
      )}
    </div>
  );
}
