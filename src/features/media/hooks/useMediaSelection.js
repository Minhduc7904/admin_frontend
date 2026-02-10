import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


export const useMediaSelection = (initialId, multiple = false) => {
    // Single mode: selectedMediaId is a number or null
    // Multiple mode: selectedMediaIds is an array of numbers
    const [selectedMediaId, setSelectedMediaId] = useState(initialId)
    const [selectedMediaIds, setSelectedMediaIds] = useState([])

    useEffect(() => {
        if (multiple) {
            // Initialize with array
            setSelectedMediaIds(Array.isArray(initialId) ? initialId : initialId ? [initialId] : [])
        } else {
            setSelectedMediaId(initialId)
        }
    }, [initialId, multiple])

    const toggleMediaId = (mediaId) => {
        if (!multiple) {
            setSelectedMediaId(mediaId)
            return
        }

        setSelectedMediaIds(prev => {
            if (prev.includes(mediaId)) {
                return prev.filter(id => id !== mediaId)
            }
            return [...prev, mediaId]
        })
    }

    const isSelected = (mediaId) => {
        if (multiple) {
            return selectedMediaIds.includes(mediaId)
        }
        return selectedMediaId === mediaId
    }

    const clearSelection = () => {
        if (multiple) {
            setSelectedMediaIds([])
        } else {
            setSelectedMediaId(null)
        }
    }

    return {
        // Single mode
        selectedMediaId,
        setSelectedMediaId,
        
        // Multiple mode
        selectedMediaIds,
        setSelectedMediaIds,
        toggleMediaId,
        
        // Common
        isSelected,
        clearSelection,
        multiple,
    }
}

