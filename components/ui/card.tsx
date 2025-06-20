import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card Component
 * 
 * Main card container with consistent styling, spacing, and border radius.
 * Provides a foundation for card-based layouts throughout the application.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional div props
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardHeader Component
 * 
 * Header section of a card with responsive grid layout.
 * Supports automatic layout adjustments when card actions are present.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional div props
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardTitle Component
 * 
 * Title element within a card header with consistent typography styling.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional div props
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * CardDescription Component
 * 
 * Description text within a card with muted styling for secondary information.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional div props
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * CardAction Component
 * 
 * Action area within a card header, positioned in the top-right corner.
 * Automatically adjusts layout when present in card headers.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional div props
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardContent Component
 * 
 * Main content area of a card with consistent horizontal padding.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional div props
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * CardFooter Component
 * 
 * Footer section of a card with consistent styling and spacing.
 * Supports border-top styling when needed.
 * 
 * @param className - Additional CSS classes
 * @param props - Additional div props
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
