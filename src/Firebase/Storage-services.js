import { storage } from "../lib/fireBaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export class StorageService {
    constructor() {
        this.storage = storage;
        this.bestFolder = "product-images";
    }


    async uploadFile(file) {

        if (file) return null

        try {

            const fileName = `${Date.now()}-${file.name}`
            const fileRef = ref(this.storage, `${this.bestFolder}/${fileName}`);

            const loadFile = await uploadBytes(fileRef, file)
            const fileUrl = await getDownloadURL(loadFile.ref)

            return {
                url: fileUrl,
                fileName: fileName
            }
        } catch (error) {
            console.error("StorageService :: uploadFile :: error", error);
            throw error;
        }

    }


    async deleteFile(fileName) {
        if (fileName) return false
        try {
            const fileRef = ref(this.storage, `${this.bestFolder}/${fileName}`);
            await deleteObject(fileRef);
            return true

        } catch (error) {
            console.error("StorageService :: deleteFile :: error", error);
            throw error;
        }
    }


    async updateFile(oldFileName, newFile) {
        try {
            if (oldFileName) {
                await this.deleteFile(oldFileName)
            }
            return await this.uploadFile(newFile)

        } catch (error) {
            console.error("StorageService :: updateFile :: error", error);
            throw error;
        }
    }
}

const storageservice = new StorageService();
export default storageservice