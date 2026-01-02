import { LoginPage, LoadingRedirect } from '../features/auth/pages';
import { ROUTES } from '../core/constants';
export const authRouter = [
    {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
    },
    {
        path: ROUTES.LOADING_REDIRECT,
        element: <LoadingRedirect />,
    },
    {
        path: ROUTES.HOME,
        element: <LoadingRedirect />,
    },
];
