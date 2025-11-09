import { forwardRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";
import type { DateRange, Formatters, Matcher } from "react-day-picker";

type LabelPosition = "inline" | "top" | "left" | "none";

export type DateTimeRangeValue = [Date | string | undefined, Date | string | undefined];

export type DateTimeRangeShortcut = {
  label: string;
  range: {
    from?: Date;
    to?: Date;
  };
};

type DateTimeRangePickerProps = {
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  value?: DateTimeRangeValue;
  onChange?: (range: DateTimeRangeValue | undefined) => void;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
  name?: string;
  shortcuts?: DateTimeRangeShortcut[];
};

const DateTimeRangePicker = forwardRef<HTMLButtonElement, DateTimeRangePickerProps>(
  (
    {
      label,
      labelPosition = "top",
      placeholder = "選擇日期時間區間",
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

    const normalizeDateTime = (input: Date | string | undefined): Date | undefined => {
      if (!input) return undefined;
      if (input instanceof Date) return input;
      const parsed = parseISO(input);
      return isValid(parsed) ? parsed : undefined;
    };

    const normalizeRange = (range: DateTimeRangeValue | undefined): DateRange | undefined => {
      if (!range) return undefined;
      const from = normalizeDateTime(range[0]);
      const to = normalizeDateTime(range[1]);
      if (!from && !to) return undefined;
      return { from, to };
    };

    const selectedRange = normalizeRange(value);
    const [tempRange, setTempRange] = useState<DateRange | undefined>(selectedRange);
    const [fromTime, setFromTime] = useState(
      selectedRange?.from ? format(selectedRange.from, "HH:mm:ss") : "00:00:00"
    );
    const [toTime, setToTime] = useState(
      selectedRange?.to ? format(selectedRange.to, "HH:mm:ss") : "23:59:59"
    );

    const handleRangeSelect = (range: DateRange | undefined) => {
      setTempRange(range);
    };

    const handleFromTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFromTime(e.target.value);
    };

    const handleToTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setToTime(e.target.value);
    };

    const handleConfirm = () => {
      if (tempRange?.from) {
        const [fromHours, fromMinutes, fromSeconds] = fromTime.split(":");
        const fromDateTime = new Date(tempRange.from);
        fromDateTime.setHours(parseInt(fromHours), parseInt(fromMinutes), parseInt(fromSeconds || "0"), 0);
        const fromFormatted = format(fromDateTime, "yyyy-MM-dd HH:mm:ss");

        let toFormatted: string | undefined = undefined;
        if (tempRange.to) {
          const [toHours, toMinutes, toSeconds] = toTime.split(":");
          const toDateTime = new Date(tempRange.to);
          toDateTime.setHours(parseInt(toHours), parseInt(toMinutes), parseInt(toSeconds || "0"), 0);
          toFormatted = format(toDateTime, "yyyy-MM-dd HH:mm:ss");
        }

        onChange?.([fromFormatted, toFormatted] as DateTimeRangeValue);
      } else {
        onChange?.(undefined);
      }
      setOpen(false);
    };

    const handleShortcutClick = (range: { from?: Date; to?: Date }) => {
      const fromFormatted = range.from ? format(range.from, "yyyy-MM-dd HH:mm:ss") : undefined;
      const toFormatted = range.to ? format(range.to, "yyyy-MM-dd HH:mm:ss") : undefined;
      onChange?.([fromFormatted, toFormatted] as DateTimeRangeValue);
      setOpen(false);
    };

    const formatDateTimeValue = (dateTime: Date | string | undefined) => {
      if (!dateTime) return undefined;
      const normalized = normalizeDateTime(dateTime);
      if (!normalized) return undefined;
      return format(normalized, "yyyy-MM-dd HH:mm:ss");
    };

    const formatDateTimeRange = (range: DateTimeRangeValue | undefined) => {
      const fromFormatted = formatDateTimeValue(range?.[0]);
      if (!fromFormatted) return placeholder;

      if (!range?.[1]) return fromFormatted;
      const toFormatted = formatDateTimeValue(range[1]);
      if (!toFormatted) return fromFormatted;

      return `${fromFormatted} - ${toFormatted}`;
    };

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
          <span>{formatDateTimeRange(value)}</span>
        </Button>
      </PopoverTrigger>
    );

    const dateTimeRangePickerElement = (
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
                    {shortcuts.map((shortcut: DateTimeRangeShortcut, index: number) => (
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
              <div className="flex flex-col">
                <Calendar
                  mode="range"
                  selected={tempRange}
                  onSelect={handleRangeSelect}
                  numberOfMonths={2}
                  defaultMonth={tempRange?.from ?? tempRange?.to}
                  locale={zhTW}
                  formatters={calendarFormatters}
                  disabled={disabledDates}
                />
                <div className="px-3 py-2 border-t space-y-3">
                  <div>
                    <Label className="text-xs mb-2 block">開始時間 (HH:mm:ss)</Label>
                    <Input
                      type="time"
                      step="1"
                      value={fromTime}
                      onChange={handleFromTimeChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">結束時間 (HH:mm:ss)</Label>
                    <Input
                      type="time"
                      step="1"
                      value={toTime}
                      onChange={handleToTimeChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t px-3 py-2 flex justify-end">
              <Button size="sm" onClick={handleConfirm} disabled={!tempRange?.from || !tempRange?.to}>
                確認
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );

    if (!label || labelPosition === "none") {
      return <div className="w-full">{dateTimeRangePickerElement}</div>;
    }

    if (labelPosition === "inline") {
      return (
        <div className="w-full">
          <div className="group relative">
            <label className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-[:disabled]:opacity-50">
              {label}
            </label>
            {dateTimeRangePickerElement}
          </div>
        </div>
      );
    }

    if (labelPosition === "left") {
      return (
        <div className="w-full flex items-center gap-3">
          <Label className="flex-[2] justify-end">{label}</Label>
          <div className="flex-[7]">{dateTimeRangePickerElement}</div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-2">
        <Label>{label}</Label>
        {dateTimeRangePickerElement}
      </div>
    );
  }
);

export default DateTimeRangePicker;
