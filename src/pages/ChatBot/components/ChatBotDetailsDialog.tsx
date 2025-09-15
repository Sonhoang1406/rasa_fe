"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChatBot } from "@/lib/types/chat-bot-type";
// ChatBotDetailsDialog
interface ChatBotDetailsDialogProps {
  chatBot: ChatBot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatBotDetailsDialog({
  chatBot,
  open,
  onOpenChange,
}: ChatBotDetailsDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("ChatBot Details")}</DialogTitle>
          <DialogDescription>
            {t("Details for chatbot")} {chatBot?.name}
          </DialogDescription>
        </DialogHeader>
        {chatBot ? (
          <div className="space-y-4">
            <div>
              <strong>{t("Name")}:</strong> {chatBot.name}
            </div>
            <div>
              <strong>{t("Description")}:</strong>{" "}
              {chatBot.desc || t("No description")}
            </div>
            <div>
              <strong>{t("URL")}:</strong> {chatBot.url}
            </div>
            <div>
              <strong>{t("Training Status")}:</strong>{" "}
              {chatBot.isTraining ? t("Training") : t("Not Training")}
            </div>
            <div>
              <strong>{t("Created At")}:</strong>{" "}
              {new Date(chatBot.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Updated At")}:</strong>{" "}
              {new Date(chatBot.updatedAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Deleted")}:</strong>{" "}
              {chatBot.deleted ? t("Yes") : t("No")}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("No chatbot selected")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
