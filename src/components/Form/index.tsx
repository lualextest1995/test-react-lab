"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  useForm,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import type z from "zod";

import {
  Form as DefaultForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Input from "@/components/Input";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import Combobox from "@/components/Combobox";
import ComboboxMultiple from "@/components/ComboboxMultiple";
import DatePicker from "@/components/DatePicker";
import DateRangePicker, { type DateRangeValue } from "@/components/DateRangePicker";
import DateTimePicker from "@/components/DateTimePicker";
import DateTimeRangePicker, { type DateTimeRangeValue } from "@/components/DateTimeRangePicker";

import type {
  FieldConfig,
  FieldType,
  FormConfig,
  FormRef,
  LabelPosition,
} from "./helper";

// Re-export only types (not constants or functions)
export type {
  ComboboxConfig,
  ComboboxMultipleConfig,
  DatePickerConfig,
  DateRangePickerConfig,
  DateTimePickerConfig,
  DateTimeRangePickerConfig,
  FieldConfig,
  FieldType,
  FormConfig,
  FormRef,
  LabelPosition,
  PasswordInputConfig,
  SelectConfig,
  SelectOption,
  TextareaConfig,
  TextInputConfig,
} from "./helper";

type ZodFieldValuesSchema<TValues extends FieldValues> = z.ZodType<
  TValues,
  FieldValues
>;

export interface AppFormProps<TValues extends FieldValues> {
  config: FormConfig<TValues>;
  schema?: ZodFieldValuesSchema<TValues>;
  values: TValues;
  onChange: (values: TValues) => void;
  onSubmit: (data: TValues) => void;
  className?: string;
  children?: React.ReactNode;
}

// ============================================
// 🧱 Form (Type-safe + Shadcn)
// ============================================

 const Form = forwardRef(<TValues extends FieldValues>(
  {
    config,
    schema,
    values,
    onChange,
    onSubmit,
    className,
    children,
  }: AppFormProps<TValues>,
  ref: React.Ref<FormRef<TValues>>
) => {
  const form = useForm<TValues, unknown, TValues>({
    resolver: schema
      ? (zodResolver(schema) as unknown as Resolver<
          TValues,
          unknown,
          TValues
        >)
      : undefined,
    values: values,
    mode: "onChange",
  });

  // ✅ 外部控制 ref
  useImperativeHandle(ref, () => ({
    submit: () => form.handleSubmit(onSubmit)(),
    getValues: () => form.getValues(),
    setValue: (name, value) => form.setValue(name, value),
  }));

  // ✅ 雙向同步：表單內部變化 -> 外部
  useEffect(() => {
    const subscription = form.watch(() => onChange(form.getValues()));
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // ✅ 清除不存在欄位的錯誤
  useEffect(() => {
    const currentFieldNames = new Set(config.fields.map((f) => f.name));
    const formState = form.formState;

    // 清除不在當前 config 中的欄位錯誤
    Object.keys(formState.errors).forEach((fieldName) => {
      if (!currentFieldNames.has(fieldName as never)) {
        form.clearErrors(fieldName as never);
      }
    });
  }, [config.fields, form]);

  // ============================================
  // 🔧 Helper Functions - 單一職責原則
  // ============================================

  /**
   * 標準化欄位值 - 統一處理類型轉換
   */
  const normalizeFieldValue = (value: unknown, type: FieldType): string | string[] | undefined => {
    if (type === "select" || type === "combobox") {
      return value == null ? undefined : String(value);
    }
    if (type === "combobox-multiple") {
      return value == null ? [] : (value as string[]);
    }
    return value == null ? "" : String(value);
  };

  /**
   * 渲染輸入元件 - 只負責選擇正確的 input
   */
  const renderInput = (
    fieldConfig: FieldConfig<TValues>,
    field: { value: unknown; onChange: (value: unknown) => void },
    errorClassName: string
  ) => {
    const { type, inputClassName, placeholder } = fieldConfig;

    // TypeScript 類型窄化 - 當 type === "select" 時,TypeScript 知道這是 SelectConfig
    if (type === "select") {
      // 類型守衛:確保只有 SelectConfig 才有 options
      if (!("options" in fieldConfig)) return null;

      return (
        <Select
          options={fieldConfig.options}
          placeholder={placeholder}
          value={normalizeFieldValue(field.value, type) as string | undefined}
          onChange={field.onChange}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "combobox") {
      // 類型守衛:確保只有 ComboboxConfig 才有 options
      if (!("options" in fieldConfig)) return null;

      return (
        <Combobox
          options={fieldConfig.options}
          placeholder={placeholder}
          value={normalizeFieldValue(field.value, type) as string | undefined}
          onChange={field.onChange}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "combobox-multiple") {
      // 類型守衛:確保只有 ComboboxMultipleConfig 才有 options
      if (!("options" in fieldConfig)) return null;

      const maxShownItems = "maxShownItems" in fieldConfig ? fieldConfig.maxShownItems : undefined;
      return (
        <ComboboxMultiple
          options={fieldConfig.options}
          placeholder={placeholder}
          value={normalizeFieldValue(field.value, type) as string[] | undefined}
          onChange={field.onChange}
          maxShownItems={maxShownItems}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "textarea") {
      const rows = "rows" in fieldConfig ? fieldConfig.rows : undefined;
      return (
        <Textarea
          placeholder={placeholder}
          rows={rows}
          value={normalizeFieldValue(field.value, type) as string}
          onChange={field.onChange}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "datepicker") {
      const shortcuts = "shortcuts" in fieldConfig ? fieldConfig.shortcuts : undefined;
      const disabledDates = "disabledDates" in fieldConfig ? fieldConfig.disabledDates : undefined;
      return (
        <DatePicker
          placeholder={placeholder}
          value={field.value as Date | string | undefined}
          onChange={field.onChange}
          shortcuts={shortcuts}
          disabledDates={disabledDates}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "daterange") {
      const shortcuts = "shortcuts" in fieldConfig ? fieldConfig.shortcuts : undefined;
      const disabledDates = "disabledDates" in fieldConfig ? fieldConfig.disabledDates : undefined;
      return (
        <DateRangePicker
          placeholder={placeholder}
          value={field.value as DateRangeValue | undefined}
          onChange={field.onChange}
          shortcuts={shortcuts}
          disabledDates={disabledDates}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "datetime") {
      const shortcuts = "shortcuts" in fieldConfig ? fieldConfig.shortcuts : undefined;
      const disabledDates = "disabledDates" in fieldConfig ? fieldConfig.disabledDates : undefined;
      return (
        <DateTimePicker
          placeholder={placeholder}
          value={field.value as Date | string | undefined}
          onChange={field.onChange}
          shortcuts={shortcuts}
          disabledDates={disabledDates}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    if (type === "datetimerange") {
      const shortcuts = "shortcuts" in fieldConfig ? fieldConfig.shortcuts : undefined;
      const disabledDates = "disabledDates" in fieldConfig ? fieldConfig.disabledDates : undefined;
      return (
        <DateTimeRangePicker
          placeholder={placeholder}
          value={field.value as DateTimeRangeValue | undefined}
          onChange={field.onChange}
          shortcuts={shortcuts}
          disabledDates={disabledDates}
          className={`${inputClassName || ""} ${errorClassName}`}
        />
      );
    }

    return (
      <Input
        type={type}
        placeholder={placeholder}
        value={normalizeFieldValue(field.value, type) as string}
        onChange={field.onChange}
        className={`${inputClassName || ""} ${errorClassName}`}
      />
    );
  };

  /**
   * 渲染標籤 - 根據位置決定樣式
   */
  const renderLabel = (label: string | undefined, labelPosition: LabelPosition) => {
    if (!label) return null;

    if (labelPosition === "inline") {
      return (
        <FormLabel className="absolute start-2 top-0 z-10 -translate-y-1/2 px-1 text-xs font-medium bg-background text-foreground">
          {label}
        </FormLabel>
      );
    }

    if (labelPosition === "none") {
      return null;
    }

    return <FormLabel className={labelPosition === "left" ? "flex-[2] justify-end" : ""}>
      {label}
    </FormLabel>;
  };

  /**
   * 渲染欄位佈局 - 處理不同的 label 位置
   */
  const renderLayout = (
    label: string | undefined,
    labelPosition: LabelPosition,
    content: React.ReactNode,
    itemClassName?: string
  ) => {
    const isInline = labelPosition === "inline";
    const isLeft = labelPosition === "left";

    if (isLeft) {
      return (
        <FormItem className={itemClassName}>
          <div className="flex items-center gap-3">
            {renderLabel(label, labelPosition)}
            <div className="flex-[7]">{content}</div>
          </div>
        </FormItem>
      );
    }

    return (
      <FormItem className={`${isInline ? "relative" : ""} ${itemClassName || ""}`}>
        {!isLeft && renderLabel(label, labelPosition)}
        {content}
      </FormItem>
    );
  };

  /**
   * 渲染欄位 - 組合所有部分
   */
  const renderField = (fieldConfig: FieldConfig<TValues>) => {
    const {
      className: itemClassName,
      controlClassName,
      helperText,
      label,
      labelPosition = "top",
      name,
    } = fieldConfig;

    return (
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;
          const errorClassName = hasError ? "border-destructive" : "";
          const messageClassName = labelPosition === "left" ? "ml-[calc(22%+0.75rem)]" : "";

          const inputElement = renderInput(fieldConfig, field, errorClassName);
          const content = (
            <FormControl className={controlClassName || ""}>
              {inputElement}
            </FormControl>
          );

          return (
            <>
              {renderLayout(label, labelPosition, content, itemClassName)}
              {fieldState.error ? (
                <FormMessage className={messageClassName} />
              ) : helperText ? (
                <FormDescription className={messageClassName}>{helperText}</FormDescription>
              ) : null}
            </>
          );
        }}
      />
    );
  };

  return (
    <DefaultForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {config.fields.map(renderField)}
        {children}
      </form>
    </DefaultForm>
  );
}) as <TValues extends FieldValues>(
  props: AppFormProps<TValues> & { ref?: React.Ref<FormRef<TValues>> }
) => React.ReactElement;

export default Form;