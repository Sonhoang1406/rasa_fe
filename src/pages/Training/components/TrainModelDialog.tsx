"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Check, ChevronsUpDown, X, Trash2 } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChatBot } from "@/lib/types/chat-bot-type";
import { Story } from "@/lib/types/stories-type";
import { Rule } from "@/lib/types/rule-type";
import { Model, TrainModelRequest } from "@/lib/types/model-type";
import { useModels } from "@/hooks/useModel";
import { useStories } from "@/hooks/useStories";
import { useRule } from "@/hooks/useRule";
import { useChatBot } from "@/hooks/useChatBot";

const toast = {
  success: (message: string) => {
    console.log("Toast Success:", message);
    alert(message);
  },
  error: (message: string) => {
    console.log("Toast Error:", message);
    alert(message);
  },
};

const trainModelSchema = z.object({
  chatBotId: z.string().min(1, { message: "Chatbot is required" }),
  storyIds: z.array(z.string()),
  ruleIds: z.array(z.string()),
  parentId: z.string().optional(),
});

interface TrainModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModelTrained: () => void;
}

export function TrainModelDialog({
  open,
  onOpenChange,
  onModelTrained,
}: TrainModelDialogProps) {
  const { t } = useTranslation();
  const { trainModel, fetchModels } = useModels();
  const { fetchChatBots } = useChatBot();
  const { fetchStories } = useStories();
  const { fetchRules } = useRule();
  const [chatbotsList, setChatbotsList] = useState<ChatBot[]>([]);
  const [storiesList, setStoriesList] = useState<Story[]>([]);
  const [rulesList, setRulesList] = useState<Rule[]>([]);
  const [modelsList, setModelsList] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTrainData, setPendingTrainData] = useState<{
    chatBotId: string;
    storyIds: string[];
    ruleIds: string[];
    parentId?: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setIsLoading(true);

      const fetchData = async () => {
        try {
          const chatbotQuery = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const chatbotResponse = await fetchChatBots(`?${chatbotQuery}`);
          setChatbotsList(chatbotResponse.data);

          const storyQuery = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const storyResponse = await fetchStories(`?${storyQuery}`);
          setStoriesList(storyResponse.data);

          const ruleQuery = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const ruleResponse = await fetchRules(`?${ruleQuery}`);
          setRulesList(ruleResponse.data);

          const modelQuery = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const modelResponse = await fetchModels(`?${modelQuery}`);
          setModelsList(modelResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [open]);

  const form = useForm<{
    chatBotId: string;
    storyIds: string[];
    ruleIds: string[];
    parentId?: string;
  }>({
    resolver: zodResolver(trainModelSchema),
    defaultValues: {
      chatBotId: "",
      storyIds: [],
      ruleIds: [],
      parentId: "none",
    },
  });

  const onSubmit = (data: {
    chatBotId: string;
    storyIds: string[];
    ruleIds: string[];
    parentId?: string;
  }) => {
    setPendingTrainData(data);
    setConfirmOpen(true);
  };

  const handleConfirmTrain = () => {
    if (pendingTrainData) {
      const requestBody: TrainModelRequest = {
        storyIds: pendingTrainData.storyIds,
        ruleIds: pendingTrainData.ruleIds,
        parentId:
          pendingTrainData.parentId === "none"
            ? undefined
            : pendingTrainData.parentId,
      };

      trainModel(pendingTrainData.chatBotId, requestBody)
        .then(() => {
          onModelTrained();
        })
        .catch((error) => {
          console.error("Lỗi train model:", error);
          toast.error(t("Failed to start model training."));
        });

      toast.success(t("Đã train và sẽ mất 1 khoảng thời gian ngắn"));
      setConfirmOpen(false);
      setPendingTrainData(null);
      onOpenChange(false);
      form.reset();
    }
  };

  const handleCancelTrain = () => {
    setConfirmOpen(false);
    setPendingTrainData(null);
  };

  const handleSelectAllStories = () => {
    const allStoryIds = storiesList.map((story) => story._id);
    form.setValue("storyIds", allStoryIds);
  };

  const handleDeleteAllStories = () => {
    form.setValue("storyIds", []);
  };

  const handleSelectAllRules = () => {
    const allRuleIds = rulesList.map((rule) => rule._id);
    form.setValue("ruleIds", allRuleIds);
  };

  const handleDeleteAllRules = () => {
    form.setValue("ruleIds", []);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>{t("Train Model")}</DialogTitle>
            <DialogDescription>
              {t(
                "Select a chatbot, stories, rules, and an optional parent model to train."
              )}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="chatBotId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Chatbot")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("Select chatbot")} />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("Loading...")}
                            </div>
                          ) : chatbotsList.length > 0 ? (
                            chatbotsList.map((chatbot) => (
                              <SelectItem key={chatbot._id} value={chatbot._id}>
                                {chatbot.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("No chatbots available")}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Parent Model (Optional)")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("Select parent model")} />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("Loading...")}
                            </div>
                          ) : modelsList.length > 0 ? (
                            <>
                              <SelectItem value="none">None</SelectItem>
                              {modelsList.map((model) => (
                                <SelectItem key={model._id} value={model._id}>
                                  {model.name}
                                </SelectItem>
                              ))}
                            </>
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("No models available")}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storyIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Stories")}</FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllStories}
                        disabled={isLoading}
                      >
                        {t("Select All")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAllStories}
                        disabled={isLoading || field.value.length === 0}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("Delete Selected All")}
                      </Button>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value.length && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value.length > 0
                                ? `${field.value.length} ${t(
                                    "stories selected"
                                  )}`
                                : t("Select stories")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {isLoading ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                      {t("Loading...")}
                                    </div>
                                  ) : storiesList.length > 0 ? (
                                    storiesList.map((story) => (
                                      <CommandItem
                                        key={story._id}
                                        value={story._id}
                                        onSelect={() => {
                                          const newValue = field.value.includes(
                                            story._id
                                          )
                                            ? field.value.filter(
                                                (id) => id !== story._id
                                              )
                                            : [...field.value, story._id];
                                          field.onChange(newValue);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value.includes(story._id)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {story.name}
                                      </CommandItem>
                                    ))
                                  ) : (
                                    <div className="p-2 text-sm text-muted-foreground">
                                      {t("No stories available")}
                                    </div>
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((storyId, index) => (
                        <div
                          key={storyId}
                          className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
                        >
                          {storiesList.find((s) => s._id === storyId)?.name ||
                            storyId}
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange(
                                field.value.filter((id) => id !== storyId)
                              );
                            }}
                            className="ml-2"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ruleIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Rules")}</FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllRules}
                        disabled={isLoading}
                      >
                        {t("Select All")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAllRules}
                        disabled={isLoading || field.value.length === 0}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("Delete Selected All")}
                      </Button>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value.length && "text-muted-foreground"
                              )}
                              disabled={isLoading}
                            >
                              {field.value.length > 0
                                ? `${field.value.length} ${t("rules selected")}`
                                : t("Select rules")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {isLoading ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                      {t("Loading...")}
                                    </div>
                                  ) : rulesList.length > 0 ? (
                                    rulesList.map((rule) => (
                                      <CommandItem
                                        key={rule._id}
                                        value={rule._id}
                                        onSelect={() => {
                                          const newValue = field.value.includes(
                                            rule._id
                                          )
                                            ? field.value.filter(
                                                (id) => id !== rule._id
                                              )
                                            : [...field.value, rule._id];
                                          field.onChange(newValue);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value.includes(rule._id)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {rule.name}
                                      </CommandItem>
                                    ))
                                  ) : (
                                    <div className="p-2 text-sm text-muted-foreground">
                                      {t("No rules available")}
                                    </div>
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((ruleId, index) => (
                        <div
                          key={ruleId}
                          className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
                        >
                          {rulesList.find((r) => r._id === ruleId)?.name ||
                            ruleId}
                          <button
                            type="button"
                            onClick={() => {
                              field.onChange(
                                field.value.filter((id) => id !== ruleId)
                              );
                            }}
                            className="ml-2"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading}>
                  {t("Train")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Confirm Training")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to train this model?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelTrain}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleConfirmTrain}>{t("Confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
