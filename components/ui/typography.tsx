import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium",
      subtle: "text-sm text-muted-foreground"
    },
    size: {
      default: "",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})

interface TypographyProps 
  extends React.HTMLAttributes<HTMLParagraphElement>, 
  VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, variant, size, as: Component = "p", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = "Typography"

export { Typography, typographyVariants }