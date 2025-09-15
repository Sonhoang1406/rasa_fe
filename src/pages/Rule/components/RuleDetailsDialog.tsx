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
import { useIntent } from "@/hooks/useIntents";
import { useAction } from "@/hooks/useAction";
import {
  Rule,
  RuleListResponse,
  CreateRuleRequest,
  UpdateRuleRequest,
} from "@/lib/types/rule-type";
import { Intent } from "@/lib/types/intent-type";
// RuleDetailsDialog
interface RuleDetailsDialogProps {
  rule: Rule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RuleDetailsDialog({
  rule,
  open,
  onOpenChange,
}: RuleDetailsDialogProps) {
  const { t } = useTranslation();
  const { intents } = useIntent();
  const { getAllAction } = useAction();
  const [intentsList, setIntentsList] = useState<Intent[]>([]);
  const [actionsList, setActionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
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
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Rule Details")}</DialogTitle>
          <DialogDescription>
            {t("Details for rule")} {rule?.name}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">{t("Loading...")}</div>
        ) : rule ? (
          <div className="space-y-4">
            <div>
              <strong>{t("Name")}:</strong> {rule.name}
            </div>
            <div>
              <strong>{t("Description")}:</strong>{" "}
              {rule.desc || t("No description")}
            </div>
            <div>
              <strong>{t("Steps")}:</strong>
              {rule.steps.length > 0 ? (
                <ul className="list-disc pl-5">
                  {rule.steps.map((step, index) => (
                    <li key={index}>
                      {step.intent
                        ? `${t("Intent")}: ${
                            intentsList.find((i) => i._id === step.intent)
                              ?.name || step.intent
                          }`
                        : `${t("Action")}: ${
                            actionsList.find((a) => a._id === step.action)
                              ?.name || step.action
                          }`}
                    </li>
                  ))}
                </ul>
              ) : (
                t("No steps")
              )}
            </div>
            <div>
              <strong>{t("Deleted")}:</strong>{" "}
              {rule.deleted ? t("Yes") : t("No")}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("No rule selected")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
