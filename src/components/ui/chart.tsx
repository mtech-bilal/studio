// src/components/ui/chart.tsx

"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey, // Represents the key in the data object for the name (e.g., 'status' for Pie/Bar)
      labelKey, // Represents the key for the main label (often the X-axis value like 'month')
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const itemPayload = item.payload; // The data object for this tooltip item
      let value: React.ReactNode;

      // Determine the label value based on the chart type and provided keys
      if (labelKey && itemPayload && typeof itemPayload[labelKey] !== 'undefined') {
        // Use labelKey if provided (typically for X-axis value in Line/Bar charts)
        value = itemPayload[labelKey];
      } else if (nameKey && typeof item.name !== 'undefined') {
        // Use item.name if nameKey is provided (typically for category name in Pie/Bar charts)
        // This `item.name` comes directly from the recharts payload item, often set by `nameKey` on the chart component itself.
        value = item.name;
      } else if (nameKey && itemPayload && typeof itemPayload[nameKey] !== 'undefined') {
         // Fallback: If item.name isn't available, try reading the nameKey from the payload object
         value = itemPayload[nameKey];
      } else {
        // Fallback if no specific key is provided or found: use the raw label prop or the first item's name/dataKey
         const key = `${item.dataKey || item.name || 'value'}`;
         const itemConfig = getPayloadConfigFromPayload(config, item, key, nameKey);
         value = label || itemConfig?.label || item.name || itemPayload?.name;
      }


      if (labelFormatter && value !== undefined) { // Ensure value is defined before formatting
        return (
          <div className={cn('font-medium', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (value === undefined || value === null) { // Return null if value is still undefined/null
        return null;
      }

      return <div className={cn('font-medium', labelClassName)}>{String(value)}</div>; // Ensure value is stringified

    }, [
      payload,
      hideLabel,
      labelKey,
      nameKey,
      label,
      labelFormatter,
      labelClassName,
      config,
    ]);


    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
             // Determine the key for fetching config: use item.name (from Pie/Cell) if available,
             // otherwise use the dataKey.
             const itemKey = item.name || item.dataKey || 'value';
             const itemConfig = getPayloadConfigFromPayload(config, item, String(itemKey), nameKey); // Convert itemKey to string

             // Determine the fill color: prioritize item payload's fill, then item color, then config color
             const indicatorColor = item.payload?.fill || item.color || itemConfig?.color;

             // Determine the name to display: prioritize config label, then item name.
             const itemName = itemConfig?.label || item.name;

            return (
              <div
                key={item.dataKey || item.name || index} // Use item.name or index as fallback key
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && itemName !== undefined ? (
                  formatter(item.value, String(itemName), item, index, item.payload) // Ensure itemName is string
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {String(itemName)} {/* Ensure itemName is stringified */}
                        </span>
                      </div>
                      {item.value !== undefined && item.value !== null && ( // Check for undefined and null
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string // Represents the key in the data object that holds the name (e.g., 'status')
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
           // In legends, item.value usually holds the key/name (e.g., "Completed", "appointments").
           const key = String(item.value); // Ensure key is a string
           const itemConfig = getPayloadConfigFromPayload(config, item, key, nameKey);

          return (
            <div
              key={key} // Use the derived key
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color, // Use the color provided by Recharts payload
                  }}
                />
              )}
               {/* Use the label from config based on the key (item.value), fallback to item.value */}
              <span className="text-muted-foreground">{itemConfig?.label || key}</span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown, // Recharts payload item
  key: string, // The primary key derived (e.g., 'appointments', 'Completed', 'Scheduled')
  nameKey?: string // Optional: The key in the data object holding the name (e.g., 'status')
): ChartConfig[string] | undefined {

  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadItem = payload as any; // Type assertion for easier access

   // 1. Prioritize direct key match in config (most common for simple setups)
   if (key && key in config) {
    return config[key];
  }

  // 2. If nameKey is provided (often for categorical data like Pie/Bar) and payload has 'name' or 'value'
  //    that matches a config key, use that. 'value' is often used in Legends, 'name' in Tooltips.
  if (nameKey) {
     const nameValue = payloadItem.value ?? payloadItem.name; // Check both value and name
     if (nameValue && nameValue in config) {
       return config[nameValue];
     }
     // Also check if the payload object itself has the nameKey field and if its value matches a config key
     if (payloadItem.payload && typeof payloadItem.payload[nameKey] === 'string' && payloadItem.payload[nameKey] in config) {
       return config[payloadItem.payload[nameKey]];
     }
   }

  // 3. Fallback: Check if payload.dataKey matches a config key (common in Line/Bar tooltips)
  if (payloadItem.dataKey && payloadItem.dataKey in config) {
      return config[payloadItem.dataKey];
  }

  // 4. Final Fallback: Check payload.name directly if it wasn't caught by nameKey logic
  if (payloadItem.name && payloadItem.name in config) {
     return config[payloadItem.name];
  }


  return undefined;
}


export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
