import * as React from "react";
import {
  BookOpen,
  Bot,
  MessageCircleCode,
  Settings2,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import "@fontsource/orbitron/400.css"; // Regular weight
import "@fontsource/audiowide/400.css"; // Import Audiowide

import { NavMain } from "@/components/nav-main";
// import { NavConversations } from "@/components/nav-conversations";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserResponse, useUserStore } from "@/store/user-store";
import { useNavigate } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const infoUser = {
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  };

  const data = React.useMemo(() => {
    return {
      user: {
        name: infoUser.name,
        email: infoUser.email,
        avatar: infoUser.avatar,
      },

      navMain: [
        {
          title: "Models",
          url: "#",
          icon: Bot,
          hidden: false,
          items: [
            {
              title: "Training",
              url: "/training",
            },
            {
              title: "Intents",
              url: "/intents",
            },
            {
              title: "Entities",
              url: "/entities",
            },
            {
              title: "Stories",
              url: "/stories",
            },
            // {
            //   title: "Rules",
            //   url: "/rules",
            // },
            // {
            //   title: "Responses",
            //   url: "/responses",
            // },
            {
              title: "Slots",
              url: "/slots",
            },
            {
              title: "Rule",
              url: "/rule",
            },
            {
              title: "Chat Bot",
              url: "/chat_bot",
            },
            {
              title: "UQuestion",
              url: "/uquestion",
            },
            {
              title: "Actions",
              url: "/actions",
            },
          ],
        },
        // {
        //   title: t("Documents & Forms"),
        //   url: "/docs",
        //   icon: BookOpen,
        //   hidden: false,
        //   items: [
        //     {
        //       title: t("Categories"),
        //       url: "/categories",
        //     },
        //     {
        //       title: t("Forms"),
        //       url: "/forms",
        //     },
        //     {
        //       title: t("Documents"),
        //       url: "/docs",
        //     },
        //     {
        //       title: t("Analytics & Reports"),
        //       url: "/doc-analytics",
        //     },
        //   ],
        // },
        {
          title: "RBAC",
          icon: ShieldCheck,
          hidden: false,
          items: [
            {
              title: t("Roles"),
              url: "role",
            },
            {
              title: t("Permissions"),
              url: "permission",
            },
          ],
        },
        {
          title: t("Users Management"),
          icon: UserCog,
          hidden: false,
          items: [
            {
              title: t("Users"),
              url: "users",
            },
          ],
        },
        // {
        //   title: t("Settings"),
        //   icon: Settings2,
        //   hidden: false,
        //   items: [],
        // },
      ],
    };
  }, [t]);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader
        onClick={() => {
          navigate("/");
        }}
        className="px-4 flex items-center py-3 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="@logo"
            className="h-10 w-10 rounded-full shadow-lg"
          />
          <span
            className="font-semibold text-xl"
            style={{ fontFamily: "'audiowide', 'Orbitron', sans-serif" }}
          >
            Rasa Chatbot
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/"
                  className="transition-all duration-200 transform hover:translate-x-1"
                >
                  <MessageCircleCode size={24} />
                  <span>{t("Chat with Rasa")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
