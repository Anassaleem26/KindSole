import React, { useEffect, useState } from 'react'
import Input from '../Components/ui/Input'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import configservice from '../Firebase/Config-services'
import storageservice from '../Firebase/Storage-services'

function AddProduct({ product }) {

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            productName: product?.productName || "",
            category: product?.category || "",
            regularPrice: product?.regularPrice || "",
            discountPrice: product?.discountPrice || "",
        }
    })

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [imageFiles, setImageFiles] = useState([])
    const [existingImage, setExistingImage] = useState([])



    // ---------------------------------------------------------------------------------------------------
    // Color handle 

    const [addColorPopup, setAddColorPopup] = useState(false)
    const [colors, setColors] = useState([])
    const [colorInput, setColorInput] = useState("")


    const handleColor = () => {
        if (colorInput.trim() === "") return;

        setColors([...colors, colorInput])
        setColorInput("");
        setAddColorPopup(false);
    };
    const removeColor = (indexToRemove) => {
        const updateColor = colors.filter((_, index) => index !== indexToRemove)
        setColors(updateColor)
    }



    // ---------------------------------------------------------------------------------------------------
    // Handle Sizes

    const avaliableSizes = [6, 7, 8, 9, 10, 11, 12, 13, 14];
    const [seletedSizes, setSelectedSizes] = useState([]);

    const handleSizeChange = (size) => {
        const updatedSizes = seletedSizes.includes(size)
            ? seletedSizes.filter((s) => s !== size)
            : [...seletedSizes, size];

        setSelectedSizes(updatedSizes);

        const valueToStore = updatedSizes.length > 0 ? updatedSizes : "";
        setValue("size", valueToStore, { shouldValidate: true });
    };


    // ---------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (product && product.productId) {

            reset({
                productName: product.productName,
                category: product.category,
                regularPrice: product.regularPrice,
                discountPrice: product.discountPrice
            });

            setColors(product.colors || []);
            setSelectedSizes(product.size || []);
            setExistingImage(product.images || [])
        }
    }, [product?.productId, reset])



    // ---------------------------------------------------------------------------------------------------



    const submit = async (data) => {

        try {
            console.log(data);
            setError("")
            setLoading(true);
            let finalImageUrls = [...existingImage];

            if (imageFiles.length > 0) {
                const uploadedUrls = await storageservice.uplaodFile(imageFiles)
                if (uploadedUrls) {
                    finalImageUrls = [...finalImageUrls, ...uploadedUrls]
                }
            }
            const finalProductData = {
                ...data,
                colors,
                size: seletedSizes,
                images: finalImageUrls,
                updatedAt: new Date().toISOString()
            }

            if (product?.productId) {
                await configservice.updateProduct(product.productId, finalProductData)
                alert("update products sucessfully")

            } else {
                await configservice.addProduct(finalProductData)
                alert("product added sucessfully")
            }

            navigate("/admin-dashboard/products")

        } catch (error) {
            console.error("Submit Error:", error);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    // ---------------------------------------------------------------------------------------------------


    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-3xl font-medium'>Add Product</h1>
            </div>

            <form
                onSubmit={handleSubmit(submit)}
                className='bg-white p-9 rounded-xl'
            >

                <div className='flex gap-8 bg-white p-9 rounded-xl' >

                    {error && <p className="text-red-600 mt-8 text-center"> {error} </p>}


                    {/* Product Name  */}

                    <div className='w-1/2'>
                        <div className='w-full bg-white'>
                            <Input
                                label="Product Name"
                                placeholder="Product name"
                                labelClassName="pb-[-3] text-sm"
                                type='text'
                                className="h-8.75 w-100 flex flex-col ml-1"
                                {...register("productName", { required: true })}
                            />

                            {errors.productName && <p className="text-red-600 mt-8 text-center"> {errors.productName.message} </p>}

                            <div className="flex flex-col ml-1 w-100 mb-9">
                                <label className="mb-1 text-sm">Category</label>

                                <select
                                    {...register("category", { required: true })}
                                    className="h-8.75 w-100 border border-gray-300 rounded px-2 bg-white outline-none">
                                    <option value="" disabled hidden>Select Category</option>
                                    <option value="man">Man</option>
                                    <option value="woman">Woman</option>
                                </select>
                                {errors.category && (
                                    <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>
                                )}
                            </div>


                            {/* Pricing */}

                            <div className='w-100 p-5 border border-gray-100 rounded-lg bg-[#f4f4f4]'>
                                <h3 className='pb-5 font-medium text-lg'>Pricing</h3>
                                <div className='flex gap-5'>
                                    <Input
                                        label="Regular Price ($)"
                                        labelClassName="text-sm"
                                        type='number'
                                        className="h-7.5"
                                        {...register("regularPrice", { required: true })}
                                    />
                                    {errors.regularPrice && <p className="text-red-600 mt-8 text-center"> {errors.regularPrice.message} </p>}

                                    <Input
                                        label="Discount Price ($)"
                                        labelClassName="text-sm"
                                        type='number'
                                        className="h-7.5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-1/2'>
                        <div className="flex flex-col ml-1 w-100">
                            <label className="mb-1 text-sm">Colors</label>
                            <div className="h-8.75 flex items-center gap-2 flex-wrap border border-gray-300 pl-2 rounded-lg">
                                {colors.map((color, index) => (
                                    <div key={index} className="relative group">

                                        <span
                                            className="w-6 h-6 rounded border block"
                                            style={{ backgroundColor: color }}
                                            title={color}

                                        />

                                        <button
                                            type='button'
                                            onClick={() => removeColor(index)}
                                            className="absolute -top-1 -right-1 bg-black text-white text-[13px] w-3 h-3 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100"
                                        >
                                            ×
                                        </button>

                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setAddColorPopup(true)}
                                    className="w-6 h-6 flex items-center justify-center border rounded text-lg cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {addColorPopup && (
                            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                <div className="bg-white p-4 rounded w-80 shadow-xl">
                                    <h2 className="text-lg mb-3 font-medium">Add Color</h2>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={colorInput}
                                        onChange={(e) => setColorInput(e.target.value)}
                                        placeholder="Enter color (red, #ff0000)"
                                        className="border w-full p-2 mb-3 outline-none rounded"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setAddColorPopup(false)}
                                            className="px-4 py-1.5 text-sm hover:bg-gray-100 rounded transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleColor}
                                            className="bg-black text-white px-4 py-1.5 text-sm rounded shadow hover:bg-gray-800 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='pt-8 pb-8'>
                            <h3 className="text-sm mb-2 font-medium">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {avaliableSizes.map((size) => {
                                    const isSelected = seletedSizes.includes(size);
                                    return (
                                        <div
                                            key={size}
                                            onClick={() => handleSizeChange(size)}
                                            className={`w-8 h-8 flex items-center justify-center border rounded cursor-pointer transition-all duration-200 select-none ${isSelected
                                                ? "bg-black text-white border-black scale-105"
                                                : "bg-white text-black hover:border-black"} `}
                                        // {...register("size", { required: true })}
                                        >
                                            {size}
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.size && (
                                <p className="text-red-600 text-xs mt-2 font-medium">
                                    {errors.size.message}
                                </p>
                            )}
                        </div>


                        <div>
                            <label className="text-sm font-medium">Images</label>
                            <div className="grid grid-cols-4 gap-2 mt-2">

                                {[...existingImage, ...Array.from(imageFiles).map(f => URL.createObjectURL(f))].map((img, i) => (
                                    <img key={i} src={img} className="w-full h-16 object-cover rounded-lg border" />
                                ))}
                                <label className="w-full h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                    <span className="text-xl">+</span>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            setImageFiles((prev) => [...prev, ...files]);
                                        }}
                                        accept="image/*" />
                                </label>
                            </div>
                        </div>


                    </div>
                </div>

                <div className='flex gap-4 justify-end mt-4'>
                    <button
                        type="button"
                        className='px-6 py-2.5 border border-gray-200 rounded-lg cursor-pointer transition active:scale-95 duration-200 hover:bg-gray-50'
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className='bg-black text-white px-8 py-2.5 rounded-lg cursor-pointer transition active:scale-95 duration-200 shadow-lg hover:bg-gray-800'
                    >
                        {/* {loading ? "Uploading..." : (product ? "Update Product..." : "Publish Product")} */}
                        {loading ? "Uploading..." : "Publish Product"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProduct