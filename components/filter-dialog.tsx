"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";

export type FilterOption = {
  value: string;
  label: string;
  swatch?: string;
};

export function FilterDialog({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs outline-none transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
      >
        {current?.swatch && (
          <span
            className="h-3 w-3 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: current.swatch }}
          />
        )}
        {current?.label ?? label}
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogTitle>{label}</DialogTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value || "any"}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  aria-pressed={active}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {option.swatch && (
                    <span
                      className="h-3 w-3 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: option.swatch }}
                    />
                  )}
                  {option.label}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
