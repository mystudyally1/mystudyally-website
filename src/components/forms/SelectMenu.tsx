"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

// A native <select> paints its own popup from the OS, so the open list ignores
// every token in the design — grey rows, system font, square corners. The
// subjects field on this same form already renders a styled listbox; this is
// that popup, made reusable, so both dropdowns on the page look like one
// component. Follows the APG select-only combobox pattern: focus never leaves
// the trigger, the active row is tracked with aria-activedescendant.

export interface SelectMenuProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  /** id of the visible <label>. A <button> takes its name from its contents,
   *  not from a wrapping label, so the field name has to be referenced. */
  labelledBy: string;
  /** Applied to the trigger, so callers keep using the form's input classes. */
  className?: string;
  invalid?: boolean;
  describedBy?: string;
}

export function SelectMenu({
  id,
  value,
  onChange,
  options,
  placeholder,
  labelledBy,
  className,
  invalid,
  describedBy,
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeahead = useRef({ buffer: "", at: 0 });

  // Opening on a value that is offscreen in a 220px-tall list would otherwise
  // show an arbitrary slice of the options with no sign of what is selected.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  useEffect(() => () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
  }, []);

  function openAt(index: number) {
    setActive(index < 0 ? 0 : index);
    setOpen(true);
  }

  function commit(index: number) {
    const next = options[index];
    if (next === undefined) return;
    onChange(next);
    setOpen(false);
  }

  function move(delta: number) {
    setActive((i) => Math.min(options.length - 1, Math.max(0, i + delta)));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const selected = options.indexOf(value);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (open) move(1);
        else openAt(selected);
        return;
      case "ArrowUp":
        e.preventDefault();
        if (open) move(-1);
        else openAt(selected);
        return;
      case "Home":
        if (!open) return;
        e.preventDefault();
        setActive(0);
        return;
      case "End":
        if (!open) return;
        e.preventDefault();
        setActive(options.length - 1);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) commit(active);
        else openAt(selected);
        return;
      case "Escape":
        if (!open) return;
        e.preventDefault();
        setOpen(false);
        return;
      case "Tab":
        setOpen(false);
        return;
    }

    // Type-ahead, as a native select does it: repeating one letter cycles
    // through the options starting with it, anything else extends the search.
    if (e.key.length !== 1 || e.altKey || e.ctrlKey || e.metaKey) return;
    const now = Date.now();
    const t = typeahead.current;
    t.buffer = now - t.at > 800 ? e.key : t.buffer + e.key;
    t.at = now;
    const query = (
      t.buffer.length > 1 && t.buffer.split("").every((c) => c === t.buffer[0])
        ? t.buffer[0]
        : t.buffer
    ).toLowerCase();
    const from = open ? active : selected;
    const start = t.buffer.length > 1 && query.length === 1 ? from + 1 : from;
    for (let i = 0; i < options.length; i += 1) {
      const index = (Math.max(0, start) + i) % options.length;
      if (options[index]!.toLowerCase().startsWith(query)) {
        e.preventDefault();
        if (open) setActive(index);
        else commit(index);
        return;
      }
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        // The APG select-only combobox: a plain button role carries neither
        // aria-activedescendant nor aria-invalid, so the field would announce
        // no active option and no error state.
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        aria-labelledby={`${labelledBy} ${id}`}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openAt(options.indexOf(value)))}
        onKeyDown={onKeyDown}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 150);
        }}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-[10px] text-left",
          className,
        )}
      >
        <span className={cn("truncate", !value && "text-muted-3")}>{value || placeholder}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn("shrink-0 text-muted-3 transition-transform", open && "rotate-180")}
        >
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-labelledby={labelledBy}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[220px] overflow-y-auto rounded-[14px] border border-border bg-white p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {options.map((o, i) => (
            <div
              key={o}
              id={`${id}-option-${i}`}
              role="option"
              aria-selected={o === value}
              data-active={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                // Before the trigger's blur, so the close timer never races us.
                e.preventDefault();
                if (blurTimer.current) clearTimeout(blurTimer.current);
                commit(i);
              }}
              className={cn(
                "cursor-pointer rounded-[10px] px-[12px] py-[9px] text-13 font-semibold text-body",
                i === active && "bg-surface-alt text-ink",
                o === value && "text-primary-shadow",
              )}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
