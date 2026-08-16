"use client";

import dynamic from "next/dynamic";

// Deferred island — the widget never blocks first paint.
const ChatWidget = dynamic(
  () => import("@/components/chat/ChatWidget").then((m) => m.ChatWidget),
  { ssr: false },
);

export function ChatWidgetLazy() {
  return <ChatWidget />;
}
