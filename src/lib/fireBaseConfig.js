import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {

  // Firebase config
  apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: String(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),



  // Cloudinary config
  cloudinaryCloudName: String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME),
  cloudinaryPresetName: String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME),



  //Strip using payment method handle
  stripePublicKey: String(import.meta.env.VITE_STRIPE_PUBLIC_KEY),



  //EmailJs service id
  emailJsServiceId: String(import.meta.env.VITE_EMAILJS_SERVICE_ID),
  emailJsTemplateId: String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID),
  emailJsPublicKey: String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY),

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export these so you can use them in your components
export const auth = getAuth(app);
export const database = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);