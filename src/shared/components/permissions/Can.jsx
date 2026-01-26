// src/shared/permissions/CanAccess.jsx
import { useSelector } from 'react-redux'
import { selectProfilePermissions } from '../../../features/profile/store/profileSlice'
import { hasPermission } from '../../utils'

export const CanAccess = ({ permission, children }) => {
    const permissions = useSelector(selectProfilePermissions)
    if (!hasPermission(permissions, permission)) return null
    return children
}

export const IfAllowed = ({ allowed, children }) => {
    if (!allowed) return null
    return children
}