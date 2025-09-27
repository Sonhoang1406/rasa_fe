import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomeDirectorPage, NotFoundPage } from "@/pages";
import { AuthLayout } from "@/layouts";
import { LoginPage, SignUpPage, VerifyPage } from "@/features/auth";

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
        element: <SignUpPage />,
      },
      {
        path: "verify",
        element: <VerifyPage />,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
