import React, { ComponentPropsWithoutRef, CSSProperties } from "react"

import { cn } from "@/lib/utils"

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number
  mainCircleOpacity?: number
  numCircles?: number
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.5,
  numCircles = 8,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center select-none",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70
        const opacity = mainCircleOpacity - i * 0.05
        const animationDelay = `${i * 0.06}s`

        return (
          <div
            key={i}
            className="animate-ripple absolute rounded-full"
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                border: "1px solid rgba(80, 80, 80, 0.5)",
                backgroundColor: "rgba(40, 40, 40, 0.2)",
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
})

Ripple.displayName = "Ripple"
