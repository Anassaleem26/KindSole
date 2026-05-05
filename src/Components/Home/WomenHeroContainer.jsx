import React, { useEffect, useRef, useState } from 'react'
import WomenSectionBg from '../../../src/assets/woamn section bg-img/87654.png';
import Card from '../ui/Card';
import configservice from '../../Firebase/Config-services';
import { Link } from 'react-router-dom';

function WomenHeroContainer() {


    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([])
    const scrollRef = useRef(null)

    useEffect(() => {
        (async () => {

            try {
                setLoading(true)
                const products = await configservice.getProductByCategory("woman")
                if (products) setProducts(products)


            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setLoading(false)
            }

        })()
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

    return (
        <div>

            <div className="relative h-100 pb-6 w-full flex items-end justify-center">

                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url("${WomenSectionBg}")`,
                        backgroundPosition: 'bottom',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>

                <div className="relative z-10 flex flex-col items-center">
                    <Link to="/womensection">
                        <button className="btn btn-primary w-full sm:w-auto px-10 transition-all hover:scale-105 bg-gray-800 h-10 rounded-[20px] text-[17px] opacity-90 text-white">
                            Shop Woman
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex w-full h-120 overflow-hidden pb-4">

                <div className="w-1/2 h-full overflow-hidden cursor-pointer">
                    <img
                        className="w-full h-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110"
                        src="/src/assets/woamn section bg-img/999999999.png"
                        alt="Men 1"
                    />
                </div>

                <div className="w-1/2 h-full overflow-hidden cursor-pointer ">
                    <img
                        className="w-full h-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110"
                        src="/src/assets/woamn section bg-img/Gemini_Generated_Image_crnrjrcrnrjrcrnr.png"
                        alt="Men 2"
                    />
                </div>

            </div>

            <div className='py-8 px-13'>
                <h2 className=' text-3xl font-bold text-black mb-7 uppercase'>Woman Shoes</h2>

                <div className='relative'>

                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white shadow-xl border border-gray-100 hover:bg-black hover:text-white transition-all duration-300 hidden group-hover:flex items-center justify-center"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>



                    {loading ? "waiting" :
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
                    }

                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-5 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white shadow-xl border border-gray-100 hover:bg-black hover:text-white transition-all duration-300 hidden group-hover:flex items-center justify-center"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }`}}
                />
            </div>

        </div>
    )
}

export default WomenHeroContainer