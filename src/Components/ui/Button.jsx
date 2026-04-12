import React from 'react'

function Button({
    children,
    type = "Button",
    bgcolor = "",
    textcolor = "",
    className = "",
    ...props
}) {
    return (
        <button
            className={`px-4 py-2 rounded-lg ${bgcolor} ${textcolor} ${className}`}
            type={type}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button