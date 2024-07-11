import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth"
import { auth } from "../services/firebase"

const registerForm = document.getElementById("register-form")

const unsubscribe = onAuthStateChanged(auth, (user) => {
	if (user) {
		window.location.href = "/"
	}

	unsubscribe()
})

registerForm.addEventListener("submit", async (e) => {
	e.preventDefault()

	const formData = new FormData(registerForm)

	const name = formData.get("name")
	const email = formData.get("email")
	const password = formData.get("password")

	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password)

		await updateProfile(userCredential.user, {
			displayName: name,
		})

		window.location.href = "/"
	} catch (error) {
		alert("Falha ao criar usuário")
		console.log(error)
	}
})
