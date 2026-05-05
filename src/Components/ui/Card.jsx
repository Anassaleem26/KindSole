import { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";


const Card = forwardRef(function Card({ data, className = "", classNameImg = "" }, ref) {


    const navigate = useNavigate()
    const [userSelectedVariant, setUserSelectedVariant] = useState(null);
    const currentVariant = userSelectedVariant || data?.variants?.[0];

    const handleNavigate = () => {
        navigate(`/product/${data.id || data.productId}`);
    }

   

    return (
        <div
            ref={ref}
            className={`group w-80 bg-white overflow-hidden transition-all duration-300 p-3 shadow-lg hover:shadow-md rounded-xl ${className}`}
        >

            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden border border-gray-200 rounded-lg">
                <img
                    src={currentVariant?.imageUrl || "https://via.placeholder.com/300"}
                    alt={data?.productName}
                    className={`w-full h-full object-cover transition-all duration-500 ${classNameImg}`}
                    onClick={handleNavigate}
                />
            </div>

            {/* Card Body */}
            <div className="py-4 px-2 text-center">

                <p className="text-xs uppercase text-gray-400 tracking-widest font-semibold">
                    {data?.category}
                </p>

                <h3 className="text-sm uppercase font-bold text-gray-800 mt-1 line-clamp-1">
                    {data?.productName}
                </h3>


                {/* Regular/Discount  Prices */}
                <div className="flex gap-2 justify-center items-center my-2">

                    {data.discountPrice && data.discountPrice !== "" ? (
                        <>
                            <p className="text-base font-bold text-black">
                                ${data?.discountPrice}
                            </p>
                            <p className="text-sm text-gray-400 line-through">
                                ${data?.regularPrice}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-black font-bold">
                            ${data?.regularPrice}
                        </p>
                    )}


                </div>

                {/* Color Selection Dots */}
                <div className="flex gap-2 justify-center mt-4">

                    {data?.variants?.map((variant, index) => {

                        const isActive = currentVariant?.color === variant.color;

                        return (
                            <button
                                key={index}
                                type="button"
                                // Click par state update hogi aur image change ho jayegi
                                onClick={() => setUserSelectedVariant(variant)}
                                className={`w-5 h-5 rounded-full border border-gray-300 transition-all duration-200 ${isActive ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-110"
                                    }`}
                                style={{ backgroundColor: variant.color.toLowerCase() }}
                                title={variant.color}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default Card;