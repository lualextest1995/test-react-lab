import { forwardRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";
import type { Formatters, Matcher } from "react-day-picker";

type LabelPosition = "inline" | "top" | "left" | "none";

export type DateShortcut = {
  label: string;
  date: Date;
};

type DatePickerValue = Date | string;

type DatePickerProps = {
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  value?: DatePickerValue;
  onChange?: (date: string | undefined) => void;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
  name?: string;
  shortcuts?: DateShortcut[];
};

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      label,
      labelPosition = "top",
      placeholder = "選擇日期",
      value,
      onChange,
      className,
      disabled,
      disabledDates,
      shortcuts,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    const normalizeDate = (input: DatePickerValue | undefined) => {
      if (!input) return undefined;
      if (input instanceof Date) return input;
      const parsed = parseISO(input);
      return isValid(parsed) ? parsed : undefined;
    };

    const handleSelect = (date: Date | undefined) => {
      const formatted = date ? format(date, "yyyy-MM-dd") : undefined;
      onChange?.(formatted);
      setOpen(false);
    };

    const handleShortcutClick = (date: Date) => {
      onChange?.(format(date, "yyyy-MM-dd"));
      setOpen(false);
    };

    const displayValue =
      value && (typeof value === "string" || value instanceof Date)
        ? typeof value === "string"
          ? value
          : format(value, "yyyy-MM-dd")
        : undefined;

    const selectedDate = normalizeDate(value);

    const calendarFormatters: Partial<Formatters> = {
      formatMonthDropdown: (date, dateLib) => {
        if (dateLib) {
          return dateLib.format(date, "LLL");
        }
        return format(date, "LLL", { locale: zhTW });
      },
    };

    const triggerButton = (
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{displayValue ?? placeholder}</span>
        </Button>
      </PopoverTrigger>
    );

    const datepickerElement = (
      <Popover open={open} onOpenChange={setOpen}>
        {triggerButton}
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {shortcuts && shortcuts.length > 0 && (
              <div className="border-r py-2 pr-2 space-y-0.5 flex flex-col">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 whitespace-nowrap">
                  快速選擇
                </div>
                <div className="flex flex-col gap-0.5">
                  {shortcuts.map((shortcut: DateShortcut, index: number) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start font-normal text-xs px-2 py-1.5 h-auto whitespace-nowrap"
                      onClick={() => handleShortcutClick(shortcut.date)}
                    >
                      {shortcut.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              defaultMonth={selectedDate}
              locale={zhTW}
              formatters={calendarFormatters}
              disabled={disabledDates}
            />
          </div>
        </PopoverContent>
      </Popover>
    );

    if (!label || labelPosition === "none") {
      return <div className="w-full">{datepickerElement}</div>;
    }

    if (labelPosition === "inline") {
      return (
        <div className="w-full">
          <div className="group relative">
            <label className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-[:disabled]:opacity-50">
              {label}
            </label>
            {datepickerElement}
          </div>
        </div>
      );
    }

    if (labelPosition === "left") {
      return (
        <div className="w-full flex items-center gap-3">
          <Label className="flex-[2] justify-end">{label}</Label>
          <div className="flex-[7]">{datepickerElement}</div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-2">
        <Label>{label}</Label>
        {datepickerElement}
      </div>
    );
  }
);

export default DatePicker;
