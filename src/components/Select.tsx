import type { ComponentProps } from "react";
import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select as DefaultSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Option = {
  isGroup?: boolean;
  value: string;
  label: string;
  children?: Option[];
  disabled?: boolean;
};

type LabelPosition = "inline" | "top" | "left" | "none";

type SelectProps = Omit<ComponentProps<typeof DefaultSelect>, "onValueChange"> & {
  options: Option[];
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function Select({
  options,
  label,
  labelPosition = "top",
  placeholder,
  onChange,
  className,
  ...props
}: SelectProps) {
  const id = useId();

  const renderOptions = () => (
    <>
      {options.map((option) =>
        option.isGroup ? (
          <SelectGroup key={option.label}>
            <SelectLabel>{option.label}</SelectLabel>
            {option.children?.map((child) => (
              <SelectItem
                key={child.value}
                value={child.value}
                disabled={child.disabled}
              >
                {child.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        )
      )}
    </>
  );

  const selectElement = (
    <DefaultSelect {...props} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className={cn("dark:!bg-background w-full", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{renderOptions()}</SelectContent>
    </DefaultSelect>
  );

  if (!label || labelPosition === "none") {
    return <div className="w-full">{selectElement}</div>;
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
        {selectElement}
      </div>
    );
  }

  if (labelPosition === "left") {
    return (
      <div className="w-full flex items-center gap-3">
        <Label htmlFor={id} className="flex-[2] justify-end">
          {label}
        </Label>
        <div className="flex-[7]">{selectElement}</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {selectElement}
    </div>
  );
}
