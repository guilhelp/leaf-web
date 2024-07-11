import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
	apiKey: "AIzaSyD4oG9iazEkPO3Fb1hwz1h1lrHYBtXGhDI",
	authDomain: "leaf-web-6d772.firebaseapp.com",
	projectId: "leaf-web-6d772",
	storageBucket: "leaf-web-6d772.appspot.com",
	messagingSenderId: "391319421804",
	appId: "1:391319421804:web:f81efc491f2fd4b078a949",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
