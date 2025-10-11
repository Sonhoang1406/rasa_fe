import { useTranslation } from "react-i18next";
import { Role } from "../api/dto/RoleResponse";
import { useEffect, useState } from "react";
import { usePermission } from "@/hooks/usePermission";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Permission } from "@/features/permissions/api/dto/permissions.dto";

// RoleDetailsDialog
interface RoleDetailsDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function RoleDetailsDialog({
  role,
  open,
  onOpenChange,
}: RoleDetailsDialogProps) {
  const { t } = useTranslation();
  const { fetchPermissions } = usePermission();
  //   const { fetchChatBots } = useChatBot();
  const [permissionsList, setPermissionsList] = useState<Permission[]>([]);
  //   const [chatbotsList, setChatbotsList] = useState<ChatBot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);

      const fetchData = async () => {
        try {
          const permissionQuery = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const permissionResponse = await fetchPermissions(
            `?${permissionQuery}`
          );
          setPermissionsList(permissionResponse.data);

          const chatbotQuery = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          // const chatbotResponse = await fetchChatBots(`?${chatbotQuery}`);
          // setChatbotsList(chatbotResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Role Details")}</DialogTitle>
          <DialogDescription>
            {t("Details for role")} {role?.name}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">{t("Loading...")}</div>
        ) : role ? (
          <div className="space-y-4">
            <div>
              <strong>{t("Name")}:</strong> {role.name}
            </div>
            <div>
              <strong>{t("Description")}:</strong>{" "}
              {role.description || t("No description")}
            </div>
            <div>
              <strong>{t("Permissions")}:</strong>
              {role.permissions.length > 0 ? (
                <ul className="list-disc pl-5">
                  {role.permissions.map((permId) => (
                    <li key={permId}>
                      {permissionsList.find((p) => p._id === permId)
                        ?.originalUrl || permId}
                    </li>
                  ))}
                </ul>
              ) : (
                t("No permissions")
              )}
            </div>
            {/* <div>
              <strong>{t("Chatbots")}:</strong>
              {role.chatbots.length > 0 ? (
                <ul className="list-disc pl-5">
                  {role.chatbots.map((chatbotId) => (
                    <li key={chatbotId}>
                      {chatbotsList.find((c) => c._id === chatbotId)?.name ||
                        chatbotId}
                    </li>
                  ))}
                </ul>
              ) : (
                t("No chatbots")
              )}
            </div> */}
            <div>
              <strong>{t("Created At")}:</strong>{" "}
              {new Date(role.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Updated At")}:</strong>{" "}
              {new Date(role.updatedAt).toLocaleString()}
            </div>
            {/* <div>
              <strong>{t("Deleted")}:</strong>{" "}
              {role.deleted ? t("Yes") : t("No")}
            </div> */}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("No role selected")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
