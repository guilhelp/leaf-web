import { auth } from "../services/firebase"
import { deleteUser, onAuthStateChanged } from "firebase/auth"
import { API_URL } from "../main"
import { FirebaseError } from "firebase/app"
import { fileToBase64 } from "../utils/fileToBase64"

const profilePicture = document.getElementById("profile-picture")

const loggedUserActions = document.querySelector("#logged-user-actions")

const logoutButton = loggedUserActions.querySelector("#logout-button")
const editButton = loggedUserActions.querySelector("#edit-button")
const deleteButton = loggedUserActions.querySelector("#delete-account-button")
const editPopup = document.querySelector("#edit-popup")
const editPopupForm = document.querySelector("#edit-popup-form")

const nameInfo = document.querySelector("#name-info")
const emailInfo = document.querySelector("#email-info")
const pictureInfo = document.querySelector("#picture-info")

const nameInput = document.querySelector("#name-input")
const emailInput = document.querySelector("#email-input")
const picturePreview = document.querySelector("#picture-preview")
const pictureInput = document.querySelector("#picture-input")

const postsContainer = document.getElementById("posts-container")

const unsubscribe = onAuthStateChanged(auth, (user) => {
	unsubscribe()

	if (!user) {
		window.location.href = "/login/index.html"
		return
	}

	profilePicture.src = user.photoURL

	fetchUser()
})

async function fetchUser() {
	editPopupForm.reset()
	const params = new URLSearchParams(window.location.search)
	const id = params.get("id") ?? auth.currentUser.uid

	try {
		const token = await auth.currentUser.getIdToken()
		const res = await fetch(`${API_URL}/users/${id}`, {
			headers: {
				Authorization: "Bearer " + token,
			},
		})

		const user = await res.json()

		console.log(user)

		nameInfo.textContent = user.displayName
		emailInfo.textContent = user.email
		pictureInfo.src = user.photoURL

		nameInput.value = user.displayName
		emailInput.value = user.email
		picturePreview.src = user.photoURL

		if (id === auth.currentUser.uid) {
			loggedUserActions.classList.remove("hidden")
			loggedUserActions.classList.add("flex")
			profilePicture.src = user.photoURL
		}

		postsContainer.innerHTML = null

		user.posts.forEach((post) => {
			postsContainer.innerHTML += `
				<a href="/post/?id=${post.id}">
					<article data-post-id="${post.id}" class="rounded-xl border border-black divide-y divide-black">
						<header class="bg-lime-300 flex items-center px-6 py-3 rounded-t-xl">
							<img class="bg-lime-300 border border-black h-10 w-10 rounded-full" src="${post.author.photoURL}" alt="">
							<span class="ml-2">${post.author.displayName}</span>
						</header>
						${
							post.imageUrl
								? `
						<img
							src="${post.imageUrl}"
							alt=""
							class="w-full aspect-video object-cover"
						/>
							`
								: ""
						}
						
						<div class="bg-lime-100 rounded-b-xl px-6 py-4">
							${post.content ? `<p class="mb-3">${post.content}</p>` : ""}
							<div class="flex -ml-2 gap-x-2">
								<button class="px-2 py-1">
									<i class="ri-message-2-line text-xl align-middle leading-none"></i>
									<span>${post.comments.length}</span>
								</button>
	
								<button id="like-button" class="px-2 py-1">
									<i class="ri-heart-line text-xl align-middle leading-none"></i>
									<span id="likes-count">${post.likesCount}</span>
								</button>
							</div>
						</div>
					</article>
				</a>
			`
		})
	} catch (error) {
		alert("Erro ao buscar usuário")
		console.log(error)
	}
}

editPopup.addEventListener("click", (e) => {
	if (e.target != editPopup) return

	editPopup.classList.add("hidden")
	editPopup.classList.remove("flex")
})

editPopupForm.addEventListener("submit", async (e) => {
	e.preventDefault()

	const formData = new FormData(editPopupForm)

	const picture = formData.get("picture")
	const name = formData.get("name")
	const email = formData.get("email")
	const password = formData.get("password")

	try {
		const token = await auth.currentUser.getIdToken()
		const res = await fetch(`${API_URL}/users`, {
			method: "PATCH",
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				photoData: (await fileToBase64(picture)).split(";base64,").pop(),
				displayName: name,
				email,
				password,
			}),
		})

		const user = await res.json()

		editPopup.classList.add("hidden")
		editPopup.classList.remove("flex")

		fetchUser()
	} catch (error) {
		alert("Erro ao editar")
		console.log(error)
	}
})

logoutButton.addEventListener("click", logout)

editButton.addEventListener("click", () => {
	editPopup.classList.remove("hidden")
	editPopup.classList.add("flex")
})

pictureInput.addEventListener("change", async (e) => {
	const file = e.target.files[0]
	const base64 = await fileToBase64(file)
	picturePreview.src = base64
})

async function logout() {
	try {
		await auth.signOut()
		window.location.href = "/login/index.html"
	} catch (error) {
		alert("Erro ao sair")
		console.log(error)
	}
}

deleteButton.addEventListener("click", async () => {
	if (!confirm("Deseja excluir sua conta? Essa ação é irreversível.")) {
		return
	}

	try {
		await deleteUser(auth.currentUser)
		window.location.href = "/login/index.html"
	} catch (error) {
		console.log(error)

		if (error instanceof FirebaseError) {
			if (error.code === "auth/requires-recent-login") {
				alert("Confirme seus dados e tente novamente.")
				await logout()
				window.location.href = "/login/index.html"
				return
			}
		}

		alert("Erro ao deletar conta")
	}
})
