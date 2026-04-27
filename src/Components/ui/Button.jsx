import React from 'react'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

function Button({
    children,
    type = "button",
    bgcolor = "",
    textcolor = "",
    className = "",
    ...props
}) {
    return (
        <button
            className={twMerge(clsx(`px-4 py-2 rounded-lg ${bgcolor} ${textcolor} ${className}`))}
            type={type}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button