"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Option = {
  isGroup?: boolean;
  value: string;
  label: string;
  children?: Option[];
  disabled?: boolean;
};

type LabelPosition = "inline" | "top" | "left" | "none";

type ComboboxProps = {
  options: Option[];
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export default function Combobox({
  options,
  label,
  labelPosition = "top",
  placeholder,
  value,
  onChange,
  className,
  disabled,
}: ComboboxProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  const handleValueChange = (newValue: string) => {
    onChange?.(newValue);
    setOpen(false);
  };

  // Find the label for the selected value
  const selectedLabel = (() => {
    for (const option of options) {
      if (option.isGroup && option.children) {
        const child = option.children.find((child) => child.value === value);
        if (child) {
          return child.label;
        }
      } else if (option.value === value) {
        return option.label;
      }
    }
    return undefined;
  })();

  const comboboxElement = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
            className
          )}
        >
          {value ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{selectedLabel || value}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDownIcon
            size={16}
            className="text-muted-foreground/80 shrink-0"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={`Search ${label?.toLowerCase() || "item"}...`}
          />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            {options.map((option) =>
              option.isGroup && option.children ? (
                <CommandGroup key={option.value} heading={option.label}>
                  {option.children.map((child) => (
                    <CommandItem
                      key={child.value}
                      value={child.label}
                      disabled={child.disabled}
                      onSelect={() => handleValueChange(child.value)}
                    >
                      {child.label}
                      {value === child.value && (
                        <CheckIcon size={16} className="ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => handleValueChange(option.value)}
                >
                  {option.label}
                  {value === option.value && (
                    <CheckIcon size={16} className="ml-auto" />
                  )}
                </CommandItem>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  if (!label || labelPosition === "none") {
    return <div className="w-full">{comboboxElement}</div>;
  }

  if (labelPosition === "inline") {
    return (
      <div className="group relative w-full">
        <label
          htmlFor={id}
          className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-[:disabled]:opacity-50"
        >
          {label}
        </label>
        {comboboxElement}
      </div>
    );
  }

  if (labelPosition === "left") {
    return (
      <div className="w-full flex items-center gap-3">
        <Label htmlFor={id} className="flex-[2] justify-end">
          {label}
        </Label>
        <div className="flex-[7]">{comboboxElement}</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {comboboxElement}
    </div>
  );
}
