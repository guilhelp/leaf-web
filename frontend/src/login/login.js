import { auth } from "../services/firebase"

import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"

const loginForm = document.getElementById("login-form")

const unsubscribe = onAuthStateChanged(auth, (user) => {
	if (user) {
		window.location.href = "/"
	}

	unsubscribe()
})

loginForm.addEventListener("submit", async (e) => {
	e.preventDefault()

	const formData = new FormData(loginForm)

	const email = formData.get("email")
	const password = formData.get("password")

	try {
		await signInWithEmailAndPassword(auth, email, password)

		window.location.href = "/"
	} catch (error) {
		alert("Falha ao entrar")
		console.log(error)
	}
})
