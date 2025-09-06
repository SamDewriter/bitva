import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default: "bg-[#205FEA] hover:bg-[#1b4ed1] text-white focus:ring-[#205FEA]",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => (
        <button
            ref={ref}
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        />
    )
);

Button.displayName = "Button";
