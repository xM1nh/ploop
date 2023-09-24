export const formatDate = (date: Date) => {
    date = new Date(date)
    const dateTime = date.getTime()
    const dateNowTime = new Date().getTime()

    const diffTime = Math.abs(dateNowTime - dateTime)
    const diffSecond = diffTime / (1000)
    const diffMinute = diffTime / (1000 * 60)
    const diffHour = diffTime / (1000 * 60 * 60)
    const diffDay = diffTime / (1000 * 60 * 60 * 24)

    if (diffSecond < 60) {
        if (diffSecond < 1) return 'now'
        else return `${Math.floor(diffSecond)} seconds ago`
    }

    if (diffMinute >= 1 && diffMinute < 60) {
        if (diffMinute < 2) return 'a minute ago'
        else return `${Math.floor(diffMinute)} minutes ago`
    }

    if (diffHour >= 1 && diffHour < 24) {
        if (diffHour < 2) return 'an hour ago'
        else return `${Math.floor(diffHour)} hours ago.`    
    }

    if (diffDay >= 1 && diffDay <= 7) {
        if (diffDay < 2) return `a day ago`
        else return `${Math.floor(diffDay)} days ago`
    }

    return `${date.getMonth()}-${date.getDate()}`
}

export const urlToObject = async (url: string) => {
    const response = await fetch(url)
    const blob = await response.blob()

    return blob
}