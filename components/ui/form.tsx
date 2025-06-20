"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

/**
 * Form Provider Component
 * 
 * Wrapper component that provides form context to all child components.
 * Built on react-hook-form's FormProvider for form state management.
 */
const Form = FormProvider

/**
 * Form Field Context Type
 * 
 * Type definition for the form field context value.
 * Contains the field name for form validation and state management.
 */
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

// Create context for form field state
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

/**
 * Form Field Component
 * 
 * Wrapper component that provides field context and controller functionality.
 * Integrates react-hook-form's Controller with custom form components.
 * 
 * @param props - Controller props from react-hook-form
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

/**
 * useFormField Hook
 * 
 * Custom hook that provides form field state and accessibility attributes.
 * Must be used within a FormField component.
 * 
 * @returns Object containing field state, IDs, and accessibility attributes
 * @throws Error if used outside of FormField component
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

/**
 * Form Item Context Type
 * 
 * Type definition for the form item context value.
 * Contains the unique ID for form item identification.
 */
type FormItemContextValue = {
  id: string
}

// Create context for form item state
const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

/**
 * Form Item Component
 * 
 * Container component for individual form fields.
 * Provides unique ID and context for form validation and accessibility.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional div props
 */
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

/**
 * Form Label Component
 * 
 * Label component for form fields with error state styling.
 * Automatically associates with form controls for accessibility.
 * 
 * @param className - Additional CSS classes
 * @param props - Label props from Radix UI
 */
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

/**
 * Form Control Component
 * 
 * Wrapper component for form input elements.
 * Provides accessibility attributes and error state management.
 * 
 * @param props - Slot props from Radix UI
 */
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

/**
 * Form Description Component
 * 
 * Description text for form fields.
 * Provides additional context and instructions for form inputs.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional paragraph props
 */
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Form Message Component
 * 
 * Error message component for form validation.
 * Displays validation errors with appropriate styling.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional paragraph props
 */
function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
