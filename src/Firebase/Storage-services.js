import firebaseConfig from "../lib/fireBaseConfig"

export class StorageService {

    constructor() {
        this.cloudName = firebaseConfig.cloudinaryCloudName;
        this.uploadPreset = firebaseConfig.cloudinaryPresetName
    }

    async uplaodFile(file) {
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", this.uploadPreset);

            const uploadURL = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

            const responce = await fetch(uploadURL, {
                method: 'POST',
                body: formData
            })

            if (!responce.ok) {
                throw new Error("Cloudinary upload failed");
            }

            const data = await responce.json()

            return data

        } catch (error) {
            console.log("Cloudinary service :: uploadFile :: error", error);
            return false;
        }
    }


    async deleteFile(publicId) {
        if (!publicId) return false;
        // console.log("Manual Cleanup Required for Public ID:", publicId);
        return true;
    }

}

const storageservice = new StorageService()
export default storageservice