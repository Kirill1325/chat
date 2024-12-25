
export const getTime = (message: { createdAt: string }) => {
    const date = new Date(parseInt(message.createdAt))
    return date.toLocaleString().slice((10)).slice(1, -3)
}

export const getDate = (message: { createdAt: string }) => {
    const date = new Date(parseInt(message.createdAt))
    return date.toDateString().slice(3)
}