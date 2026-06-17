type CardVariant = "default" | "glass" | "interactive"
type CardPadding = "none" | "sm" | "md" | "lg"

interface CardProps {
  variant?: CardVariant
  padding?: CardPadding
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

const variantStyles: Record<CardVariant, string> = {
  default: "rounded-2xl border border-border bg-card shadow-sm",
  glass: "rounded-2xl glass shadow-sm",
  interactive:
    "rounded-2xl border border-border bg-card shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/30",
}

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

export function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  onClick,
}: CardProps) {
  const Component = onClick ? "button" : "div"
  return (
    <Component
      onClick={onClick}
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </Component>
  )
}
