"use client";

import { CheckIcon, ChevronDownIcon, X, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
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

type ComboboxMultipleProps = {
  options: Option[];
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  maxShownItems?: number;
  className?: string;
};

export default function ComboboxMultiple({
  options = [],
  label,
  labelPosition = "top",
  placeholder,
  value = [],
  onChange,
  disabled = false,
  maxShownItems = 2,
  className,
}: ComboboxMultipleProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const selectedValues = value;

  // Flatten options to handle groups
  const flattenedOptions: Option[] = [];
  options.forEach((option) => {
    if (option.isGroup && option.children) {
      flattenedOptions.push(...option.children);
    } else if (!option.isGroup) {
      flattenedOptions.push(option);
    }
  });

  const toggleSelection = (toggleValue: string) => {
    const newValues = selectedValues.includes(toggleValue)
      ? selectedValues.filter((v) => v !== toggleValue)
      : [...selectedValues, toggleValue];
    onChange?.(newValues);
  };

  const removeSelection = (removeValue: string) => {
    const newValues = selectedValues.filter((v) => v !== removeValue);
    onChange?.(newValues);
  };

  const clearAll = () => {
    onChange?.([]);
  };

  const visibleItems = expanded
    ? selectedValues
    : selectedValues.slice(0, maxShownItems);
  const hiddenCount = selectedValues.length - visibleItems.length;

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
            "h-auto min-h-8 w-full justify-between hover:bg-transparent",
            className
          )}
        >
            <div className="flex flex-wrap items-center gap-1 pe-2.5">
              {selectedValues.length > 0 ? (
                <>
                  {visibleItems.map((val) => {
                    const option = flattenedOptions.find(
                      (c) => c.value === val
                    );

                    return option ? (
                      <Badge key={val} variant="outline">
                        {option.label}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSelection(val);
                          }}
                          asChild
                        >
                          <span>
                            <XIcon className="size-3" />
                          </span>
                        </Button>
                      </Badge>
                    ) : null;
                  })}
                  {hiddenCount > 0 || expanded ? (
                    <Badge
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((prev) => !prev);
                      }}
                    >
                      {expanded ? "Show Less" : `+${hiddenCount} more`}
                    </Badge>
                  ) : null}
                </>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <span
              className={`flex items-center justify-center size-4 shrink-0 ${
                selectedValues.length > 0
                  ? "text-muted-foreground/80 hover:text-foreground cursor-pointer transition-colors"
                  : ""
              }`}
              onClick={(e) => {
                if (selectedValues.length === 0) {
                  return;
                }
                e.stopPropagation();
                clearAll();
              }}
            >
              {selectedValues.length > 0 ? (
                <X className="size-4 ml-2" />
              ) : (
                <ChevronDownIcon className="size-4 opacity-50 ml-2" />
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              {/* Render grouped options */}
              {options
                .filter((option) => option.isGroup)
                .map((option) => (
                  <CommandGroup key={option.label} heading={option.label}>
                    {option.children?.map((child) => (
                      <CommandItem
                        key={child.value}
                        value={child.label}
                        disabled={child.disabled}
                        onSelect={() =>
                          !child.disabled && toggleSelection(child.value)
                        }
                      >
                        <span className="truncate">{child.label}</span>
                        {selectedValues.includes(child.value) && (
                          <CheckIcon size={16} className="ml-auto" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              {/* Render non-grouped options */}
              {options.filter((option) => !option.isGroup).length > 0 && (
                <CommandGroup>
                  {options
                    .filter((option) => !option.isGroup)
                    .map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        disabled={option.disabled}
                        onSelect={() =>
                          !option.disabled && toggleSelection(option.value)
                        }
                      >
                        <span className="truncate">{option.label}</span>
                        {selectedValues.includes(option.value) && (
                          <CheckIcon size={16} className="ml-auto" />
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
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
