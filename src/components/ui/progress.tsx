import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={`h-full w-full flex-1 transition-all ${value ? (value < 127.5 ? "bg-red-600" : value < 200 ? "bg-yellow-400" : "bg-lime-600") : ""}`}
        style={{ transform: `translateX(-${100 - ((value ? (value / 255) * 100 : 0))}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
