"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRule } from "@/hooks/useRule";
import { useIntent } from "@/hooks/useIntents";
import { useAction } from "@/hooks/useAction";
import {
  Rule,
  RuleListResponse,
  CreateRuleRequest,
  UpdateRuleRequest,
} from "@/lib/types/rule-type";
import { Intent } from "@/lib/types/intent-type";
// CreateRuleDialog
const createRuleSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  intent: z.string().optional(),
  action: z.string().optional(),
});

interface CreateRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRuleCreated: () => void;
}

export function CreateRuleDialog({
  open,
  onOpenChange,
  onRuleCreated,
}: CreateRuleDialogProps) {
  const { t } = useTranslation();
  const { createRule } = useRule();
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
    if (!open) {
      form.reset();
    }
  }, [open]);

  const form = useForm<{
    name: string;
    desc: string;
    intent: string;
    action: string;
  }>({
    resolver: zodResolver(createRuleSchema) as any,
    defaultValues: {
      name: "",
      desc: "",
      intent: "",
      action: "",
    },
  });

  const watchedIntent = form.watch("intent");
  const watchedAction = form.watch("action");

  const onSubmit = async (data: {
    name: string;
    desc: string;
    intent: string;
    action: string;
  }) => {
    try {
      const ruleData: CreateRuleRequest = {
        name: data.name,
        desc: data.desc,
        steps: [
          {
            intent: data.intent || null,
            action: data.action || null,
          },
        ],
      };
      await createRule(ruleData);
      onRuleCreated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi tạo rule:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Create Rule")}</DialogTitle>
          <DialogDescription>
            {t("Enter details for the new rule.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Rule Name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter rule name")}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Description")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter description")}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!watchedAction && (
              <FormField
                control={form.control}
                name="intent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Intent")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("Select intent (optional)")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("Loading...")}
                            </div>
                          ) : intentsList.length > 0 ? (
                            intentsList.map((intent) => (
                              <SelectItem key={intent._id} value={intent._id}>
                                {intent.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("No intents available")}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!watchedIntent && (
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Action")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("Select action (optional)")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("Loading...")}
                            </div>
                          ) : actionsList.length > 0 ? (
                            actionsList.map((action) => (
                              <SelectItem key={action._id} value={action._id}>
                                {action.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("No actions available")}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {t("Create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
