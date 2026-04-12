import { forwardRef, useId } from "react";

const Card = forwardRef(function Card({data, className = "", classNameImg = ""}, ref) {


    let id = useId()

    return (

        <div
            htmlFor={id}
            ref={ref}
            className={`group w-80 bg-white overflow-hidden transition-all duration-300 p-3 ${className}`}
        >

            <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                <img
                    src={data?.image}
                    alt={data?.title}
                    className={`w-full h-full object-cover ${classNameImg}`}
                />

            </div>

            {/* Card Body */}
            <div className="py-4 px-2 text-center">

                <p className="text-sm uppercase text-gray-500 mt-1 line-clamp-2">
                    {data.category}
                </p>
                <p className="text-sm uppercase text-gray-500 mt-1 line-clamp-2">
                    {data.price}
                </p>
                {data.color && data.color.map((color, index) => (
                    <span
                        key={index}
                        className="inline-block w-4 h-4 rounded-full border border-gray-300 mx-1"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );
});

export default Card



