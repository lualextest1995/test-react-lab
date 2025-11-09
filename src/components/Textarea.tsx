import type { ComponentProps } from "react";
import { forwardRef, useId } from "react";
import { Textarea as DefaultTextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type LabelPosition = "inline" | "top" | "left" | "none";

type TextareaProps = ComponentProps<typeof DefaultTextarea> & {
  label?: string;
  labelPosition?: LabelPosition;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, labelPosition = "top", placeholder, ...props }, ref) =>{
    const id = useId();
    const textareaElement = (
      <DefaultTextarea id={id} placeholder={placeholder} ref={ref} {...props} />
    );

  if (!label || labelPosition === "none") {
    return <div className="w-full">{textareaElement}</div>;
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
          {textareaElement}
        </div>
      </div>
    );
  }

  if (labelPosition === "left") {
    return (
      <div className="w-full flex items-start gap-3">
        <Label htmlFor={id} className="flex-[2] justify-end pt-2">
          {label}
        </Label>
        <div className="flex-[7]">{textareaElement}</div>
      </div>
    );
  }

    return (
      <div className="w-full space-y-2">
        <Label htmlFor={id}>{label}</Label>
        {textareaElement}
      </div>
    );
  }
);

export default Textarea;
