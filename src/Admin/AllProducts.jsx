
// import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import Input from '../Components/ui/Input'
import configservice from '../Firebase/Config-services'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

function AllProducts() {



    const queryClient = useQueryClient();

    const { data: products = [], isLoading, error, isError } = useQuery({
        queryKey: ['products'],
        queryFn: () => configservice.getAllProducts()
    })


    const deleteMutation = useMutation({
        mutationFn: (id) => configservice.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },

    })

    const handleDelete = (id) => {
        toast("Are you sure?", {
            action: {
                label: "Delete",
                onClick: () => {
                    toast.promise(deleteMutation.mutateAsync(id), {
                        loading: 'Deleting Product...',
                        success: 'Product deleted successfully! ✅',
                        error: (err) => toast.error(`Deletion Failed: ${err.message || "Unknown error"}`)

                    });

                },
            },
            cancel: {
                label: "Cancel",
            },
        })
    }

    if (isLoading) return <div className="p-10 text-center">Products loading...</div>;

    if (isError) {
        return (
            <div className="p-10 text-center text-red-600">
                Error: {error?.message || "Something went wrong"}
            </div>
        );
    }

    return (
        <div>
            <div className='pb-7 flex justify-between '>
                <h1 className='text-3xl font-medium'>Manage Products</h1>

                <Link to="/admin-dashboard/add-products">
                    <button
                        className='flex items-center gap-1 text-white bg-black p-2 rounded-md cursor-pointer transition active:scale-95 duration-200 shadow-lg '
                    >
                        Add new Product
                        <Icon icon="mdi:plus" className="w-5 h-5" />
                    </button>
                </Link>
            </div>

            <div className='bg-white p-9 rounded-xl'>
                <div className='flex gap-3'>
                    <Input
                        label="Search"
                        type="search"
                        placeholder="Searh by product name, ID, category"
                        labelClassName="pb-[-3] text-sm"
                        className="h-8 w-129 flex flex-col"
                    />

                    <div className="flex flex-col  w-50">
                        <label className="mb-1 text-sm">Category</label>

                        <select
                            className="h-8 w-50 border border-gray-300 rounded-lg px-2 bg-white outline-none">
                            <option value="" disabled hidden>Select Category</option>
                            <option value="man">Man</option>
                            <option value="woman">Woman</option>
                        </select>

                    </div>

                    <div className="flex flex-col  w-50">
                        <label className="mb-1 text-sm">Stock Status</label>

                        <select
                            className="h-8 w-50 border border-gray-300 rounded-lg px-2 bg-white outline-none">
                            <option value="" disabled hidden>Select Stock</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>

                    </div>

                </div>

                <div>
                    <div className="overflow-x-auto min-h-screen rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-gray-900">Products</th>
                                    <th className="px-4 py-3 font-medium text-gray-900">Category</th>
                                    <th className="px-4 py-3 font-medium text-gray-900">Price (Reg/Disc)</th>
                                    <th className="px-4 py-3 font-medium text-gray-900">Color/Size</th>
                                    <th className="px-4 py-3 font-medium text-gray-900">Stock</th>
                                    <th className="px-4 py-3 font-medium text-gray-900">Action</th>
                                </tr>
                            </thead>


                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-hide w-44 shrink-0 px-1">

                                                    {product.variants?.map((variant, idx) => (
                                                        <div key={idx} className="relative shrink-0">
                                                            <img
                                                                src={variant.imageUrl}
                                                                alt={variant.color}
                                                                className="h-11 w-11 rounded-md object-cover border border-gray-200 shadow-sm hover:border-black transition-all cursor-pointer"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Fixed Name Section */}
                                                <div className="flex flex-col min-w-37.5">
                                                    <span className="font-bold text-gray-900 text-sm leading-tight">
                                                        {product.productName}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                                                        {product.variants?.length || 0} Variants
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-4">
                                            <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold capitalize">
                                                {product.category}
                                            </span>
                                        </td>

                                        {/* Pricing Logic (Discount aware) */}
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                {product.discountPrice && product.discountPrice !== "" ? (
                                                    <>
                                                        <span className="text-sm font-bold text-black">${product.discountPrice}</span>
                                                        <span className="text-[13px] text-gray-400 line-through">${product.regularPrice}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-bold text-black">${product.regularPrice}</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Sizes & Color Swatches */}
                                        <td className="px-4 py-4">
                                            <div className="space-y-1.5">
                                                <div className="flex gap-1">
                                                    {product.variants?.map((v, i) => (
                                                        <span
                                                            key={i}
                                                            className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: v.color.toLowerCase() }}
                                                            title={v.color}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-medium">
                                                    {product.size?.join(', ') || 'N/A'}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Stock Status */}
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase w-fit ${Number(product.stock) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {Number(product.stock) > 0 ? 'Active' : 'Stock Out'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 mt-1 font-medium">{product.stock} Units</span>
                                            </div>
                                        </td>

                                        {/* Action Buttons */}
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link to={`/admin-dashboard/EditProduct/${product.id}`}>
                                                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors" title="Edit">
                                                        <Icon icon="mdi:pencil-outline" className="w-5 h-5" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AllProducts

