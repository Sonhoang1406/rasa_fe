import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomeDirectorPage, NotFoundPage, UserProfilePage } from "@/pages";
import { AuthLayout, MainLayout } from "@/layouts";
import { LoginPage, SignUpPage, VerifyPage } from "@/features/auth";
import { HomeChat } from "@/features/chat/pages/HomeChatPage";
import { RoleManagement } from "@/features/roles";
import { EntityManagement } from "@/features/entity";
import {
  CreateIntentPage,
  EditIntentPage,
  IntentManagementPage,
} from "@/features/intents";
import { ResponseManagement } from "@/features/reponses";
import { ActionManagement } from "@/features/action";
import {
  CreateRulePageSimple,
  EditRulePageNew,
  RuleManagementPage,
} from "@/features/rules";

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
      { path: "entities", element: <EntityManagement /> },
      {
        path: "intents",
        children: [
          { index: true, element: <IntentManagementPage /> },
          { path: "new", element: <CreateIntentPage /> },
          { path: "edit", element: <EditIntentPage /> },
        ],
      },
      { path: "actions", element: <ActionManagement /> },
      { path: "responses", element: <ResponseManagement /> },
      {
        path: "rules",
        children: [
          { index: true, element: <RuleManagementPage /> },
          { path: "new", element: <CreateRulePageSimple /> },
          { path: "edit", element: <EditRulePageNew /> },
        ],
      },
      { path: "responses", element: <ResponseManagement /> },
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
