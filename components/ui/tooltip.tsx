'use client';

import React, { useState, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    className?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({
    children,
    content,
    className,
    position = 'top'
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
    };

    return (
        <div
            className="relative inline-block w-full"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={cn(
                        "absolute z-[60] px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xl whitespace-nowrap pointer-events-none transition-all duration-200 ease-out",
                        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                        positionClasses[position],
                        className
                    )}
                >
                    {content}
                    <div
                        className={cn(
                            "absolute border-4 border-transparent",
                            arrowClasses[position]
                        )}
                    />
                </div>
            )}
        </div>
    );
}
