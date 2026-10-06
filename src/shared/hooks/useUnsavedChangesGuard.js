import { useCallback, useContext, useEffect, useState } from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';

/**
 * Thay `push`/`replace` của navigator bằng hàm giữ lại điều hướng; trả về hàm khôi phục.
 * Tách khỏi hook vì đây là thay đổi có chủ đích trên đối tượng của router.
 */
const interceptNavigator = (navigator, onIntercept) => {
    const originalPush = navigator.push;
    const originalReplace = navigator.replace;

    const intercept = (original) => (...args) => {
        onIntercept({ run: () => original.apply(navigator, args) });
    };

    navigator.push = intercept(originalPush);
    navigator.replace = intercept(originalReplace);

    return () => {
        navigator.push = originalPush;
        navigator.replace = originalReplace;
    };
};

/**
 * Cảnh báo khi người dùng rời trang lúc còn thay đổi chưa lưu.
 *
 * - Đóng/tải lại tab: dùng `beforeunload` của trình duyệt.
 * - Điều hướng trong ứng dụng (Link, navigate, đổi tab): chặn `push`/`replace` của navigator
 *   và giữ lại điều hướng đang chờ để hiển thị modal xác nhận.
 *
 * App dùng `BrowserRouter` (không phải data router) nên không có `useBlocker`.
 * Nút Back/Forward của trình duyệt không chặn được bằng cách này.
 *
 * @param {boolean} when - Có thay đổi chưa lưu hay không.
 * @returns {{ isPrompting: boolean, confirmLeave: Function, cancelLeave: Function }}
 */
export const useUnsavedChangesGuard = (when) => {
    const { navigator } = useContext(UNSAFE_NavigationContext);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    useEffect(() => {
        if (!when) {
            return undefined;
        }

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [when]);

    useEffect(() => {
        if (!when || !navigator?.push || !navigator?.replace) {
            return undefined;
        }

        const restore = interceptNavigator(navigator, setPendingNavigation);

        return () => {
            restore();
            // Hết thay đổi chưa lưu (hoặc rời trang) thì bỏ điều hướng đang chờ.
            setPendingNavigation(null);
        };
    }, [when, navigator]);

    const confirmLeave = useCallback(() => {
        const navigation = pendingNavigation;
        setPendingNavigation(null);
        navigation?.run();
    }, [pendingNavigation]);

    const cancelLeave = useCallback(() => setPendingNavigation(null), []);

    return {
        isPrompting: pendingNavigation !== null,
        confirmLeave,
        cancelLeave,
    };
};
