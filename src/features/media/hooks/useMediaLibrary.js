import { useEffect, useCallback, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getMyMediaAsync,
    selectMedia,
    selectMediaLoadingGet,
    selectMediaPagination,
} from '../store/mediaSlice'

const LIMIT_PER_PAGE = 20

export const useMediaLibrary = ({ isOpen, activeTab, folderId, type }) => {
    const dispatch = useDispatch()

    const allMedia = useSelector(selectMedia)
    const loadingMedia = useSelector(selectMediaLoadingGet)
    const pagination = useSelector(selectMediaPagination)

    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [paginatedMedia, setPaginatedMedia] = useState([])
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const prevFolderIdRef = useRef(folderId)
    const prevTypeRef = useRef(type)
    // Track the last fulfilled page to avoid processing stale pending resets
    const lastFulfilledPageRef = useRef(0)

    const loadMedia = useCallback((page = 1) => {
        if (page > 1) setIsLoadingMore(true)
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
        ).then((action) => {
            if (action.meta?.requestStatus !== 'fulfilled') return
            const meta = action.payload?.meta
            const data = action.payload?.data ?? []

            if (page === 1) {
                setPaginatedMedia(data)
            } else {
                setPaginatedMedia(prev => [...prev, ...data])
            }

            // Use server-provided hasNext; fallback to count check
            if (meta) {
                setHasMore(meta.hasNext ?? false)
            } else {
                setHasMore(data.length >= LIMIT_PER_PAGE)
            }

            lastFulfilledPageRef.current = page
            setIsLoadingMore(false)
        })
    }, [dispatch, folderId, type])

    const loadMore = useCallback(() => {
        if (!loadingMedia && hasMore) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            loadMedia(nextPage)
        }
    }, [loadMedia, loadingMedia, hasMore, currentPage])

    // When folder or type changes, reset pagination
    useEffect(() => {
        if (folderId !== prevFolderIdRef.current || type !== prevTypeRef.current) {
            setCurrentPage(1)
            setHasMore(true)
            setPaginatedMedia([])
            lastFulfilledPageRef.current = 0
            prevFolderIdRef.current = folderId
            prevTypeRef.current = type
        }
    }, [folderId, type])

    // Load initial media when modal opens
    useEffect(() => {
        if (isOpen && activeTab === 'library') {
            setCurrentPage(1)
            setHasMore(true)
            setPaginatedMedia([])
            lastFulfilledPageRef.current = 0
            loadMedia(1)
        }
    }, [isOpen, activeTab, loadMedia])

    const reload = useCallback(() => {
        setCurrentPage(1)
        setHasMore(true)
        setPaginatedMedia([])
        lastFulfilledPageRef.current = 0
        loadMedia(1)
    }, [loadMedia])

    return {
        media: paginatedMedia,
        loadingMedia,
        isLoadingMore,
        reload,
        loadMore,
        hasMore,
        currentPage,
    }
}
