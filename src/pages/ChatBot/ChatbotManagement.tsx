"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  ArrowUpDown,
  Check,
  ChevronsUpDown,
  FileCode2,
  FileDown,
  Paperclip,
  SearchIcon,
  SlidersHorizontal,
  Trash2,
  Edit,
  Eye,
  Plus,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ConfirmDeleteDialog } from "@/components/delete-dialog";
import { EditChatBotDialog } from "../ChatBot/components/EditChatBotDialog";
import { ChatBotDetailsDialog } from "./components/ChatBotDetailsDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useChatBot } from "@/hooks/useChatBot";
import {
  ChatBotListResponse,
  CreateChatBotRequest,
  ChatBot,
  UpdateChatBotRequest,
} from "@/lib/types/chat-bot-type";

const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// CreateChatBotDialog
const createChatBotSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  url: z.string().url({ message: "Invalid URL" }),
});

interface CreateChatBotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChatBotCreated: () => void;
}

function CreateChatBotDialog({
  open,
  onOpenChange,
  onChatBotCreated,
}: CreateChatBotDialogProps) {
  const { t } = useTranslation();
  const { createChatBot } = useChatBot();

  const form = useForm<{
    name: string;
    desc: string;
    url: string;
  }>({
    resolver: zodResolver(createChatBotSchema),
    defaultValues: {
      name: "",
      desc: "",
      url: "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    desc: string;
    url: string;
  }) => {
    try {
      await createChatBot(data);
      onChatBotCreated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi tạo chatbot:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Create ChatBot")}</DialogTitle>
          <DialogDescription>
            {t("Enter details for the new chatbot.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ChatBot Name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter chatbot name")}
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
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("URL")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter URL (e.g., http://localhost:5005)")}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit">{t("Create")}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Main ChatBotManagement Component
export function ChatBotManagement() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [chatBotsData, setChatBotsData] = useState<ChatBot[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [chatBotToDelete, setChatBotToDelete] = useState<string | null>(null);
  const [selectedChatBot, setSelectedChatBot] = useState<ChatBot | null>(null);
  const {
    fetchChatBots,
    createChatBot,
    updateChatBot,
    deleteChatBot,
    isLoading,
    error: chatBotsError,
  } = useChatBot();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10,
    },
  });

  const fetchChatBotsData = async (
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

      const response: ChatBotListResponse = await fetchChatBots(`?${query}`);
      if (response.success && Array.isArray(response.data)) {
        setChatBotsData(response.data);
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
        `Failed to fetch chatbots: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching chatbots:", err);
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
    fetchChatBotsData(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [pagination.page, pagination.limit]);

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchChatBotsData(
      1,
      data.limit || pagination.limit,
      data.search,
      data.deleted
    );
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleAskDeleteChatBot = (id: string) => {
    setChatBotToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleEditChatBot = (chatBot: ChatBot) => {
    setSelectedChatBot(chatBot);
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (chatBotToDelete) {
      try {
        await deleteChatBot(chatBotToDelete);
        setChatBotToDelete(null);
        setConfirmDeleteOpen(false);
        fetchChatBotsData(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        console.error("Lỗi xóa chatbot:", error);
      }
    }
  };

  const handleViewDetails = (chatBot: ChatBot) => {
    setSelectedChatBot(chatBot);
    setDetailsDialogOpen(true);
  };

  const refreshChatBots = () => {
    fetchChatBotsData(
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
                        placeholder={t("Search chatbots")}
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
                  <DrawerTitle>{t("Filter ChatBots")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter chatbots data.")}
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
                              id="chatbot-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="chatbot-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted chatbots")}
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
                              {t("chatbots / page")}
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
            onClick={() => setCreateDialogOpen(true)}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Create ChatBot")}
          </Button>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FileCode2 className="mr-2 h-4 w-4" />
                <span>{t("Features")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Paperclip className="mr-2 h-4 w-4" />
                {t("Import ChatBots")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export ChatBots")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </form>
      </Form>

      {error || chatBotsError ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">{t("Error loading chatbots")}</div>
          <div className="text-sm text-muted-foreground">
            {error || chatBotsError}
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
                  {t("ChatBot Name")}
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
              accessorKey: "desc",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Description")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }) => {
                const description = row.getValue("desc") as string;
                const truncatedDesc = description
                  ? description.length > 20
                    ? `${description.substring(0, 20)}...`
                    : description
                  : t("No description");

                return (
                  <div className="text-sm text-muted-foreground">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          {truncatedDesc}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-60 max-h-[300px] overflow-y-auto p-0"
                        align="start"
                      >
                        <div className="p-4">
                          <h4 className="font-medium mb-2">
                            {t("Description")}
                          </h4>
                          <div className="text-sm">
                            {description || t("No description")}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              },
            },
            {
              accessorKey: "url",
              header: t("URL"),
              cell: ({ row }) => (
                <a
                  href={row.getValue("url")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {row.getValue("url")}
                </a>
              ),
            },
            {
              accessorKey: "isTraining",
              header: t("Training Status"),
              cell: ({ row }) => (
                <div className="text-sm">
                  {row.getValue("isTraining")
                    ? t("Training")
                    : t("Not Training")}
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
                    onClick={() => handleEditChatBot(row.original)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleAskDeleteChatBot(row.original._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={chatBotsData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      <CreateChatBotDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onChatBotCreated={refreshChatBots}
      />

      <EditChatBotDialog
        chatBot={selectedChatBot}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onChatBotUpdated={refreshChatBots}
      />

      <ChatBotDetailsDialog
        chatBot={selectedChatBot}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
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
