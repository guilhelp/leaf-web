export function fileToBase64(file) {
	const fileReader = new FileReader()
	fileReader.readAsDataURL(file)

	return new Promise((resolve, reject) => {
		fileReader.onloadend = () => {
			resolve(fileReader.result.toString())
		}

		fileReader.onerror = (error) => {
			reject(error)
		}
	})
}
