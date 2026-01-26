// src/core/constants/permission/permission.codes.js

import { PERMISSION_DEFINITIONS } from './permission.definitions';

/**
 * Convert camelCase sang snake_case
 * viewStudentManagement -> view_student_management
 */
function camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Flatten permission definitions thành:
 * [
 *   ['NOTIFICATION_GET_MY', 'notification.getMy'],
 *   ['MEDIA_FOLDER_CREATE', 'media.folder.create'],
 *   ...
 * ]
 */
function flattenPermissions(definitions, prefix = '') {
    const result = [];

    Object.entries(definitions).forEach(([key, value]) => {
        const currentPrefix = prefix ? `${prefix}.${key}` : key;

        if (!value || typeof value !== 'object' || !value.actions) return;

        Object.entries(value.actions).forEach(([actionKey, actionValue]) => {
            // Case: nested actions (vd: media.folder.create)
            if (
                actionValue &&
                typeof actionValue === 'object' &&
                actionValue.actions
            ) {
                result.push(
                    ...flattenPermissions(
                        { [actionKey]: actionValue },
                        currentPrefix
                    )
                );
            } else {
                // Case: action thường
                const code = `${currentPrefix}.${actionKey}`;
                // Convert camelCase sang snake_case trước khi uppercase
                const snakeCase = camelToSnakeCase(code);
                const constName = snakeCase.toUpperCase().replace(/\./g, '_');

                result.push([constName, code]);
            }
        });
    });
    // console.log(result);
    return result;
}

export const PERMISSIONS = Object.fromEntries(
    flattenPermissions(PERMISSION_DEFINITIONS)
);
