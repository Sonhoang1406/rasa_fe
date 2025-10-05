import { useTranslation } from "react-i18next";
import { Permission } from "../api/dto/permissions.dto";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// PermissionDetailsDialog
interface PermissionDetailsDialogProps {
  permission: Permission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PermissionDetailsDialog({
  permission,
  open,
  onOpenChange,
}: PermissionDetailsDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Permission Details")}</DialogTitle>
          <DialogDescription>
            {t("Details for permission")} {permission?.originalUrl || ""}
          </DialogDescription>
        </DialogHeader>
        {permission ? (
          <div className="space-y-4">
            <div>
              <strong>{t("Method")}:</strong> {permission.method}
            </div>
            <div>
              <strong>{t("Endpoint")}:</strong> {permission.originalUrl}
            </div>
            <div>
              <strong>{t("Description")}:</strong>{" "}
              {permission.description || t("No description")}
            </div>
            <div>
              <strong>{t("Module")}:</strong> {permission.module}
            </div>
            <div>
              <strong>{t("Public")}:</strong>{" "}
              {permission.isPublic ? t("Yes") : t("No")}
            </div>
            <div>
              <strong>{t("Created At")}:</strong>{" "}
              {new Date(permission.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Updated At")}:</strong>{" "}
              {new Date(permission.updatedAt).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("No permission selected")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
