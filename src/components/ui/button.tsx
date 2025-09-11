import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-elder-base font-medium ring-offset-background transition-companionship focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-gentle",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        therapeutic: "bg-gradient-primary text-primary-foreground hover:shadow-therapeutic transition-therapeutic",
        calming: "bg-gradient-calm text-accent-foreground hover:scale-105 transition-gentle shadow-gentle",
        healing: "bg-gradient-healing text-foreground border border-primary/20 hover:shadow-gentle transition-therapeutic",
        // Elder-friendly companionship variants
        companionship: "bg-gradient-primary text-primary-foreground hover:shadow-companionship transition-companionship shadow-gentle border border-primary/20",
        nurturing: "bg-gradient-warmth text-foreground hover:bg-secondary/90 shadow-gentle border border-secondary/30",
        comfort: "bg-accent text-accent-foreground hover:bg-accent/80 shadow-gentle text-elder-base font-semibold",
      },
      size: {
        default: "h-12 px-6 py-3 text-elder-base", // Larger for elderly users
        sm: "h-10 rounded-md px-4 text-elder-sm",
        lg: "h-14 rounded-md px-8 text-elder-lg", // Extra large for better accessibility
        icon: "h-12 w-12", // Larger touch targets
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };