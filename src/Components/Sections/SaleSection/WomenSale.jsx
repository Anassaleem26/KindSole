import React, { useEffect, useState } from 'react'
import saleBanner from '../../../assets/Sale section/Women shoes sale.png';
import { Button, Card } from '../../../index'
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import configservice from '../../../Firebase/Config-services';

function WomenSale() {

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true)
                setError(null)
                const fetchedProducts = await configservice.getProductByCategory("woman");
                if (fetchedProducts) {
                    const discountProducts = fetchedProducts.filter((product) => Number(product.discountPrice) > 0)
                    setProducts(discountProducts)
                }

            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    return (
        <div>
            <div className="relative h-130 pb-22 w-full flex justify-center items-end  ">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url("${saleBanner}")`,
                        backgroundPosition: 'center',
                        backgroundSize: 'contain ',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>
               
            </div>

            <div className='flex -mt-5'>
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

export default WomenSale