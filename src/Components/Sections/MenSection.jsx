import React, { useEffect, useState } from 'react'
import bgImage from '../../assets/men section bg-img/pexels-tahchuy-8584705.jpg';
import configservice from '../../Firebase/Config-services';
import Card from '../ui/Card';
import { Icon } from '@iconify/react';

function MenSection() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true)
                setError(null)

                const fetchedProducts = await configservice.getProductByCategory("man")
                if (fetchedProducts) setProducts(fetchedProducts)
                    
            } catch (err) {
                setError("Failed to load products. Please try again later.")
                console.error("Failed to fetch products:", err)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    return (
        <div>
            {/* Hero Section */}
            <div className="relative h-120 pb-9 w-full flex items-end justify-start mb-5">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url("${bgImage}")`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>
                <div className="relative z-10 flex flex-col pl-19 gap-1 ">
                    <h2 className='text-4xl uppercase text-white'> Men's Shoes</h2>
                    <p className='text-white'>Sustainable, supportive, and wildly comfortable...</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className='flex px-10'>
                <div className='border border-gray-400 rounded-l h-12 flex-grow flex justify-center items-center text-sm text-gray-400'>
                    Built for movement, designed for confidence
                </div>
                <button className='border-t border-b border-r border-gray-400 h-12 w-48 flex justify-center items-center text-sm text-gray-400'>
                    SORT BY
                    <Icon icon="heroicons:chevron-down-20-solid" className="size-5 ml-1" />
                </button>
                <button className='border-t border-b border-r border-gray-400 rounded-r h-12 w-48 flex justify-center items-center text-sm text-gray-400'>
                    FILTER
                </button>
            </div>

            {/* Product Grid / Loading State */}
            <div className="flex overflow-x-auto px-10 py-10 gap-4 scrollbar-hide scroll-smooth">
                {isLoading ? (
                    // --- BEST PRACTICE: SKELETON LOADING ---
                    [...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-12px)] lg:w-[calc(25%-12px)] animate-pulse"
                        >
                            <div className="bg-gray-200 aspect-square rounded-lg mb-4 flex items-center justify-center">
                                <Icon icon="svg-spinners:ring-resize" className="text-gray-300 size-8" />
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))
                ) : (
                    // --- ACTUAL PRODUCTS ---
                    products.map((product) => (
                        <div
                            key={product.id || product.productId}
                            className="flex-shrink-0 pb-5 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-12px)] lg:w-[calc(25%-12px)]"
                        >
                            <Card data={product} className="w-full" />
                        </div>
                    ))
                )}
            </div>

            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        </div>
    )
}

export default MenSection