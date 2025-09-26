import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomeDirectorPage, NotFoundPage } from "@/pages";
import { AuthLayout } from "@/layouts";
import { LoginPage } from "@/features/auth";
import { Register } from "@/features/auth/pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeDirectorPage />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <div>Register</div>,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },

]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
