import { auth } from "../services/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { API_URL } from "../main"

const profilePicture = document.getElementById("profile-picture")

const imagePost = document.getElementById("image-post")
const contentPost = document.getElementById("content-post")
const authorPicturePost = document.getElementById("author-picture-post")
const authorNamePost = document.getElementById("author-name-post")

const likeButton = document.getElementById("like-button")
const likesCount = document.getElementById("likes-count")
const commentButton = document.getElementById("comment-button")
const commentsCount = document.getElementById("comments-count")

const commentForm = document.getElementById("comment-form")
const commentInput = document.getElementById("comment-input")

const commentsContainer = document.getElementById("comments-container")

const params = new URLSearchParams(window.location.search)
const id = params.get("id")

const unsubscribe = onAuthStateChanged(auth, (user) => {
	unsubscribe()

	if (!user) {
		window.location.href = "/login/index.html"
		return
	}

	profilePicture.src = user.photoURL

	fetchPost()
})

async function fetchPost() {
	if (!id) {
		window.location.href = "/"
		return
	}

	try {
		const token = await auth.currentUser.getIdToken()
		const res = await fetch(`${API_URL}/posts/${id}`, {
			headers: {
				Authorization: "Bearer " + token,
			},
		})

		const post = await res.json()

		console.log(post)

		if (post.imageUrl) {
			imagePost.src = post.imageUrl
			imagePost.classList.remove("hidden")
		}

		if (post.content) {
			contentPost.textContent = post.content
			contentPost.classList.remove("hidden")
		}

		authorNamePost.textContent = post.author.displayName
		authorPicturePost.src = post.author.photoURL
		likesCount.textContent = post.likesCount
		commentsCount.textContent = post.comments.length

		commentsContainer.innerHTML = null

		post.comments.forEach((comment) => {
			commentsContainer.innerHTML += `
                <article comment-id="${
					comment.id
				}" class="rounded-xl border border-black divide-y divide-black">
                    <header class="bg-lime-300 flex items-center px-6 py-3 rounded-t-xl">
                        <img class="bg-lime-300 border border-black h-10 w-10 rounded-full" src="${
							comment.author.photoURL
						}" alt="">
                        <span class="ml-2">${comment.author.displayName}</span>
                    </header>
                    <div class="bg-lime-100 rounded-b-xl px-6 py-4">
                        ${comment.content ? `<p>${comment.content}</p>` : ""}
                    </div>
                </article>
            `
		})
	} catch (error) {
		alert("Erro ao buscar post")
		console.log(error)
	}
}

commentForm.addEventListener("submit", async (e) => {
	e.preventDefault()

	const formData = new FormData(commentForm)
	const comment = formData.get("comment")

	try {
		const token = await auth.currentUser.getIdToken()
		const res = await fetch(`${API_URL}/comments`, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: comment,
				postId: id,
			}),
		})

		const json = await res.json()

		console.log(json)

		commentForm.reset()

		fetchPost()
	} catch (error) {
		alert("Erro ao publicar")
		console.log(error)
	}
})

likeButton.addEventListener("click", async (e) => {
	try {
		const token = await auth.currentUser.getIdToken()
		const res = await fetch(`${API_URL}/posts/${id}/like`, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + token,
				"Content-Type": "application/json",
			},
		})

		const { likes } = await res.json()

		likesCount.innerText = likes
	} catch (error) {
		alert("Erro ao dar like")
		console.log(error)
	}
})

commentButton.addEventListener("click", async (e) => {
	commentInput.focus()
})
