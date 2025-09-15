"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MinusCircle, PlusCircle, X } from "lucide-react";
import { useStories } from "@/hooks/useStories";
import { useIntent } from "@/hooks/useIntents";
import { UpdateStoryRequest, StepStory, Story } from "@/lib/types/stories-type";
import { Intent } from "@/lib/types/intent-type";
import { useAction } from "@/hooks/useAction";

const EditStoriesSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  tags: z.array(z.string()),
  steps: z
    .array(
      z.object({
        type: z.enum(["INTENT", "ACTION", "OR"]),
        intent: z.string().optional(),
        action: z.string().optional(),
        intents: z.array(z.string()).optional(),
      })
    )
    .min(1, { message: "At least one step is required" }),
});

interface EditStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoryUpdated: () => void;
  story: Story | null;
}

export function EditStoryDialog({
  open,
  onOpenChange,
  onStoryUpdated,
  story,
}: EditStoryDialogProps) {
  const { t } = useTranslation();
  const { updateStory } = useStories();
  const { intents } = useIntent();
  const { getAllAction } = useAction();

  const [intentsList, setIntentsList] = useState<Intent[]>([]);
  const [actionsList, setActionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

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

  const form = useForm<{
    name: string;
    desc: string;
    steps: StepStory[];
    tags: string[];
  }>({
    resolver: zodResolver(EditStoriesSchema),
    defaultValues: {
      name: "",
      desc: "",
      steps: [{ type: "INTENT" }],
      tags: [],
    },
  });

  useEffect(() => {
    if (story) {
      // Initialize form with story data
      form.reset({
        name: story.name || "",
        desc: story.desc || "",
        tags: story.tags || [],
        steps: story.steps.map((step) => ({
          type: step.type as "INTENT" | "ACTION" | "OR",
          intent: step.intent
            ? intentsList.find((i) => i._id === step.intent)?.name ||
              step.intent
            : undefined,
          action: step.action
            ? actionsList.find((a) => a._id === step.action)?.name ||
              step.action
            : undefined,
          intents: step.intents
            ? step.intents.map(
                (id) => intentsList.find((i) => i._id === id)?.name || id
              )
            : undefined,
        })),
      });
    }
  }, [story, intentsList, actionsList, form]);

  const onSubmit = async (data: {
    name: string;
    desc: string;
    steps: StepStory[];
    tags: string[];
  }) => {
    if (!story) return;
    try {
      const storyData: UpdateStoryRequest = {
        name: data.name,
        desc: data.desc,
        tags: data.tags,
        steps: data.steps.map((step) => {
          const baseStep = { type: step.type };

          if (step.type === "INTENT" && step.intent) {
            const foundIntent = intentsList.find((i) => i.name === step.intent);
            return {
              ...baseStep,
              intent: foundIntent?._id || step.intent,
            };
          }

          if (step.type === "ACTION" && step.action) {
            const foundAction = actionsList.find((a) => a.name === step.action);
            return {
              ...baseStep,
              action: foundAction?._id || step.action,
            };
          }

          if (step.type === "OR" && step.intents) {
            const intentIds = step.intents.map((name) => {
              const found = intentsList.find((i) => i.name === name);
              return found?._id || name;
            });
            return {
              ...baseStep,
              intents: intentIds,
            };
          }

          return baseStep;
        }),
      };

      await updateStory(story._id, storyData);
      onStoryUpdated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  const addStep = () => {
    const steps = form.getValues("steps") || [];
    form.setValue("steps", [...steps, { type: "INTENT" }]);
  };

  const removeStep = (index: number) => {
    const steps = form.getValues("steps") || [];
    form.setValue(
      "steps",
      steps.filter((_, i) => i !== index)
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const currentTags = form.getValues("tags") || [];
      const newTag = tagInput.trim().startsWith("#")
        ? tagInput.trim()
        : `#${tagInput.trim()}`;

      if (!currentTags.includes(newTag)) {
        form.setValue("tags", [...currentTags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Edit Story")}</DialogTitle>
          <DialogDescription>
            {t("Update details for the story.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Story Name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter story name")}
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
                  <FormLabel>{t("Description Story")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter desc")}
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Tags")}</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        placeholder={t("Enter tags and press Enter")}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="w-full"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((tag, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Steps")}</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value.map((step, index) => (
                        <div
                          key={index}
                          className="space-y-2 border p-4 rounded-md bg-gray-50"
                        >
                          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <Select
                              value={step.type}
                              onValueChange={(value: string) => {
                                const newSteps = [...field.value];
                                newSteps[index] = { type: value as any };
                                field.onChange(newSteps);
                              }}
                            >
                              <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder={t("Select type")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="INTENT">
                                  {t("Intent")}
                                </SelectItem>
                                <SelectItem value="ACTION">
                                  {t("Action")}
                                </SelectItem>
                                <SelectItem value="OR">{t("OR")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => removeStep(index)}
                              disabled={field.value.length === 1}
                              className="mt-2 sm:mt-0"
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                          {step.type === "INTENT" && (
                            <Select
                              value={step.intent}
                              onValueChange={(value: string) => {
                                const newSteps = [...field.value];
                                newSteps[index].intent = value;
                                field.onChange(newSteps);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("Select intent")} />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoading ? (
                                  <div className="p-2 text-sm text-muted-foreground">
                                    {t("Loading...")}
                                  </div>
                                ) : intentsList.length > 0 ? (
                                  intentsList.map((intent) => (
                                    <SelectItem
                                      key={intent._id}
                                      value={intent.name}
                                    >
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
                          )}
                          {step.type === "ACTION" && (
                            <Select
                              value={step.action}
                              onValueChange={(value) => {
                                const newSteps = [...field.value];
                                newSteps[index].action = value;
                                field.onChange(newSteps);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("Select action")} />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoading ? (
                                  <div className="p-2 text-sm text-muted-foreground">
                                    {t("Loading...")}
                                  </div>
                                ) : actionsList.length > 0 ? (
                                  actionsList.map((action) => (
                                    <SelectItem
                                      key={action._id}
                                      value={action.name}
                                    >
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
                          )}
                          {step.type === "OR" && (
                            <div className="space-y-2">
                              <Select
                                onValueChange={(value) => {
                                  const newSteps = [...field.value];
                                  if (!newSteps[index].intents)
                                    newSteps[index].intents = [];
                                  if (
                                    !newSteps[index].intents.includes(value)
                                  ) {
                                    newSteps[index].intents = [
                                      ...newSteps[index].intents,
                                      value,
                                    ];
                                    field.onChange(newSteps);
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={t("Add intents")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {intentsList.map((intent) => (
                                    <SelectItem
                                      key={intent._id}
                                      value={intent.name}
                                    >
                                      {intent.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap gap-2">
                                {step.intents?.map((intentName, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
                                  >
                                    {intentName}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSteps = [...field.value];
                                        newSteps[index].intents = newSteps[
                                          index
                                        ].intents?.filter(
                                          (name) => name !== intentName
                                        );
                                        field.onChange(newSteps);
                                      }}
                                      className="ml-2"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addStep}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t("Add Step")}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit">{t("Save")}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
