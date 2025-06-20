import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea Component
 * 
 * A styled textarea component with consistent design and accessibility features.
 * Supports all standard HTML textarea attributes with enhanced styling.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional textarea props
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base textarea styling with dark mode and accessibility support
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
