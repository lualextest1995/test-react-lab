import type { ComponentProps } from "react";
import { useId } from "react";
import { Input as DefaultInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LabelPosition = "inline" | "top" | "left" | "none";

type InputProps = ComponentProps<typeof DefaultInput> & {
  label?: string;
  labelPosition?: LabelPosition;
};

export default function Input({
  label,
  labelPosition = "top",
  placeholder,
  ...props
}: InputProps) {
  const id = useId();
  const inputElement = <DefaultInput id={id} placeholder={placeholder} {...props} />;

  if (!label || labelPosition === "none") {
    return <div className="w-full">{inputElement}</div>;
  }

  if (labelPosition === "inline") {
    return (
      <div className="w-full">
        <div className="group relative">
          <label
            htmlFor={id}
            className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-[:disabled]:opacity-50"
          >
            {label}
          </label>
          {inputElement}
        </div>
      </div>
    );
  }

  if (labelPosition === "left") {
    return (
      <div className="w-full flex items-center gap-3">
        <Label htmlFor={id} className="flex-[2] justify-end">
          {label}
        </Label>
        <div className="flex-[7]">{inputElement}</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {inputElement}
    </div>
  );
}
