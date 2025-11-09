import type { FieldPath, FieldValues } from "react-hook-form";

// ============================================
// 🧩 類型定義區
// ============================================

export type SelectOption = {
  isGroup?: boolean;
  value: string;
  label: string;
  children?: SelectOption[];
  disabled?: boolean;
};

export const FIELD_TYPES = {
  TEXT: "text",
  PASSWORD: "password",
  TEXTAREA: "textarea",
  DATEPICKER: "datepicker",
  DATERANGE: "daterange",
  DATETIME: "datetime",
  DATETIMERANGE: "datetimerange",
  SELECT: "select",
  COMBOBOX: "combobox",
  COMBOBOX_MULTIPLE: "combobox-multiple",
} as const;

export const LABEL_POSITIONS = {
  INLINE: "inline",
  TOP: "top",
  LEFT: "left",
  NONE: "none",
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];
export type LabelPosition =
  (typeof LABEL_POSITIONS)[keyof typeof LABEL_POSITIONS];

/**
 * 條件性加入 fields 的 helper function
 * 使用 const assertion 保持字面類型
 */
export function when<const T extends readonly unknown[]>(
  condition: boolean,
  fields: T
): T | [] {
  return condition ? fields : ([] as const);
}

/**
 * 基礎欄位配置 - 只關心資料和 UI
 */
interface BaseFieldConfig<TValues extends FieldValues> {
  name: FieldPath<TValues>;
  label?: string;
  helperText?: string;
  labelPosition?: LabelPosition;
  className?: string;
  controlClassName?: string;
  inputClassName?: string;
}

/**
 * 文字輸入欄位
 */
export type TextInputConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "text";
  placeholder?: string;
};

/**
 * 密碼輸入欄位
 */
export type PasswordInputConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "password";
  placeholder?: string;
};

/**
 * 文字區域欄位
 */
export type TextareaConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "textarea";
  placeholder?: string;
  rows?: number;
};

/**
 * 日期選擇器欄位
 */
export type DatePickerConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "datepicker";
  placeholder?: string;
  shortcuts?: import("@/components/DatePicker").DateShortcut[];
  disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
};

/**
 * 日期區間選擇器欄位
 */
export type DateRangePickerConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "daterange";
  placeholder?: string;
  shortcuts?: import("@/components/DateRangePicker").DateRangeShortcut[];
  disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
};

/**
 * 日期時間選擇器欄位
 */
export type DateTimePickerConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "datetime";
  placeholder?: string;
  shortcuts?: import("@/components/DateTimePicker").DateTimeShortcut[];
  disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
};

/**
 * 日期時間區間選擇器欄位
 */
export type DateTimeRangePickerConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "datetimerange";
  placeholder?: string;
  shortcuts?: import("@/components/DateTimeRangePicker").DateTimeRangeShortcut[];
  disabledDates?: import("react-day-picker").Matcher | import("react-day-picker").Matcher[];
};

/**
 * 下拉選單欄位
 */
export type SelectConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "select";
  options: SelectOption[];
  placeholder?: string;
};

/**
 * 可搜尋下拉選單欄位 (Combobox)
 */
export type ComboboxConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "combobox";
  options: SelectOption[];
  placeholder?: string;
};

/**
 * 多選可搜尋下拉選單欄位 (ComboboxMultiple)
 */
export type ComboboxMultipleConfig<TValues extends FieldValues> = BaseFieldConfig<TValues> & {
  type: "combobox-multiple";
  options: SelectOption[];
  placeholder?: string;
  maxShownItems?: number;
};

export type FieldConfig<TValues extends FieldValues> =
  | TextInputConfig<TValues>
  | PasswordInputConfig<TValues>
  | TextareaConfig<TValues>
  | DatePickerConfig<TValues>
  | DateRangePickerConfig<TValues>
  | DateTimePickerConfig<TValues>
  | DateTimeRangePickerConfig<TValues>
  | SelectConfig<TValues>
  | ComboboxConfig<TValues>
  | ComboboxMultipleConfig<TValues>;

export interface FormConfig<TValues extends FieldValues> {
  fields: FieldConfig<TValues>[];
}

export interface FormRef<TValues extends FieldValues> {
  submit: () => void;
  getValues: () => TValues;
  setValue: <K extends FieldPath<TValues>>(name: K, value: TValues[K]) => void;
}
