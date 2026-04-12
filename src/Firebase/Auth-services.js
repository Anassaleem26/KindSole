import { auth } from "../lib/fireBaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";

export class AuthServices {
    auth;
    constructor() {
        this.auth = auth;
    }


    async createAccount({ email, password, firstname, lastname }) {
        try {
            const reponse = await createUserWithEmailAndPassword(this.auth, email, password,)
            const user = reponse.user;

            if (user) {
                await updateProfile(user, {
                    displayName: `${firstname} ${lastname}`
                })

                return await this.login({ email, password })

            }

            return user;

        } catch (error) {
            console.log("Firebase service :: createAccount :: error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const loginUser = await signInWithEmailAndPassword(this.auth, email, password)

            return loginUser;

        } catch (error) {
            console.log("Firebase service :: login :: error", error);
            throw error;
        }
    }

    async logout() {
        try {
            await signOut(this.auth)
            return true;

        } catch (error) {
            console.log("Firebase service :: logout :: error", error);
            return false;
        }
    }

    async getCurrentUser() {
        try {
            return new Promise((resolve, reject) => {
                let unsubscribe = onAuthStateChanged(this.auth, (user) => {
                    unsubscribe();
                    if (user) {
                        resolve(user)
                    } else {
                        resolve(null)
                    }
                }, reject)
            })
        } catch (error) {
            console.log("Firebase service :: getCurrentUser :: error", error);
        }
    }
}

const authservice = new AuthServices();
export default authservice