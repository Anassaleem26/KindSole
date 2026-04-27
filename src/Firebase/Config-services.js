import { database } from "../lib/fireBaseConfig";
import { doc, getDoc, getDocs, setDoc, collection, deleteDoc, updateDoc, query, where, orderBy, limit } from "firebase/firestore"


export class ConfigServices {

    constructor() {
        this.database = database;
        this.collectionName = "Products";
    }



    async addProduct(ProductData) {
        try {
            let productRef = doc(collection(this.database, this.collectionName))

            await setDoc(productRef, {
                ...ProductData,
                productId: productRef.id,
                createdAt: new Date().toISOString()
            })
            return productRef.id

        } catch (error) {
            console.error("Config-Service :: addProduct :: error", error);
            throw error;
        }
    }




    async getProduct(id) {
        try {
            let productRef = doc(this.database, this.collectionName, id);
            let product = await getDoc(productRef)
            return product.exists() ? product.data() : null;

        } catch (error) {
            console.error("Config-Service :: getProduct :: error", error);
            throw error;
        }
    }




    async getAllProducts() {
        try {
            let productRef = await getDocs(collection(this.database, this.collectionName))
            return productRef.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        } catch (error) {
            console.error("Config-Service :: getAllProducts :: error", error);
            throw error;
        }
    }


    async getProductByCategory(categoryName) {
        try {
            const q = query(
                collection(this.database, this.collectionName),
                where("category", "==", categoryName)
            )
            const products = await getDocs(q)
            return products.docs.map(doc => ({ id: doc.id, ...doc.data() }));


        } catch (error) {
            console.error("Config-Service :: getProductByCategory :: error", error);
            throw error;
        }
    }


    async getSaleProducts() {
        try {
            const q = query(
                collection(this.database, this.collectionName),
                where("onSale", "==", true)
            )
            const products = await getDocs(q)
            return products.docs.map(doc => ({ id: doc.id, ...doc.data() }))


        } catch (error) {
            console.error("Config-Service :: getSaleProducts :: error", error);
            throw error;
        }
    }



    async getAvailableSizes(productId) {
        try {
            const product = await this.getProduct(productId)
            return product && product.availableSizes ? product.availableSizes : [];

        } catch (error) {
            console.error("Config-Service :: getAvailableSizes :: error", error);
            return [];
        }
    }


    
    async getNewArrivals() {
        try {
            const q = query(
                collection(this.database, this.collectionName),
                orderBy("createdAt", "desc"),
                limit(8)
            )
            const products = await getDocs(q)
            return products.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        } catch (error) {
            console.error("Config-Service :: getNewArrivals :: error", error);
            throw error;
        }
    }



    async updateProduct(id, updateFields) {
        try {
            let productRef = doc(this.database, this.collectionName, id);
            await updateDoc(productRef, updateFields)

            return true

        } catch (error) {
            console.error("Config-Service :: updateProduct :: error", error);
            throw error;
        }
    }
    



    async updateStock(productId, newQuantity) {
        try {
            const productRef = doc(this.database, this.collectionName, productId)
            await updateDoc(productRef, { stock: newQuantity })
            return true

        } catch (error) {
            console.error("Config-Service :: updateStock :: error", error);
            throw error;
        }
    }




    async deleteProduct(id) {
        try {
            let productRef = doc(this.database, this.collectionName, id);
            await deleteDoc(productRef)

            return true

        } catch (error) {
            console.error("Config-Service :: deleteProduct :: error", error);
            throw error;
        }
    }

}

const configservice = new ConfigServices()
export default configservice