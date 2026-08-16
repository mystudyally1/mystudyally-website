"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CHAT_NODES, CHAT_OPENING, CHAT_STARTERS, type ChatNode } from "@/data/chat";
import { CONTACT_WHATSAPP_LINK } from "@/lib/constants";

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

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-pill bg-primary text-white shadow-press transition hover:bg-primary-hover active:translate-y-1 active:shadow-none"
      >
        {open ? (
          <span className="text-xl">✕</span>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat assistant"
          className="fixed bottom-24 right-5 z-[100] flex max-h-[min(560px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border-2 border-border bg-white shadow-panel"
        >
          <div className="flex items-center justify-between border-b-2 border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-extrabold text-white">
                M
              </span>
              <div>
                <div className="text-sm font-extrabold text-ink">MyStudyAlly</div>
                <div className="text-xs text-muted">Answers common questions</div>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-bold text-muted hover:text-ink"
            >
              Restart
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-2">
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.from === "bot"
                        ? "self-start bg-surface-alt text-ink"
                        : "self-end bg-link text-white",
                    )}
                  >
                    {m.text}
                  </div>
                  {m.node?.link && (
                    <Link
                      href={m.node.link.href}
                      onClick={() => setOpen(false)}
                      className="self-start border-b-2 border-primary pb-0.5 text-xs font-bold text-ink"
                    >
                      {m.node.link.label} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-border px-4 py-3">
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((id) => {
                  const node = CHAT_NODES[id];
                  if (!node) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => pick(id)}
                      className="rounded-pill border-2 border-border bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-link-light-3 hover:bg-link-light hover:text-link-hover"
                    >
                      {node.question}
                    </button>
                  );
                })}
              </div>
            )}

            {(lastNode?.actions?.length || chips.length === 0) && (
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/contact/"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-primary px-4 py-2.5 text-center text-sm font-extrabold text-white shadow-press hover:bg-primary-hover active:translate-y-1 active:shadow-none"
                >
                  Submit an inquiry
                </Link>
                <a
                  href={CONTACT_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener"
                  className="rounded-md border-2 border-border px-4 py-2 text-center text-sm font-bold text-ink hover:border-ink"
                >
                  Message us on WhatsApp
                </a>
                {chips.length === 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs font-bold text-muted hover:text-ink"
                  >
                    ← Back to all questions
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
