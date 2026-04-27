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
                
                const products = await configservice.getProductByCategory("man")
                if (products) setProducts(products)

            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    return (
        <div>
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
                    <h2
                        className=' text-4xl uppercase text-white'
                    > Men's Shoes</h2>

                    <p className='text-white'>Sustainable, supportive, and wildly comfortable, our sneakers are always ready when you are. </p>
                </div>
            </div>


            <div className='flex'>
                <div className='border border-gray-400 rounded-l h-12 w-242 flex justify-center items-center text-sm text-gray-400'>
                    Built for movement, designed for confidence
                </div>
                <button className='border border-gray-400  h-12 w-48 flex justify-center items-center text-sm text-gray-400'>
                    SORT BY
                    <Icon
                        icon="heroicons:chevron-down-20-solid"
                        className="size-5 text-gray-400  transition-transform duration-200"
                    />
                </button>

                <button className='border border-gray-400 rounded-r h-12 w-48 flex justify-center items-center text-sm text-gray-400'>
                    FILTER
                </button>
            </div>


            {isLoading && (
                <p className="text-center py-10 text-gray-500">
                    Loading products...
                </p>
            )}

            {!isLoading && (
                <div
                    className="flex overflow-x-auto px-10 py-10 gap-4 scrollbar-hide scroll-smooth"

                >
                    {products.map((product) => (
                        <div
                            key={product.id || product.productId}
                            className="flex-shrink-0 pb-5 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-12px)] lg:w-[calc(25%-12px)]"
                        >
                            <Card data={product} className="w-full" />
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="text-red-600 mt-8 text-center"> {error} </p>}
        </div>
    )
}

export default MenSection