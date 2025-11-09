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
import type { Formatters, Matcher } from "react-day-picker";

type LabelPosition = "inline" | "top" | "left" | "none";

export type DateTimeShortcut = {
  label: string;
  dateTime: Date;
};

type DateTimePickerProps = {
  label?: string;
  labelPosition?: LabelPosition;
  placeholder?: string;
  value?: Date | string;
  onChange?: (dateTime: Date | string | undefined) => void;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  disabledDates?: Matcher | Matcher[];
  name?: string;
  shortcuts?: DateTimeShortcut[];
};

const DateTimePicker = forwardRef<HTMLButtonElement, DateTimePickerProps>(
  (
    {
      label,
      labelPosition = "top",
      placeholder = "選擇日期時間",
      value,
      onChange,
      className,
      disabled,
      disabledDates,
      shortcuts,
      ...props
    },
    ref
  ) =>{
    const [open, setOpen] = useState(false);

    const normalizeDateTime = (input: Date | string | undefined): Date | undefined => {
      if (!input) return undefined;
      if (input instanceof Date) return input;
      const parsed = parseISO(input);
      return isValid(parsed) ? parsed : undefined;
    };

    const normalized = normalizeDateTime(value);
    const [tempDate, setTempDate] = useState<Date | undefined>(normalized);
    const [timeValue, setTimeValue] = useState(
      normalized ? format(normalized, "HH:mm:ss") : "00:00:00"
    );

    const handleDateSelect = (date: Date | undefined) => {
      setTempDate(date);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTimeValue(e.target.value);
    };

    const handleConfirm = () => {
      if (tempDate) {
        const [hours, minutes, seconds] = timeValue.split(":");
        const newDateTime = new Date(tempDate);
        newDateTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || "0"), 0);
        const formatted = format(newDateTime, "yyyy-MM-dd HH:mm:ss");
        onChange?.(formatted);
      } else {
        onChange?.(undefined);
      }
      setOpen(false);
    };

    const handleShortcutClick = (dateTime: Date) => {
      const formatted = format(dateTime, "yyyy-MM-dd HH:mm:ss");
      onChange?.(formatted);
      setOpen(false);
    };

    const formatDateTime = (dateTime: Date | string | undefined) => {
      if (!dateTime) return placeholder;
      const normalized = normalizeDateTime(dateTime);
      if (!normalized) return placeholder;
      return format(normalized, "yyyy-MM-dd HH:mm:ss");
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
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{formatDateTime(value)}</span>
        </Button>
      </PopoverTrigger>
    );

    const dateTimePickerElement = (
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
                    {shortcuts.map((shortcut: DateTimeShortcut, index: number) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="justify-start font-normal text-xs px-2 py-1.5 h-auto whitespace-nowrap"
                        onClick={() => handleShortcutClick(shortcut.dateTime)}
                      >
                        {shortcut.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <Calendar
                  mode="single"
                  selected={tempDate}
                  onSelect={handleDateSelect}
                  locale={zhTW}
                  formatters={calendarFormatters}
                  disabled={disabledDates}
                />
                <div className="px-3 py-2 border-t">
                  <Label className="text-xs mb-2 block">時間 (HH:mm:ss)</Label>
                  <Input
                    type="time"
                    step="1"
                    value={timeValue}
                    onChange={handleTimeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="border-t px-3 py-2 flex justify-end">
              <Button size="sm" onClick={handleConfirm} disabled={!tempDate}>
                確認
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );

    if (!label || labelPosition === "none") {
      return <div className="w-full">{dateTimePickerElement}</div>;
    }

    if (labelPosition === "inline") {
      return (
        <div className="w-full">
          <div className="group relative">
            <label className="bg-background text-foreground absolute start-2 top-0 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-[:disabled]:opacity-50">
              {label}
            </label>
            {dateTimePickerElement}
          </div>
        </div>
      );
    }

    if (labelPosition === "left") {
      return (
        <div className="w-full flex items-center gap-3">
          <Label className="flex-[2] justify-end">{label}</Label>
          <div className="flex-[7]">{dateTimePickerElement}</div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-2">
        <Label>{label}</Label>
        {dateTimePickerElement}
      </div>
    );
  }
);

export default DateTimePicker;
