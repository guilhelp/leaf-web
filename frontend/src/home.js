import { auth } from "./services/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { fileToBase64 } from "./utils/fileToBase64"
import { API_URL } from "./main"

const postsContainer = document.getElementById("posts-container")
const postForm = document.getElementById("post-form")

const profilePicture = document.getElementById("profile-picture")

const unsubscribe = onAuthStateChanged(auth, (user) => {
	unsubscribe()

	if (!user) {
		window.location.href = "/login/index.html"
		return
	}

	profilePicture.src = user.photoURL

	fetchPosts()
})

postForm.addEventListener("submit", async (e) => {
	e.preventDefault()

	const formData = new FormData(postForm)
	const content = formData.get("content")
	const image = formData.get("image")

	try {
		const token = await auth.currentUser.getIdToken()
		const res = await fetch(`${API_URL}/posts`, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content,
				image: (await fileToBase64(image)).split(";base64,").pop(),
			}),
		})

		const post = await res.json()

		console.log(post)

		postForm.reset()

		fetchPosts()
	} catch (error) {
		alert("Erro ao publicar")
		console.log(error)
	}
})

async function fetchPosts() {
	const token = await auth.currentUser.getIdToken()
	const res = await fetch(`${API_URL}/posts`, {
		headers: {
			Authorization: "Bearer " + token,
		},
	})
	const posts = await res.json()

	console.log(posts)

	postsContainer.innerHTML = null

	posts.forEach((post) => {
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

	const postElements = postsContainer.querySelectorAll(`[data-post-id]`)

	postElements.forEach((postEl) => {
		const postId = postEl.dataset.postId
		const likeButton = postEl.querySelector("#like-button")
		const likesCount = postEl.querySelector("#likes-count")

		likeButton.addEventListener("click", async (e) => {
			console.log("OK")
			try {
				const res = await fetch(`${API_URL}/posts/${postId}/like`, {
					method: "POST",
					headers: {
						Authorization: "Bearer " + token,
						"Content-Type": "application/json",
					},
				})

				const { likes } = await res.json()

				console.log(likes)

				likesCount.innerText = likes
			} catch (error) {
				alert("Erro ao dar like")
				console.log(error)
			}
		})
	})
}
