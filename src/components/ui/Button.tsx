import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25",
                secondary:
                    "bg-card text-foreground border border-border hover:bg-card-hover hover:border-border-hover",
                ghost:
                    "text-muted-foreground hover:text-foreground hover:bg-card/50",
                success:
                    "bg-success text-white hover:bg-success/90 shadow-lg shadow-success/25",
                outline:
                    "border border-border bg-transparent hover:bg-card hover:border-border-hover",
            },
            size: {
                sm: "h-8 px-3 text-sm rounded-lg",
                default: "h-10 px-4 text-sm rounded-xl",
                lg: "h-12 px-6 text-base rounded-xl",
                xl: "h-14 px-8 text-lg rounded-2xl",
                icon: "h-10 w-10 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Loading...</span>
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
