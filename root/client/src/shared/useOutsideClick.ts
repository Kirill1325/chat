import { useRef, useEffect } from "react"

export const useClickOutside = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback()
            }
        }

        document.addEventListener('mouseup', handleClickOutside)
        document.addEventListener('touchend', handleClickOutside)

        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
            document.removeEventListener('touchend', handleClickOutside)
        }
    }, [callback])

    return ref
}