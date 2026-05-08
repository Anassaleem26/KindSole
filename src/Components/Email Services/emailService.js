import emailjs from '@emailjs/browser'
import { firebaseConfig } from '../../lib/fireBaseConfig'

const serviceID = firebaseConfig.emailJsServiceId
const templateID = firebaseConfig.emailJsTemplateId
const publicKey = firebaseConfig.emailJsPublicKey


export const sendOrderEmail = async (orderData, orderId) => {

    try {
        const templateParams = {
            logo_url: "https://res.cloudinary.com/dekcq3jub/image/upload/v1778238016/ximrxlecxtj1mhvuh35u.png",
            to_name: orderData.customerInfo.firstName,
            to_email: orderData.customerInfo.email,
            order_id: orderId,
            total_price: orderData.totalPrice,

            order_items: orderData.orderItems.map(item => ({
                name: item.productName,
                price: item.finalPrice,
                quantity: item.quantity || 1,
                image: item.imageUrl,
                size: item.size,
                
            })),
            cost_shipping: orderData.shippingFee,

        }
        const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
        console.log("Email Sent Successfully!", response.status, response.text);

        return true;

    } catch (error) {
        console.error("EmailJS Error:", error);
        return false;
    }
}