import { useState, useCallback } from 'react'
import { mediaFolderApi } from '../../../core/api'

export const useMediaFolders = (type) => {
    const [rootFolders, setRootFolders] = useState([])
    const [loadingFolders, setLoadingFolders] = useState(false)
    const [expandedNodes, setExpandedNodes] = useState(new Set())
    const [childrenMap, setChildrenMap] = useState({})
    const [selectedFolderId, setSelectedFolderId] = useState(null)

    const loadRootFolders = useCallback(async () => {
        setLoadingFolders(true)
        try {
            const params = type ? { type } : {}
            const res = await mediaFolderApi.getRoots(params)
            setRootFolders(res?.data?.data?.data || res?.data?.data || [])
        } catch {
            setRootFolders([])
        } finally {
            setLoadingFolders(false)
        }
    }, [type])

    const handleFolderSelect = (folderId, isToggle = false, newExpanded = null) => {
        if (isToggle && newExpanded) {
            setExpandedNodes(newExpanded)
        } else {
            setSelectedFolderId(folderId)
        }
    }

    const resetFolders = () => {
        setSelectedFolderId(null)
        setExpandedNodes(new Set())
        setChildrenMap({})
    }

    return {
        rootFolders,
        loadingFolders,
        expandedNodes,
        childrenMap,
        selectedFolderId,

        setChildrenMap,
        setSelectedFolderId,

        loadRootFolders,
        handleFolderSelect,
        resetFolders,
    }
}
