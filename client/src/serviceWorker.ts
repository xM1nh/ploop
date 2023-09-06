self.addEventListener('message', async (e) => {
    const {data, id} = e.data

    const {
        userId,
        spray,
        caption,
        viewPermission,
        drawPermission,
        isLimited,
        deadline
    } = data

    const chunks = [].concat(...spray).map(url => dataUrltoBlob(url))

    const formData = new FormData()

    let formattedDeadline
    if (!isLimited ) formattedDeadline = 'infinity'
    else formattedDeadline = new Date(deadline)

    formData.append('userId', userId)
    formData.append('caption', caption)
    formData.append('viewPermission', viewPermission)
    formData.append('drawPermission', drawPermission)
    formData.append('isLimited', isLimited)
    formData.append('deadline', JSON.stringify(formattedDeadline))

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

    console.log('done')

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