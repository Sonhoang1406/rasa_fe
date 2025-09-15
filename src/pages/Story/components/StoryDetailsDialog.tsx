"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Story } from "@/lib/types/stories-type";
import { Intent } from "@/lib/types/intent-type";
import { useIntent } from "@/hooks/useIntents";
import { useAction } from "@/hooks/useAction";

interface StoryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: Story | null;
}

export function StoryDetailsDialog({
  open,
  onOpenChange,
  story,
}: StoryDetailsDialogProps) {
  const { t } = useTranslation();
  const { intents } = useIntent();
  const { getAllAction } = useAction();
  const [intentsList, setIntentsList] = useState<Intent[]>([]);
  const [actionsList, setActionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && story) {
      setIsLoading(true);

      const fetchIntents = async () => {
        try {
          const query = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const intentResponse = await intents(`?${query}`);
          if (intentResponse) {
            setIntentsList(intentResponse.data);
          }
        } catch (error) {
          console.error("Error fetching intents:", error);
        }
      };

      const fetchActions = async () => {
        try {
          const query = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const actionResponse = await getAllAction(`?${query}`);
          if (actionResponse) {
            setActionsList(actionResponse.data);
          }
        } catch (error) {
          console.error("Error fetching actions:", error);
        }
      };

      Promise.all([fetchIntents(), fetchActions()]).finally(() =>
        setIsLoading(false)
      );
    }
  }, [open, story]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("Story Details")}</DialogTitle>
          <DialogDescription>
            {t("Steps for story")} {story?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-3 text-sm text-muted-foreground">
              {t("Loading data...")}
            </div>
          ) : story?.steps.length ? (
            story.steps.map((step, index) => {
              console.log("check story", story);

              let displayText = "";
              if (step.type === "INTENT" && step.intent) {
                const intentName =
                  intentsList.find((i) => i._id === step.intent)?.name ||
                  step.intent;
                displayText = `${t("Intent")}: ${intentName}`;
              } else if (step.type === "ACTION" && step.action) {
                const actionName =
                  actionsList.find((a) => a._id === step.action)?.name ||
                  step.action;
                displayText = `${t("Action")}: ${actionName}`;
              } else if (
                step.type === "OR" &&
                step.intents &&
                step.intents.length > 0
              ) {
                const intentNames = step.intents
                  .map(
                    (id) => intentsList.find((i) => i._id === id)?.name || id
                  )
                  .filter(Boolean)
                  .join(", ");
                displayText = `${t("Intents")}: ${
                  intentNames || t("No intents")
                }`;
              } else {
                displayText = t("Unknown step type");
              }

              return (
                <div key={index} className="p-3 bg-muted rounded-md">
                  <p>
                    <strong>
                      {t("Step")} {index + 1}:
                    </strong>{" "}
                    {displayText}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="p-3 text-sm text-muted-foreground">
              {t("No steps available")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
