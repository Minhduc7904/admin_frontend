import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getAllMediaAsync,
    selectMedia,
    selectMediaLoadingGet,
} from '../store/mediaSlice'

export const useMediaLibrary = ({ isOpen, activeTab, folderId, type }) => {
    const dispatch = useDispatch()

    const media = useSelector(selectMedia)
    const loadingMedia = useSelector(selectMediaLoadingGet)

    const loadMedia = useCallback(() => {
        dispatch(
            getAllMediaAsync({
                page: 1,
                limit: 100,
                folderId: folderId || undefined,
                type: type || undefined,
                status: 'READY',
                sortBy: 'createdAt',
                sortOrder: 'desc',
            })
        )
    }, [dispatch, folderId, type])

    useEffect(() => {
        if (isOpen && activeTab === 'library') {
            loadMedia()
        }
    }, [isOpen, activeTab, loadMedia])

    return {
        media,
        loadingMedia,
        reload: loadMedia,
    }
}
