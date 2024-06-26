import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './app/auth-context';
import Callback from './app/pages/callback/callback';
import Home from './app/pages/home/home';
import Error from './app/pages/error/error';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
//#region routes
const router =
  createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/404',
      element: <Error />,
    },
    {
      path: '/callback',
      element: <Callback />,
    },
  ]);
//#endregion
root.render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
