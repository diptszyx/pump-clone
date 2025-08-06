import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../../lib/utils";

import {
  Button as ShadcnButton,
  type ButtonProps as ShadcnButtonProps,
} from "../button";

import "./styles/retro.css";

export const buttonVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
    variant: {
      default: "bg-foreground",
      destructive: "bg-foreground",
      outline: "bg-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      // Custom 8-bit gaming colors with WCAG AA compliant contrast ratios
      neon: "bg-green-500 text-white hover:bg-green-400 dark:bg-green-600 dark:text-white dark:hover:bg-green-500 shadow-sm",
      electric:
        "bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-sm",
      hot: "bg-pink-600 text-white hover:bg-pink-500 dark:bg-pink-700 dark:hover:bg-pink-600 shadow-sm",
      fire: "bg-orange-600 text-white hover:bg-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600 shadow-sm",
      cosmic:
        "bg-purple-700 text-white hover:bg-purple-600 dark:bg-purple-800 dark:hover:bg-purple-700 shadow-sm",
      cyber:
        "bg-cyan-600 text-white hover:bg-cyan-500 dark:bg-cyan-700 dark:text-white dark:hover:bg-cyan-600 shadow-sm",
      retro:
        "bg-yellow-500 text-black hover:bg-yellow-400 dark:bg-yellow-600 dark:text-black dark:hover:bg-yellow-500 shadow-sm",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface BitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

function Button({ children, asChild, ...props }: BitButtonProps) {
  const { variant, size, className, font, ...restProps } = props;

  type ShadcnVariant = NonNullable<ShadcnButtonProps["variant"]>;

  const shadcnVariant: ShadcnVariant =
    variant === "default" ||
    variant === "destructive" ||
    variant === "outline" ||
    variant === "secondary" ||
    variant === "ghost" ||
    variant === "link"
      ? variant
      : "default";

  return (
    <ShadcnButton
      {...restProps}
      className={cn(
        buttonVariants({ variant, size, font }),
        "rounded-none active:translate-y-1 transition-transform relative inline-flex items-center justify-center gap-1.5",
        font !== "normal" && "retro",
        className
      )}
      size={size}
      variant={shadcnVariant}
      asChild={asChild}
    >
      {asChild ? (
        <span className="relative inline-flex items-center justify-center gap-1.5">
          {children}

          {variant !== "ghost" && variant !== "link" && size !== "icon" && (
            <>
              {/* Pixelated border */}
              <div className="absolute -top-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -top-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -bottom-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -bottom-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute bottom-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute bottom-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-1.5 -left-1.5 h-2/3 w-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-1.5 -right-1.5 h-2/3 w-1.5 bg-foreground dark:bg-ring" />
              {variant !== "outline" && (
                <>
                  {/* Top shadow */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/20" />
                  <div className="absolute top-1.5 left-0 w-3 h-1.5 bg-foreground/20" />

                  {/* Bottom shadow */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-foreground/20" />
                  <div className="absolute bottom-1.5 right-0 w-3 h-1.5 bg-foreground/20" />
                </>
              )}
            </>
          )}

          {size === "icon" && (
            <>
              <div className="absolute top-0 left-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute top-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute top-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            </>
          )}
        </span>
      ) : (
        <>
          {children}

          {variant !== "ghost" && variant !== "link" && size !== "icon" && (
            <>
              {/* Pixelated border */}
              <div className="absolute -top-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -top-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -bottom-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute -bottom-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute bottom-0 left-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute bottom-0 right-0 size-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-1.5 -left-1.5 h-2/3 w-1.5 bg-foreground dark:bg-ring" />
              <div className="absolute top-1.5 -right-1.5 h-2/3 w-1.5 bg-foreground dark:bg-ring" />
              {variant !== "outline" && (
                <>
                  {/* Top shadow */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/20" />
                  <div className="absolute top-1.5 left-0 w-3 h-1.5 bg-foreground/20" />

                  {/* Bottom shadow */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-foreground/20" />
                  <div className="absolute bottom-1.5 right-0 w-3 h-1.5 bg-foreground/20" />
                </>
              )}
            </>
          )}

          {size === "icon" && (
            <>
              <div className="absolute top-0 left-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute top-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute top-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
              <div className="absolute bottom-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            </>
          )}
        </>
      )}
    </ShadcnButton>
  );
}

export { Button };
