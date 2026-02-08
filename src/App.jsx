import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authRouter, adminRouter, profileRouter, examImportSessionRouter } from './routes';
import { NotificationContainer } from './features/notification/components';
import { ProtectedRoute } from './shared/components';
import { NotFound, NoPermissionPage } from './shared/pages';
import { ROUTES } from './core/constants';
import { SocketProvider } from './shared/components/socket/SocketProvider';

const renderRoutes = (routes, { protect = false, parentKey = 'route' } = {}) =>
  routes.map((route, index) => {
    const { path, index: isIndexRoute, element, children } = route;
    const key = `${parentKey}-${index}-${path ?? 'index'}`;
    const wrappedElement = protect ? (
      <ProtectedRoute>
        {element}
      </ProtectedRoute>
    ) : (
      element
    );

    return (
      <Route
        key={key}
        path={isIndexRoute ? undefined : path}
        index={isIndexRoute}
        element={wrappedElement}
      >
        {children &&
          renderRoutes(children, {
            protect: false,
            parentKey: key,
          })}
      </Route>
    );
  });

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <NotificationContainer />
        <Routes>
          {renderRoutes(authRouter, { parentKey: 'auth' })}
          {renderRoutes(adminRouter, { parentKey: 'admin' })}
          {renderRoutes(profileRouter, { parentKey: 'profile' })}
          {renderRoutes(examImportSessionRouter, { parentKey: 'exam-import-session' })}

          <Route path={ROUTES.FORBIDDEN} element={<NoPermissionPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
