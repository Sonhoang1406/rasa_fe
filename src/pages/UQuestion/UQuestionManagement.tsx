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
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ConfirmDeleteDialog } from "@/components/delete-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUQuestions } from "@/hooks/useUQuestion";
import {
  UQuestion,
  CreateUQuestionRequest,
  UQuestionListResponse,
  UpdateUQuestionRequest,
} from "@/lib/types/uquestion-type";

const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// CreateUQuestionDialog
const createUQuestionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

interface CreateUQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUQuestionCreated: () => void;
}

function CreateUQuestionDialog({
  open,
  onOpenChange,
  onUQuestionCreated,
}: CreateUQuestionDialogProps) {
  const { t } = useTranslation();
  const { createUQuestion } = useUQuestions();

  const form = useForm<{
    title: string;
  }>({
    resolver: zodResolver(createUQuestionSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: { title: string }) => {
    try {
      await createUQuestion(data);
      onUQuestionCreated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi tạo UQuestion:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Create UQuestion")}</DialogTitle>
          <DialogDescription>
            {t("Enter details for the new user question.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Question Title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter question title")}
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

// EditUQuestionDialog
const editUQuestionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

interface EditUQuestionDialogProps {
  uquestion: UQuestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUQuestionUpdated: () => void;
}

function EditUQuestionDialog({
  uquestion,
  open,
  onOpenChange,
  onUQuestionUpdated,
}: EditUQuestionDialogProps) {
  const { t } = useTranslation();
  const { updateUQuestion } = useUQuestions();

  const form = useForm<{
    title: string;
  }>({
    resolver: zodResolver(editUQuestionSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (uquestion) {
      form.reset({
        title: uquestion.title || "",
      });
    }
  }, [uquestion, form]);

  const onSubmit = async (data: { title: string }) => {
    if (!uquestion) return;
    try {
      await updateUQuestion(uquestion._id, data);
      onUQuestionUpdated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi cập nhật UQuestion:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Edit UQuestion")}</DialogTitle>
          <DialogDescription>
            {t("Update details for the user question.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Question Title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter question title")}
                      {...field}
                      className="w-full"
                    />
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

// UQuestionDetailsDialog
interface UQuestionDetailsDialogProps {
  uquestion: UQuestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function UQuestionDetailsDialog({
  uquestion,
  open,
  onOpenChange,
}: UQuestionDetailsDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("UQuestion Details")}</DialogTitle>
          <DialogDescription>
            {t("Details for user question")} {uquestion?.title}
          </DialogDescription>
        </DialogHeader>
        {uquestion ? (
          <div className="space-y-4">
            <div>
              <strong>{t("Question Title")}:</strong> {uquestion.title}
            </div>
            <div>
              <strong>{t("Created At")}:</strong>{" "}
              {new Date(uquestion.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Updated At")}:</strong>{" "}
              {new Date(uquestion.updatedAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Deleted")}:</strong>{" "}
              {uquestion.deleted ? t("Yes") : t("No")}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("No user question selected")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Main UQuestionManagement Component
export function UQuestionManagement() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [uquestionsData, setUQuestionsData] = useState<UQuestion[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [uquestionToDelete, setUQuestionToDelete] = useState<string | null>(
    null
  );
  const [selectedUQuestion, setSelectedUQuestion] = useState<UQuestion | null>(
    null
  );
  const {
    fetchUQuestions,
    createUQuestion,
    updateUQuestion,
    deleteUQuestion,
    isLoading,
    error: uquestionsError,
  } = useUQuestions();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10,
    },
  });

  const fetchUQuestionsData = async (
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

      const response: UQuestionListResponse = await fetchUQuestions(
        `?${query}`
      );
      if (response.success && Array.isArray(response.data)) {
        setUQuestionsData(response.data);
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
        `Failed to fetch user questions: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching user questions:", err);
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
    fetchUQuestionsData(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [pagination.page, pagination.limit]);

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchUQuestionsData(
      1,
      data.limit || pagination.limit,
      data.search,
      data.deleted
    );
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleAskDeleteUQuestion = (id: string) => {
    setUQuestionToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleEditUQuestion = (uquestion: UQuestion) => {
    setSelectedUQuestion(uquestion);
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (uquestionToDelete) {
      try {
        await deleteUQuestion(uquestionToDelete);
        setUQuestionToDelete(null);
        setConfirmDeleteOpen(false);
        fetchUQuestionsData(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        console.error("Lỗi xóa UQuestion:", error);
      }
    }
  };

  const handleViewDetails = (uquestion: UQuestion) => {
    setSelectedUQuestion(uquestion);
    setDetailsDialogOpen(true);
  };

  const refreshUQuestions = () => {
    fetchUQuestionsData(
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
                        placeholder={t("Search user questions")}
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
                  <DrawerTitle>{t("Filter UQuestions")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter user questions data.")}
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
                              id="uquestion-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="uquestion-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted user questions")}
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
                              {t("user questions / page")}
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
          {/* <Button
            onClick={() => setCreateDialogOpen(true)}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Create UQuestion")}
          </Button> */}
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
                {t("Import UQuestions")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export UQuestions")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </form>
      </Form>

      {error || uquestionsError ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">
            {t("Error loading user questions")}
          </div>
          <div className="text-sm text-muted-foreground">
            {error || uquestionsError}
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
              accessorKey: "title",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Question Title")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }) => (
                <Button
                  variant="link"
                  onClick={() => handleViewDetails(row.original)}
                  className="p-0"
                >
                  {row.getValue("title")}
                </Button>
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
                    onClick={() => handleEditUQuestion(row.original)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleAskDeleteUQuestion(row.original._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={uquestionsData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      <CreateUQuestionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onUQuestionCreated={refreshUQuestions}
      />

      <EditUQuestionDialog
        uquestion={selectedUQuestion}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUQuestionUpdated={refreshUQuestions}
      />

      <UQuestionDetailsDialog
        uquestion={selectedUQuestion}
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
