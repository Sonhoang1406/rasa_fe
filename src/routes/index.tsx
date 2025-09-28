import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomeDirectorPage, NotFoundPage } from "@/pages";
import { AuthLayout, MainLayout } from "@/layouts";
import { LoginPage, SignUpPage, VerifyPage } from "@/features/auth";
import { HomeChat } from "@/features/chat/pages/HomeChatPage";

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
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [{ path: "home_chat", element: <HomeChat /> }],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
