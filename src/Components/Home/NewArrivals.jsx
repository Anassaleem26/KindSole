import React, { useEffect, useState, useRef } from 'react'
import Card from '../ui/Card'
import configservice from '../../Firebase/Config-services'
import { Icon } from '@iconify/react'

function NewArrivals() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await configservice.getNewArrivals()
                setProducts(data || [])
            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const scroll = (direction) => {

        const { current } = scrollRef;

        const scrollAmount = current.offsetWidth;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading) {

        return (
            <div className='flex overflow-x-auto px-10 py-10 gap-4 scrollbar-hide scroll-smooth'>
            {[...Array(4)].map((_, index) => (
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
                ))}
            
          </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4 relative group pb-14 ">
            <div className="flex justify-between items-center mb-7">
                <h2 className="text-3xl font-bold text-black uppercase">New Arrivals</h2>
            </div>

            <div className="relative">
                {/* Left Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white shadow-xl border border-gray-100 hover:bg-black hover:text-white transition-all duration-300 hidden group-hover:flex items-center justify-center"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>

                {/* Cards Container */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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

                {/* Right Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white shadow-xl border border-gray-100 hover:bg-black hover:text-white transition-all duration-300 hidden group-hover:flex items-center justify-center"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    )
}

export default NewArrivals