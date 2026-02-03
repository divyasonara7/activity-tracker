import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    variant?: "default" | "success" | "streak";
}

const Progress = React.forwardRef<
    React.ComponentRef<typeof ProgressPrimitive.Root>,
    ProgressProps
>(({ className, value, variant = "default", ...props }, ref) => {
    const variants = {
        default: "bg-primary-500",
        success: "bg-gradient-to-r from-success-400 to-success-500",
        streak: "bg-gradient-to-r from-accent-400 via-accent-500 to-red-500",
    };

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(
                "relative h-3 w-full overflow-hidden rounded-full bg-muted",
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={cn(
                    "h-full w-full flex-1 transition-all duration-500 ease-out",
                    variants[variant]
                )}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
