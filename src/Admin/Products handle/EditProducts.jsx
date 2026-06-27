import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import configservice from '../../Firebase/Config-services';
import AddProduct from './AddProducts';

function EditProducts() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const fetchProduct = await configservice.getProduct(id);
                if (fetchProduct) {
                    setProduct({ productId: id, ...fetchProduct })
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        })()
    }, [id])

    if (loading) return <div className="p-10 text-center">Loading product details...</div>;
    if (!product) return <div className="p-10 text-center text-red-500">Product not found!</div>;

    return (
        <AddProduct product={product}/>
    )
}

export default EditProducts