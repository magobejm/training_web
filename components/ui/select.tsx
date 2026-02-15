import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => { } })

export const Select = ({ children, onValueChange, defaultValue, value }: any) => {
    const [open, setOpen] = React.useState(false)
    const [currentValue, setCurrentValue] = React.useState(value || defaultValue)

    const handleValueChange = (val: string) => {
        setCurrentValue(val)
        onValueChange?.(val)
        setOpen(false)
    }

    return (
        <SelectContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    )
}

export const SelectTrigger = ({ children, className }: any) => {
    const { setOpen, open } = React.useContext(SelectContext)
    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
        </button>
    )
}

export const SelectValue = ({ placeholder }: any) => {
    const { value } = React.useContext(SelectContext)
    return <span>{value || placeholder}</span>
}

export const SelectContent = ({ children }: any) => {
    const { open } = React.useContext(SelectContext)
    if (!open) return null
    return (
        <div className="absolute top-full z-50 mt-1 max-h-96 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md bg-white dark:bg-gray-800">
            <div className="p-1">{children}</div>
        </div>
    )
}

export const SelectItem = ({ children, value, className }: any) => {
    const { onValueChange, value: selectedValue } = React.useContext(SelectContext)
    return (
        <div
            onClick={() => onValueChange?.(value)}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                selectedValue === value && "bg-gray-100 dark:bg-gray-700",
                className
            )}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {selectedValue === value && <span>✓</span>}
            </span>
            <span className="truncate">{children}</span>
        </div>
    )
}
