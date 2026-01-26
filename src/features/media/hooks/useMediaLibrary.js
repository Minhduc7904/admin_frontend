import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getAllMediaAsync,
    getBatchMyMediaViewUrlAsync,
    selectMedia,
    selectMediaLoadingGet,
    selectMediaBatchViewUrls,
} from '../store/mediaSlice'

export const useMediaLibrary = ({ isOpen, activeTab, folderId, type }) => {
    const dispatch = useDispatch()

    const media = useSelector(selectMedia)
    const loadingMedia = useSelector(selectMediaLoadingGet)
    const batchViewUrls = useSelector(selectMediaBatchViewUrls)

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

    useEffect(() => {
        if (!isOpen || activeTab !== 'library') return
        if (!media?.length) return

        const imageIds = media
            .filter(m => m.type === 'IMAGE')
            .map(m => m.mediaId)

        if (imageIds.length) {
            dispatch(getBatchMyMediaViewUrlAsync({ mediaIds: imageIds, expiry: 3600 }))
        }
    }, [media, isOpen, activeTab, dispatch])

    const viewUrlsMap = useMemo(() => {
        const map = {}
        batchViewUrls?.results?.forEach(r => {
            if (r.viewUrl && !r.error) {
                map[r.mediaId] = r.viewUrl
            }
        })
        return map
    }, [batchViewUrls])

    return {
        media,
        loadingMedia,
        viewUrlsMap,
        reload: loadMedia,
    }
}
