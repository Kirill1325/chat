
export const convertDate = (message: { createdAt: string }) => {
    const date = new Date(parseInt(message.createdAt))
    return date.toLocaleString().slice((10)).slice(1, -3)
}