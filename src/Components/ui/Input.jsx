import React, { forwardRef, useId } from 'react'

const Input = forwardRef(function Input({
  label,
  type = "text",
  className = "",
  labelClassName= "",
  ...props
}, ref) {

  let id = useId()

  return (
    <div className='w-full'>
      {label && <label
        htmlFor={id}
        className={`inline-block mb-1 pl-1 pb-2 text-xl ${labelClassName}`}
      >
        {label}
      </label>}
      <input
        type={type}
        ref={ref}
        {...props}
        id={id}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 mb-6 outline-none focus:ring-2 focus:ring-black ${className}`}
      />
    </div>
  )
})

export default Input