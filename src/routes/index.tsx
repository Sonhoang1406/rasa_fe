import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomeDirectorPage, NotFoundPage, UserProfilePage } from "@/pages";
import { AuthLayout, MainLayout } from "@/layouts";
import { LoginPage, SignUpPage, VerifyPage } from "@/features/auth";
import { HomeChat } from "@/features/chat/pages/HomeChatPage";
import { RoleManagement } from "@/features/roles";
import { PermissionManagement } from "@/features/permissions/pages/PermissionManagement";
import { ActionManagement } from "@/features/action";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomeDirectorPage /> },
      { path: "home_chat", element: <HomeChat /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "roles", element: <RoleManagement /> },
      { path: "permissions", element: <PermissionManagement /> },
      { path: "actions", element: <ActionManagement /> },
    ],
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
  // {
  //   path: "/",
  //   element: <MainLayout />,
  //   errorElement: <NotFoundPage />,
  //   children: [{ path: "home_chat", index: true, element: <HomeChat /> }],
  // },
  { path: "*", element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
