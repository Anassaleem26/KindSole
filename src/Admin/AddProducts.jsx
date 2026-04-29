import React, { useState } from 'react'
import Input from '../Components/ui/Input'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import configservice from '../Firebase/Config-services'
import storageservice from '../Firebase/Storage-services'
import { toast } from 'sonner'

function AddProduct({ product }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            productName: product?.productName || "",
            category: product?.category || "",
            regularPrice: product?.regularPrice || "",
            discountPrice: product?.discountPrice || "",
        }
    })

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)


    const [variants, setVariants] = useState(product?.variants || [{ color: '', imageFile: null, existingUrl: '' }]);

    const addVariantRow = () => {
        setVariants([...variants, { color: '', imageFile: null, existingUrl: '' }]);
    };



    // variant color
    const updateVariant = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };



    // Remove complete variant 
    const removeVariant = (index) => {
        if (variants.length > 0) {
            setVariants(variants.filter((_, i) => i !== index));
        }
    };

    // --- Size Logic (Unchanged but kept clean) ---
    const avaliableSizes = [6, 7, 8, 9, 10, 11, 12, 13, 14];
    const [selectedSizes, setSelectedSizes] = useState(product?.size || []);

    const handleSizeChange = (size) => {
        const updatedSizes = selectedSizes.includes(size)
            ? selectedSizes.filter((s) => s !== size)
            : [...selectedSizes, size];
        setSelectedSizes(updatedSizes);
    };

    // --- Submit Logic ---
    const submit = async (data) => {
        try {
            setLoading(true);
            setError("")
            const finalVariants = [];

            for (const variant of variants) {
                let imageUrl = variant.existingUrl;

                // New image file  upload 
                if (variant.imageFile) {
                    const uploadedUrls = await storageservice.uplaodFile([variant.imageFile]);
                    imageUrl = uploadedUrls[0];
                }

                if (variant.color && imageUrl) {
                    finalVariants.push({ color: variant.color.toLowerCase(), imageUrl });
                }
            }

            const finalProductData = {
                ...data,
                productName: data.productName.toLowerCase(),
                category: data.category.toLowerCase(),
                variants: finalVariants, // Ab colors aur images finalvariants ke andar hain
                size: selectedSizes,
                updatedAt: new Date().toISOString()
            };

            if (product?.productId) {
                await configservice.updateProduct(product.productId, finalProductData);
                toast.success("Product updated successfully!");
            } else {
                await configservice.addProduct(finalProductData);
                toast.success("Product added successfully!");
            }

            navigate("/admin-dashboard/products");
        } catch (error) {
            console.error("Submit Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <h1 className='text-3xl font-medium mb-7'>Add Product</h1>

            <form onSubmit={handleSubmit(submit)} className='bg-white p-9 rounded-xl flex flex-col gap-8 shadow-sm'>
                <div className='flex gap-8'>

                    {error && <p className="text-red-600 mt-8 text-center"> {error} </p>}

                    <div className='w-1/2 space-y-4'>
                        <Input
                            label="Product Name"
                            placeholder="Product name"
                            {...register("productName", { required: true })}
                        />
                        {errors.productName?.message && <p className="text-red-600 mt-8 text-center"> {errors.productName.message} </p>}

                        <div className="flex flex-col">
                            <label className="mb-1 text-sm">Category</label>
                            <select
                                {...register("category", { required: true })}
                                className="h-10 border border-gray-300 rounded px-2 bg-white outline-none">
                                <option value="man">Man</option>
                                <option value="woman">Woman</option>
                            </select>
                            {errors.category?.message && <p className="text-red-600 mt-8 text-center"> {errors.category.message} </p>}
                        </div>

                        <div className='p-5 border rounded-lg bg-[#f4f4f4] space-y-4'>
                            <h3 className='font-medium text-lg text-black'>Pricing</h3>
                            <div className='flex gap-5 text-black'>
                                <Input
                                    label="Regular Price ($)"
                                    type='number'
                                    {...register("regularPrice", { required: true })}
                                />
                                {errors.regularPrice && <p className="text-red-600 mt-8 text-center"> {errors.regularPrice.message} </p>}

                                <Input
                                    label="Discount Price ($)"
                                    type='number'
                                    {...register("discountPrice")}
                                />
                                {errors.discountPrice?.message && <p className="text-red-600 mt-8 text-center"> {errors.discountPrice.message} </p>}
                            </div>
                        </div>
                    </div>







                    {/* Sizes Section */}
                    <div className='w-1/2 space-y-6'>

                        <div className='pt-2'>
                            <h3 className="text-md mb-2 font-medium text-black">Sizes</h3>
                            <div className="flex flex-wrap gap-2 text-black">
                                {avaliableSizes.map((size) => (
                                    <div
                                        key={size}
                                        onClick={() => handleSizeChange(size)}
                                        className={`w-9 h-9 flex items-center justify-center border rounded cursor-pointer transition-all ${selectedSizes.includes(size) ? "bg-black text-white" : "bg-white text-black hover:border-black"
                                            }`}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                            {errors.sizes?.message && <p className="text-red-600 mt-8 text-center"> {errors.sizes.message} </p>}
                        </div>



                        {/* Right Side: Variants (Color + Image) */}

                        <div className='pt-5'>
                            <div className='flex justify-between items-center mb-3 text-black'>
                                <label className="text-sm font-medium">Product Variants (Colors & Images)</label>
                                <button type="button" onClick={addVariantRow} className="text-xs bg-black text-white px-2 py-1 rounded">+ Add Variant</button>
                            </div>

                            <div className='space-y-3'>
                                {variants.map((v, index) => (
                                    <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border relative">

                                        {/* Color Dropdown/Input */}

                                        <input
                                            type="text"
                                            placeholder="Color (e.g. Red)"
                                            className="w-1/3 border p-1 text-sm rounded bg-white text-black outline-none"
                                            value={v.color}
                                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                            // {...register("color", { required: true })}
                                        />

                                        {errors.color?.message && <p className="text-red-600 mt-8 text-center"> {errors.color.message} </p>}

                                        {/* Image Upload for this specific color */}
                                        
                                        <div className="flex-1 flex items-center gap-2">
                                            <label className="cursor-pointer bg-white border px-2 py-1 text-xs rounded hover:bg-gray-100 text-black">
                                                {v.imageFile ? "Image Selected" : (v.existingUrl ? "Change Image" : "Upload Image")}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => updateVariant(index, 'imageFile', e.target.files[0])}
                                                    // {...register("file", { required: true })}
                                                />
                                                {errors.file?.message && <p className="text-red-600 mt-8 text-center"> {errors.file.message} </p>}
                                            </label>

                                            {(v.imageFile || v.existingUrl) && (
                                                <img
                                                    src={v.imageFile ? URL.createObjectURL(v.imageFile) : v.existingUrl}
                                                    className="w-8 h-8 rounded object-cover"
                                                />
                                            )}
                                        </div>

                                        <button type="button" onClick={() => removeVariant(index)} className="text-red-500 font-bold px-2 text-black">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>

                {/* Footer Buttons */}
                <div className='flex gap-4 justify-end border-t pt-6'>
                    <button type="button" onClick={() => navigate(-1)} className='px-6 py-2 border rounded-lg text-black'>Cancel</button>
                    <button type="submit" disabled={loading} className='bg-black text-white px-8 py-2 rounded-lg shadow-lg hover:bg-gray-800 disabled:bg-gray-500'>
                        {loading ? "Processing..." : (product ? "Update Product" : "Publish Product")}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProduct