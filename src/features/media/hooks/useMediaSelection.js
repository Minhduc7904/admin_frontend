import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


export const useMediaSelection = (initialId) => {
    const [selectedMediaId, setSelectedMediaId] = useState(initialId)

    useEffect(() => {
        setSelectedMediaId(initialId)
    }, [initialId])

    return {
        selectedMediaId,
        setSelectedMediaId,
    }
}
