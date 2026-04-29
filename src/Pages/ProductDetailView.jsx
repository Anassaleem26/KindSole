import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import configservice from '../Firebase/Config-services';

function ProductDetailView() {

    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [selectSize, setSelectedSize] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // -------------------------------------------------------------------------------------------------------------


    // Click the color change the img
    const [userSelectedVariant, setUserSelectedVariant] = useState(product?.variants?.[0])

    const currentVariant = userSelectedVariant || product?.variants?.[0]

    // -------------------------------------------------------------------------------------------------------------


    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await configservice.getProduct(productId);
                setProduct(data)

            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setLoading(false)
            }
        })()
    }, [productId])

    const handleAddToCart = (e) => {
        e.preventDefault();

        if (!selectSize) {
            setError("Please select a size to continue.")
            return;
        }

    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Icon icon="svg-spinners:ring-resize" className="size-10" />
            </div>);
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-17 pb-10 px-8 gap-6">
            <form
                onSubmit={handleAddToCart}
                className='max-w-7xl mx-auto flex flex-col md:flex-row py-12 px-6 gap-10'
            >


                {/* Product Image */}
                <div className='w-full md:w-1/2 '>
                    <img
                        src={currentVariant?.imageUrl || "https://via.placeholder.com/600"}
                        alt={product?.productName}
                        className='h-full w-full object-cover hover:scale-105 transition-transform duration-700'
                    />
                </div>



                {/* Product Details */}
                <div className='w-full md:w-1/2 flex flex-col  bg-white rounded-2xl py-7 px-6 shadow-lg'>

                    <div className="mb-7">

                        {/* Category */}
                        <p
                            className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3"
                        >
                            {product?.category}
                        </p>


                        {/* Product Name */}
                        <h1 className='text-4xl font-bold uppercase italic text-gray-900 mb-5'>
                            {product?.productName}
                        </h1>


                        {/* Product Price */}
                        <div className='flex items-center gap-3 pt-3'>
                            {product?.discountPrice && Number(product.discountPrice) > 0 ? (
                                <>
                                    <p className='text-2xl font-bold text-gray-900'>${product?.discountPrice}</p>
                                    <p className='text-xl text-gray-400 line-through'>${product?.regularPrice}</p>
                                    <span className='bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold'>
                                        {Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)}% OFF
                                    </span>
                                </>
                            ) : (
                                <p className='text-xl text-black'>${product?.regularPrice}</p>
                            )}

                        </div>
                    </div>


                    {/* Color Selection */}
                    <div className="mb-8">
                        <h2 className='text-sm font-bold uppercase text-gray-900 mb-3'>Color: <span className="text-gray-500 font-normal">Anthracite</span></h2>

                        <div className="flex gap-3">
                            {product?.variants.map((variant, index) => {

                                let isActive = currentVariant?.color === variant.color
                                return (

                                    <button
                                        key={index}
                                        title={variant.color}
                                        type='button'
                                        onClick={() => setUserSelectedVariant(variant)}

                                        className={`w-7 h-7 rounded-full border border-gray-300 transition-all duration-200 ${isActive ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-110"
                                            }`}
                                        style={{ backgroundColor: variant.hexCode || variant.color.toLowerCase() }}
                                    />

                                )
                            })}

                        </div>
                    </div>


                    {/* Size Selection Grid */}
                    <div className='mb-8'>
                        <h3 className="text-md mb-2 font-medium text-black">Sizes</h3>

                        {error && <span className="text-red-500 text-xs font-bold animate-bounce">{error}</span>}

                        <div className="flex flex-wrap gap-2 text-black">
                            {product?.size
                                ?.slice()    // we can't drectly sort the state so using slice create shallow copy then sort
                                .sort((a, b) => a - b)   // sort the size array
                                .map((item) => {
                                    // const isOutOfStock = item.stock <= 0;
                                    const isSelected = selectSize === item;

                                    return (
                                        <div
                                            key={item}
                                            onClick={() => {
                                                setSelectedSize(item)
                                                setError("")
                                            }}
                                            className={`w-9 h-9 flex items-center justify-center border rounded cursor-pointer transition-all
                                            ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700'}`}
                                        >
                                            {item}
                                            {/* {isOutOfStock && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-[1px] bg-gray-300 rotate-45"></div>
                                            </div>
                                        )} */}
                                        </div>
                                    )
                                })}
                        </div>
                    </div>


                    {/* Add to Cart Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#212a2f] text-white py-3 rounded-full font-bold text-lg hover:bg-black transition-all active:scale-[0.98] shadow-xl"
                    >
                        ADD TO CART
                    </button>

                    {/* Trust Badges */}
                    <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-200 pt-8">

                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                            <Icon icon="ph:truck-bold" className="size-5" />
                            FREE SHIPPING
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                            <Icon icon="ph:arrows-clockwise-bold" className="size-5" />
                            30-DAY RETURNS
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ProductDetailView