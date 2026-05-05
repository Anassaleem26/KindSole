import React, { useEffect, useState } from 'react'
import Input from '../ui/Input'
import { Icon } from '@iconify/react'
import configservice from '../../Firebase/Config-services'
import Card from '../ui/Card'


function Search() {

    const [allProducts, setAllProducts] = useState([])
    const [searchedProducts, setSearchedProducts] = useState([]) // searched shoes render state
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("") // saerch field value


    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true)
                setError(null)
                const products = await configservice.getAllProducts();
                setAllProducts(products)
                setSearchedProducts(products)

            } catch (error) {
                console.error("Search Error:", error);
            } finally {
                setIsLoading(false);
            }
        })()
    }, [])

    useEffect(() => {

        if (!searchTerm.trim()) {
            setSearchedProducts(allProducts)
            return;
        }

        const term = searchTerm.toLowerCase()
        const searchResult = allProducts.filter((shoe) => {


            const productName = shoe.productName?.toLowerCase() || ""

            let category = shoe.category?.toLowerCase() || ""
            if (term === "men" && category === "man") {   // 2no main sy user quch be likhy to search hojy
                return category === "man";
            }
             if (term === "women" && category === "woman") {
                return category === "woman";
            }

            const color = shoe.variants?.some(v => v.color.toLowerCase().includes(searchTerm.toLowerCase()))

            return productName.includes(term) || category === term || color

        })
        setSearchedProducts(searchResult)

    }, [searchTerm, allProducts])


    return (
        <div >
            <div className="w-full flex justify-center py-20">
                <div className="relative w-full max-w-3xl px-4">
                    <input
                        type="search"

                        placeholder="What are you looking for?"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        className="w-full text-2xl md:text-lg font-light py-4 outline-none border-b border-gray-400 focus:border-black transition-colors duration-300 placeholder:text-gray-400 pb-2 pt-6
                        [&::-webkit-search-cancel-button]:pr-12
                        [&::-webkit-search-cancel-button]:pt-2"
                    />

                    <div className="absolute right-6 top-1/2  ">
                        <Icon
                            icon="weui:search-filled"
                            className="size-6 text-[#3b62a5] "
                        />
                    </div>
                </div>
            </div>
            <div>

                {isLoading && (
                    <p className="text-center py-10 text-gray-500">
                        Loading products...
                    </p>
                )}

                {!isLoading && (
                    <div
                        className="flex overflow-x-auto px-10 py-10 gap-4 scrollbar-hide scroll-smooth">
                        {searchedProducts.length > 0 ? (
                            searchedProducts.map((product) => (
                                <div
                                    key={product.id || product.productId}
                                    className="flex-shrink-0 pb-5 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-12px)] lg:w-[calc(25%-12px)]"
                                >
                                    <Card data={product} className="w-full" />
                                </div>
                            ))
                        ) : (
                            !isLoading && <p className="w-full text-center text-gray-400">No products found matching your search.</p>
                        )}
                    </div>
                )}
                {error && <p className="text-red-600 mt-8 text-center"> {error} </p>}
            </div>
        </div>
    )
}

export default Search