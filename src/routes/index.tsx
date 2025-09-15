import { Register } from "@/pages/Resiger";
import { ForgotPassword } from "@/pages/Forgot-password";
import { AuthLayout, MainLayout } from "@/layouts";
import { Error, Login, NotFound } from "@/pages";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { VerifyFormPage } from "@/pages/VerifyForm";
import { HomeChatPage } from "@/pages/HomeChat";
import { ResetPassword } from "@/pages/Reset-Password";
import { UserManagement } from "@/components";
import { IntentManagement } from "@/pages/Intent/IntentManagement";
import { EntitiesManagement } from "@/pages/Entity";
import { UserProfile } from "@/pages/UserProfile";
import { ModelManagement } from "@/pages/Training/ModelManagement";
import { ActionManagement } from "@/pages/Action/ActionManagement";
import { SlotManagement } from "@/pages/Slot";
import { ResponseManagement } from "@/pages/Response";
import { StoriesManagement } from "@/pages/Story";
import { ChatBotManagement } from "@/pages/ChatBot/ChatbotManagement";
import { RuleManagement } from "@/pages/Rule/RuleManagement";
import { PermissionManagement } from "@/pages/Permission/PermissionManagement";
import { RoleManagement } from "@/pages/Role";
import { UQuestionManagement } from "@/pages/UQuestion/UQuestionManagement";
import { PublicChat } from "@/components/publicChat";
import { HomeRedirect } from "@/components/HomeRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRedirect />,
  },
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [

      { path: "home_chat", index: true, element: <HomeChatPage /> },
      { path: "role", element: <RoleManagement /> },
      { path: "intents", element: <IntentManagement /> },
      { path: "training", element: <ModelManagement /> },
      { path: "actions", element: <ActionManagement /> },
      { path: "slots", element: <SlotManagement /> },
      { path: "stories", element: <StoriesManagement /> },
      { path: "users", element: <UserManagement /> },
      { path: "entities", element: <EntitiesManagement /> },
      { path: "responses", element: <ResponseManagement /> },
      { path: "chat_bot", element: <ChatBotManagement /> },
      { path: "rule", element: <RuleManagement /> },
      { path: "permission", element: <PermissionManagement /> },
      { path: "uquestion", element: <UQuestionManagement /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "", index: true, element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify", element: <VerifyFormPage /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "user-profile",
    element: <UserProfile />,
  },
  {
    path: "/public_chat",
    element: <PublicChat />,
  },
  { path: "*", element: <NotFound /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
