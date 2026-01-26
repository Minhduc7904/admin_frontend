// src/shared/permissions/Can.jsx
import { useSelector } from 'react-redux';
import { selectProfilePermissions } from '../../../features/profile/store/profileSlice';
import { hasPermission } from '../../utils';

export const Can = ({ permission, children }) => {
    const permissions = useSelector(selectProfilePermissions);
    if (!hasPermission(permissions, permission)) return null;
    return children;
};
