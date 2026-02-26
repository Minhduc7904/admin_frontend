import { useEffect, useCallback, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getMyMediaAsync,
    selectMedia,
    selectMediaLoadingGet,
} from '../store/mediaSlice'

const LIMIT_PER_PAGE = 20

export const useMediaLibrary = ({ isOpen, activeTab, folderId, type }) => {
    const dispatch = useDispatch()

    const allMedia = useSelector(selectMedia)
    const loadingMedia = useSelector(selectMediaLoadingGet)

    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [paginatedMedia, setPaginatedMedia] = useState([])
    const prevFolderIdRef = useRef(folderId)
    const prevTypeRef = useRef(type)

    const loadMedia = useCallback((page = 1) => {
        dispatch(
            getMyMediaAsync({
                page: page,
                limit: LIMIT_PER_PAGE,
                folderId: folderId || undefined,
                type: type || undefined,
                status: 'READY',
                sortBy: 'createdAt',
                sortOrder: 'desc',
            })
        )
    }, [dispatch, folderId, type])

    const loadMore = useCallback(() => {
        if (!loadingMedia && hasMore) {
            loadMedia(currentPage + 1)
            setCurrentPage(prev => prev + 1)
        }
    }, [loadMedia, loadingMedia, hasMore, currentPage])

    // When folder or type changes, reset pagination
    useEffect(() => {
        if (folderId !== prevFolderIdRef.current || type !== prevTypeRef.current) {
            setCurrentPage(1)
            setHasMore(true)
            setPaginatedMedia([])
            prevFolderIdRef.current = folderId
            prevTypeRef.current = type
        }
    }, [folderId, type])

    // Load initial media when modal opens
    useEffect(() => {
        if (isOpen && activeTab === 'library') {
            loadMedia(1)
            setCurrentPage(1)
        }
    }, [isOpen, activeTab, loadMedia])

    // Update paginated media when allMedia changes
    useEffect(() => {
        if (currentPage === 1) {
            setPaginatedMedia(allMedia)
        } else {
            setPaginatedMedia(prev => [...prev, ...allMedia])
        }
        
        // Check if we should load more (if less items returned than limit)
        if (allMedia.length < LIMIT_PER_PAGE) {
            setHasMore(false)
        }
    }, [allMedia])

    const reload = useCallback(() => {
        setCurrentPage(1)
        setHasMore(true)
        setPaginatedMedia([])
        loadMedia(1)
    }, [loadMedia])

    return {
        media: paginatedMedia,
        loadingMedia,
        reload,
        loadMore,
        hasMore,
        currentPage,
    }
}
