"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowUpDown,
  Check,
  ChevronsUpDown,
  SearchIcon,
  SlidersHorizontal,
  Play,
  Eye,
  Trash2,
  Brain,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { ConfirmDeleteDialog } from "@/components/delete-dialog";
import { ChatBot } from "@/lib/types/chat-bot-type";
import { Story } from "@/lib/types/stories-type";
import { Rule } from "@/lib/types/rule-type";
import {
  Model,
  ModelListResponse,
  LoadModelRequest,
} from "@/lib/types/model-type";
import { useModels } from "@/hooks/useModel";
import { useStories } from "@/hooks/useStories";
import { useRule } from "@/hooks/useRule";
import { useChatBot } from "@/hooks/useChatBot";
import { TrainModelDialog } from "./components/TrainModelDialog";

const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// ModelDetailsDialog
interface ModelDetailsDialogProps {
  model: Model | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ModelDetailsDialog({
  model,
  open,
  onOpenChange,
}: ModelDetailsDialogProps) {
  const { t } = useTranslation();
  const { fetchChatBots } = useChatBot();
  const { fetchStories } = useStories();
  const { fetchRules } = useRule();
  const [chatbotsList, setChatbotsList] = useState<ChatBot[]>([]);
  const [storiesList, setStoriesList] = useState<Story[]>([]);
  const [rulesList, setRulesList] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          <DialogTitle>{t("Model Details")}</DialogTitle>
          <DialogDescription>
            {t("Details for model")} {model?.name}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">{t("Loading...")}</div>
        ) : model ? (
          <div className="space-y-4">
            <div>
              <strong>{t("Model Name")}:</strong> {model.name}
            </div>
            <div>
              <strong>{t("Chatbot")}:</strong>{" "}
              {chatbotsList.find((c) => c._id === model.chatbot)?.name ||
                model.chatbot}
            </div>
            <div>
              <strong>{t("Stories")}:</strong>
              {model.stories.length > 0 ? (
                <ul className="list-disc pl-5">
                  {model.stories.map((storyId) => (
                    <li key={storyId}>
                      {storiesList.find((s) => s._id === storyId)?.name ||
                        storyId}
                    </li>
                  ))}
                </ul>
              ) : (
                t("No stories")
              )}
            </div>
            <div>
              <strong>{t("Rules")}:</strong>
              {model.rules.length > 0 ? (
                <ul className="list-disc pl-5">
                  {model.rules.map((ruleId) => (
                    <li key={ruleId}>
                      {rulesList.find((r) => r._id === ruleId)?.name || ruleId}
                    </li>
                  ))}
                </ul>
              ) : (
                t("No rules")
              )}
            </div>
            <div>
              <strong>{t("YAML Content")}:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 font-mono text-sm max-h-60 overflow-y-auto">
                {model.yaml}
              </pre>
            </div>
            <div>
              <strong>{t("Active")}:</strong>{" "}
              {model.isActive ? t("Yes") : t("No")}
            </div>
            <div>
              <strong>{t("Created At")}:</strong>{" "}
              {new Date(model.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Updated At")}:</strong>{" "}
              {new Date(model.updatedAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Deleted")}:</strong>{" "}
              {model.deleted ? t("Yes") : t("No")}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("No model selected")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Main ModelManagement Component
export function ModelManagement() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [modelsData, setModelsData] = useState<Model[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [trainDialogOpen, setTrainDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const {
    fetchModels,
    loadModel,
    deleteModel,
    isLoading,
    error: modelsError,
  } = useModels();
  const { fetchChatBots } = useChatBot();
  const { fetchStories } = useStories();
  const { fetchRules } = useRule();
  const [chatbotsList, setChatbotsList] = useState<ChatBot[]>([]);
  const [storiesList, setStoriesList] = useState<Story[]>([]);
  const [rulesList, setRulesList] = useState<Rule[]>([]);
  const [isDataLoadingDependencies, setIsDataLoadingDependencies] =
    useState(false);

  useEffect(() => {
    setIsDataLoadingDependencies(true);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsDataLoadingDependencies(false);
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10,
    },
  });

  const fetchModelsData = async (
    page: number,
    limit: number,
    search?: string,
    deleted?: boolean
  ) => {
    try {
      setIsDataLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(deleted !== undefined && { deleted: deleted.toString() }),
      }).toString();

      const response: ModelListResponse = await fetchModels(`?${query}`);
      if (response.success && Array.isArray(response.data)) {
        setModelsData(response.data);
        setPagination({
          total: response.meta.total,
          page: response.meta.page,
          limit: response.meta.limit,
          totalPages: response.meta.totalPages,
        });
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      setError(
        `Failed to fetch models: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching models:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    fetchModelsData(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [pagination.page, pagination.limit]);

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchModelsData(
      1,
      data.limit || pagination.limit,
      data.search,
      data.deleted
    );
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLoadModel = async (model: Model) => {
    try {
      await loadModel(model.chatbot, { modelId: model._id });
      alert("Model loaded successfully!");
      fetchModelsData(
        pagination.page,
        pagination.limit,
        form.getValues("search"),
        form.getValues("deleted")
      );
    } catch (error) {
      console.error("Lỗi load model:", error);
      alert("Failed to load model.");
    }
  };

  const handleAskDeleteModel = (id: string) => {
    setModelToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (modelToDelete) {
      try {
        await deleteModel(modelToDelete);
        setModelToDelete(null);
        setConfirmDeleteOpen(false);
        fetchModelsData(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        console.error("Lỗi xóa model:", error);
        alert("Failed to delete model.");
      }
    }
  };

  const handleViewDetails = (model: Model) => {
    setSelectedModel(model);
    setDetailsDialogOpen(true);
  };

  const refreshModels = () => {
    fetchModelsData(
      1,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  };

  return (
    <div className="relative">
      <Form {...form}>
        <form
          className="table-controller py-4 flex gap-4 flex-col sm:flex-row"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <div className="relative">
              <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                <SearchIcon className="h-4 w-4" />
              </div>
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="search"
                        type="search"
                        placeholder={t("Search models")}
                        className="w-full rounded-lg bg-background pl-8"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit">
            <SearchIcon className="mr-2 h-4 w-4" />
            <span>{t("Search")}</span>
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="bg-blue-600">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>{t("Filter")}</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>{t("Filter Models")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter models data.")}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-4 p-4">
                  <FormField
                    control={form.control}
                    name="deleted"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="model-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="model-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted models")}
                            </label>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormItem className="flex items-center gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-[100px] justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? field.value
                                      : t("Select limit")}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[100px] p-0">
                                <Command>
                                  <CommandList>
                                    <CommandGroup>
                                      {[10, 20, 30, 40, 50].map((limit) => (
                                        <CommandItem
                                          value={limit.toString()}
                                          key={limit}
                                          onSelect={() => {
                                            form.setValue("limit", limit);
                                            form.handleSubmit(onSubmit)();
                                          }}
                                        >
                                          {limit}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              limit === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <span className="text-sm font-medium leading-none">
                              {t("models / page")}
                            </span>
                          </FormItem>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">{t("Close")}</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          <div className="flex-1"></div>
          <Button
            onClick={() => setTrainDialogOpen(true)}
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 ml-auto flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            <span>{t("Train")}</span>
          </Button>
        </form>
      </Form>

      {error || modelsError ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">{t("Error loading models")}</div>
          <div className="text-sm text-muted-foreground">
            {error || modelsError}
          </div>
        </div>
      ) : (
        <DataTable
          columns={[
            {
              id: "select",
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label="Select all"
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
              ),
              enableSorting: false,
              enableHiding: false,
            },
            {
              accessorKey: "name",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Model Name")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }) => (
                <Button
                  variant="link"
                  onClick={() => handleViewDetails(row.original)}
                  className="p-0"
                >
                  {row.getValue("name")}
                </Button>
              ),
            },
            {
              accessorKey: "chatbot",
              header: t("Chatbot"),
              cell: ({ row }) => (
                <div className="text-sm">
                  {isDataLoadingDependencies
                    ? t("Loading...")
                    : chatbotsList.find(
                        (c) => c._id === row.getValue("chatbot")
                      )?.name || row.getValue("chatbot")}
                </div>
              ),
            },
            {
              accessorKey: "stories",
              header: t("Stories"),
              cell: ({ row }) => {
                const stories = row.getValue("stories") as string[];
                const storyCount = stories.length;

                return (
                  <div className="text-sm">
                    {isDataLoadingDependencies ? (
                      t("Loading...")
                    ) : storyCount > 0 ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            {t("{{count}} Stories", { count: storyCount })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-60 max-h-[300px] overflow-y-auto p-0"
                          align="start"
                        >
                          <div className="p-4">
                            <h4 className="font-medium mb-2">{t("Stories")}</h4>
                            <div className="space-y-2">
                              {stories.map((storyId) => {
                                const story = storiesList.find(
                                  (s) => s._id === storyId
                                );
                                return (
                                  <div key={storyId} className="text-sm">
                                    <span
                                      className="truncate max-w-[200px]"
                                      title={story?.name || storyId}
                                    >
                                      {story?.name || storyId}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      t("No stories")
                    )}
                  </div>
                );
              },
            },
            {
              accessorKey: "rules",
              header: t("Rules"),
              cell: ({ row }) => {
                const rules = row.getValue("rules") as string[];
                const ruleCount = rules.length;

                return (
                  <div className="text-sm">
                    {isDataLoadingDependencies ? (
                      t("Loading...")
                    ) : ruleCount > 0 ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            {t("{{count}} Rules", { count: ruleCount })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-60 max-h-[300px] overflow-y-auto p-0"
                          align="start"
                        >
                          <div className="p-4">
                            <h4 className="font-medium mb-2">{t("Rules")}</h4>
                            <div className="space-y-2">
                              {rules.map((ruleId) => {
                                const rule = rulesList.find(
                                  (r) => r._id === ruleId
                                );
                                return (
                                  <div key={ruleId} className="text-sm">
                                    <span
                                      className="truncate max-w-[200px]"
                                      title={rule?.name || ruleId}
                                    >
                                      {rule?.name || ruleId}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      t("No rules")
                    )}
                  </div>
                );
              },
            },
            {
              accessorKey: "isActive",
              header: t("Active"),
              cell: ({ row }) => (
                <div className="text-sm">
                  {row.getValue("isActive") ? t("Yes") : t("No")}
                </div>
              ),
            },
            {
              accessorKey: "createdAt",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Created At")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }) => (
                <div className="text-sm">
                  {new Date(row.getValue("createdAt")).toLocaleString()}
                </div>
              ),
            },
            {
              id: "actions",
              header: t("Actions"),
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewDetails(row.original)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleLoadModel(row.original)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleAskDeleteModel(row.original._id)}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={modelsData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      <ModelDetailsDialog
        model={selectedModel}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <TrainModelDialog
        open={trainDialogOpen}
        onOpenChange={setTrainDialogOpen}
        onModelTrained={refreshModels}
      />

      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={handleConfirmDelete}
      />

      <div
        className={cn(
          "absolute bottom-24 right-1/2 translate-x-1/2 translate-y-1/2 hidden",
          Object.keys(rowSelection).length > 0 && "block"
        )}
      >
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-md">
          {Object.keys(rowSelection).length} {t("items selected")}
        </div>
      </div>
    </div>
  );
}
