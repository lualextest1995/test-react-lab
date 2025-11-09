import { forwardRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";
import type { DateRange, Formatters, Matcher } from "react-day-picker";

type LabelPosition = "inline" | "top" | "left" | "none";

export type DateRangeShortcut = {
  label: string;
  range: DateRange;
};

export type DateRangeValue = [Date | string | undefined, Date | string | undefined];

type DateRangePickerProps = {
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue | undefined) => void;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
  name?: string;
  shortcuts?: DateRangeShortcut[];
};

const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      label,
      labelPosition = "top",
      placeholder = "選擇日期區間",
      value,
      onChange,
      className,
      disabled,
      disabledDates,
      shortcuts,
      ...props
    },
    ref
  )=> {
    const [open, setOpen] = useState(false);

    const normalizeDate = (input: Date | string | undefined) => {
      if (!input) return undefined;
      if (input instanceof Date) return input;
      const parsed = parseISO(input);
      return isValid(parsed) ? parsed : undefined;
    };

    const normalizeRange = (range: DateRangeValue | undefined): DateRange | undefined => {
      if (!range) return undefined;
      const from = normalizeDate(range[0]);
      const to = normalizeDate(range[1]);
      if (!from && !to) return undefined;
      return { from, to };
    };

    const formatDateValue = (date: Date | string | undefined) => {
      if (!date) return undefined;
      if (date instanceof Date) {
        return format(date, "yyyy-MM-dd");
      }
      return date;
    };

    const handleSelect = (range: DateRange | undefined) => {
      if (!range) {
        onChange?.(undefined);
        return;
      }

      const fromFormatted = range.from ? format(range.from, "yyyy-MM-dd") : undefined;
      const toFormatted = range.to ? format(range.to, "yyyy-MM-dd") : undefined;

      onChange?.([fromFormatted, toFormatted] as DateRangeValue);
    };

    const handleShortcutClick = (range: DateRange) => {
      const fromFormatted = range.from ? format(range.from, "yyyy-MM-dd") : undefined;
      const toFormatted = range.to ? format(range.to, "yyyy-MM-dd") : undefined;

      onChange?.([fromFormatted, toFormatted] as DateRangeValue);
      setOpen(false);
    };

    const handleConfirm = () => {
      setOpen(false);
    };

    const formatDateRange = (range: DateRangeValue | undefined) => {
      const fromFormatted = formatDateValue(range?.[0]);
      if (!fromFormatted) return placeholder;

      if (!range?.[1]) return fromFormatted;
      const toFormatted = formatDateValue(range[1]);
      if (!toFormatted) return fromFormatted;

      return `${fromFormatted} - ${toFormatted}`;
    };

    const selectedRange = normalizeRange(value);

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
            !(value?.[0]) && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{formatDateRange(value)}</span>
        </Button>
      </PopoverTrigger>
    );

    const dateRangePickerElement = (
      <Popover open={open} onOpenChange={setOpen}>
        {triggerButton}
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col">
            <div className="flex">
              {shortcuts && shortcuts.length > 0 && (
                <div className="border-r py-2 pr-2 space-y-0.5 flex flex-col">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1 whitespace-nowrap">
                    快速選擇
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {shortcuts.map((shortcut: DateRangeShortcut, index: number) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="justify-start font-normal text-xs px-2 py-1.5 h-auto whitespace-nowrap"
                        onClick={() => handleShortcutClick(shortcut.range)}
                      >
                        {shortcut.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                defaultMonth={selectedRange?.from ?? selectedRange?.to}
                locale={zhTW}
                formatters={calendarFormatters}
                disabled={disabledDates}
              />
            </div>
            <div className="border-t px-3 py-2 flex justify-end">
              <Button size="sm" onClick={handleConfirm} disabled={!value?.[0] || !value?.[1]}>
                確認
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );

    if (!label || labelPosition === "none") {
      return <div className="w-full">{dateRangePickerElement}</div>;
    }

    if (labelPosition === "inline") {
      return (
        <div className="w-full">
          <div className="group relative">
            <label className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-[:disabled]:opacity-50">
              {label}
            </label>
            {dateRangePickerElement}
          </div>
        </div>
      );
    }

    if (labelPosition === "left") {
      return (
        <div className="w-full flex items-center gap-3">
          <Label className="flex-[2] justify-end">{label}</Label>
          <div className="flex-[7]">{dateRangePickerElement}</div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-2">
        <Label>{label}</Label>
        {dateRangePickerElement}
      </div>
    );
  }
);

export default DateRangePicker;
