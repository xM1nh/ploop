self.addEventListener('message', async (e) => {
    const {data, id} = e.data

    const chunks = [].concat(...data).map(url => dataUrltoBlob(url))

    const formData = new FormData()

    chunks.forEach((chunk, index) => {
        formData.append(`sprays[]`, chunk, index.toString())
    })

    await fetch('http://127.0.0.1:8000/upload', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'X-Upload-Id': id,
                'X-Total-Files': chunks.length.toString()
            },
            body: formData
        })

    self.postMessage('Done')
})

const dataUrltoBlob = (url: string) => {
    const parts = url.split(';base64,')

    const mimeType = parts[0].split(':')[1]
    const data = atob(parts[1])

    const uint8Array = new Uint8Array(data.length)

    for (let i = 0; i < data.length; i++) {
        uint8Array[i] = data.charCodeAt(i)
    }

    return new Blob([uint8Array], {type: mimeType})
}