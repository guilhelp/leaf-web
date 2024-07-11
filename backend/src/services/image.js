const { getStorage } = require("firebase-admin/storage")

const storage = getStorage()
const bucket = storage.bucket("gs://leaf-web-6d772.appspot.com")

/*
 * Uploads a file to a bucket, can fail
 * @param {string} name - the name of the file
 * @param {string} data - the base64 data of the file
 *
 * @returns {string} - the public URL of the file
 */
async function uploadImage(name, data) {
	const file = bucket.file(name + ".png")
	const buffer = Buffer.from(data, "base64")
	await file.save(buffer)
	await file.makePublic()
	return `https://firebasestorage.googleapis.com/v0/b/${file.bucket.name}/o/${encodeURIComponent(
		file.name
	)}?alt=media`
}

module.exports = { uploadImage }
