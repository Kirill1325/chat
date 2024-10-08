import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';
import store from './store';
import './App.scss'
import { MainPage } from '../pages/mainPage';
import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SERVER_URL, {
  // ackTimeout: 10000,
  // retries: 3,
});

socket.on('connect', () => {
  console.log('WebSocket connected');
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/registration",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
// fix

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
