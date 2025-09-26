import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store, { persistor } from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Home, Login, Signup, Products, Admin, AddSweet, Buy, Orders, AdminStats } from './pages/index.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/products",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/products",
            element: <Products />,
          }
        ]
      },
      {
        path: "/orders",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/orders",
            element: <Orders />,
          }
        ]
      },
      {
        path: "/buy/:id",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/buy/:id",
            element: <Buy />,
          }
        ]
      },
      {
        path: "/admin",
        element: <ProtectedRoute requireAdmin />,
        children: [
          {
            path: "/admin",
            element: <Admin />,
          },
          {
            path: "/admin/stats",
            element: <AdminStats />,
          },
          {
            path: "/admin/add-sweet",
            element: <AddSweet />,
          },
          {
            path: "/admin/edit-sweet/:id",
            element: <AddSweet />,
          }
        ]
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div className="text-center text-gray-300 py-10">Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
