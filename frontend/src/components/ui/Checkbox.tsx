"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function Checkbox({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>) {
  return (
    <RadixCheckbox.Root
      className={cn(
        "focus-ring flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-ink/20 bg-field data-[state=checked]:border-accent-500 data-[state=checked]:bg-accent-500",
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator>
        <Check className="h-3.5 w-3.5 text-accent-ink" strokeWidth={3} />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}
