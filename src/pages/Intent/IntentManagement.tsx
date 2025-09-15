"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { CreateIntentDialog } from "@/pages/Intent/components/CreateIntentDialog";
import {
  ArrowUpDown,
  Check,
  ChevronsUpDown,
  Edit,
  Eye,
  RefreshCw,
  SearchIcon,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ConfirmDeleteDialog } from "@/components/delete-dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { EditIntentDialog } from "@/pages/Intent/components/EditIntentDialog";
import { useIntent } from "@/hooks/useIntents";
import { toast } from "react-hot-toast";
import { ConfirmRestoreDialog } from "@/components/restore-dialog.tsx";
import { OnChangeFn, RowSelectionState } from "@tanstack/react-table";

const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

type Intent = {
  _id: string;
  name: string;
  examples: string[];
  deleted: boolean;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export const IntentManagement = () => {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState<string[]>([]);
  const [viewExamples, setViewExamples] = useState<string[] | null>(null);
  const [intentsData, setIntentsData] = useState<Intent[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10, // Đồng bộ với API mặc định
    totalPages: 1,
  });

  // For delete dialog
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [intentToDelete, setIntentToDelete] = useState<string | null>(null);

  // Delete intent permanent
  // const [confirmPermanentDeleteOpen, setConfirmPermanentDeleteOpen] = useState(false);
  // const [intentToPermanentDelete, setIntentToPermanentDelete] = useState<string | null>(null);

  // Restore intent
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [intentToRestore, setIntentToRestore] = useState<string | null>(null);

  // For edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const { intents, deleteIntent, restoreIntent } = useIntent();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10, // Đồng bộ với API
    },
  });

  // Hàm gọi API với tham số phân trang
  const fetchIntents = async (
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

      const response = await intents(`?${query}`); // Cập nhật hàm intents để nhận query

      if (response) {
        setIntentsData(response.data);
        setPagination({
          total: response.meta.total,
          page: response.meta.page,
          limit: response.meta.limit,
          totalPages: response.meta.totalPages, // Sử dụng từ API
        });
      } else {
        setError("Invalid data format received from API");
      }
    } catch (err) {
      setError(
        `Failed to fetch intents: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching intents:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Gọi API khi mount và khi page/limit thay đổi
  useEffect(() => {
    fetchIntents(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [pagination.page, pagination.limit]);

  // Xử lý submit form (tìm kiếm, lọc)
  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchIntents(1, data.limit || pagination.limit, data.search, data.deleted);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
    // API sẽ được gọi trong useEffect do page thay đổi
  };

  // Xử lý xóa intent
  const handleAskDeleteIntent = (id: string) => {
    setIntentToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (intentToDelete) {
      await deleteIntent(intentToDelete);
      setIntentToDelete(null);
      setConfirmDeleteOpen(false);
      fetchIntents(
        pagination.page,
        pagination.limit,
        form.getValues("search"),
        form.getValues("deleted")
      );
    }
  };

  const handleAskRestoreIntent = (id: string) => {
    setIntentToRestore(id);
    setConfirmRestoreOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (intentToRestore) {
      await restoreIntent(intentToRestore);
      setIntentToRestore(null);
      setConfirmRestoreOpen(false);

      // Hiển thị toast thông báo
      toast.success("Restore intent successfully");

      // Reload lại dữ liệu nếu cần
      fetchIntents(
        pagination.page,
        pagination.limit,
        form.getValues("search"),
        form.getValues("deleted")
      );
    }
  };

  // Làm mới dữ liệu
  const refreshIntents = () => {
    fetchIntents(
      1,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  };

  // Xử lý chỉnh sửa intent
  const handleEditIntent = (intent: Intent) => {
    setSelectedIntent(intent);
    setEditDialogOpen(true);
  };

  // Convert rowSelection (array of IDs) to the format expected by DataTable (object with indices)
  const rowSelectionObject = useMemo(() => {
    const selection: { [key: number]: boolean } = {};
    intentsData.forEach((model, index) => {
      if (rowSelection.includes(model._id)) {
        selection[index] = true;
      }
    });
    return selection;
  }, [rowSelection, intentsData]);

  // Handle row selection changes
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (
    updaterOrValue
  ) => {
    const newRowSelection =
      typeof updaterOrValue === "function"
        ? updaterOrValue(rowSelectionObject)
        : updaterOrValue;

    const selectedModelIds = Object.keys(newRowSelection)
      .filter((index) => newRowSelection[Number(index)])
      .map((index) => intentsData[Number(index)]._id);

    setRowSelection(selectedModelIds);
  };

  return (
    <div className="relative">
      <Form {...form}>
        <form
          className="table-controller py-4 flex gap-4"
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
                        placeholder={t("Search intents")}
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
                  <DrawerTitle>{t("Filter Intents")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter intents data.")}
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
                              id="intent-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="intent-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted intents")}
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
                                            form.handleSubmit(onSubmit)(); // Tự động submit khi chọn limit
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
                              {t("intents / page")}
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
          <CreateIntentDialog onIntentCreated={refreshIntents} />
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
                {t("Import Intents")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export Intents")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </form>
      </Form>

      {error ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">Error loading intents</div>
          <div className="text-sm text-muted-foreground">{error}</div>
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
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    Intent Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
            },
            {
              accessorKey: "examples",
              header: "Examples",
              cell: ({ row }) => {
                const examples = row.original.examples;
                return (
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setViewExamples(examples)}
                    >
                      {examples.length} examples
                    </Badge>
                  </div>
                );
              },
            },
            {
              accessorKey: "createdAt",
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }) => {
                const date = row.original.createdAt
                  ? new Date(row.original.createdAt).toLocaleDateString()
                  : "N/A";
                return <div>{date}</div>;
              },
            },
            {
              accessorKey: "updatedAt",
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    Updated At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }) => {
                const date = row.original.updatedAt
                  ? new Date(row.original.updatedAt).toLocaleDateString()
                  : "N/A";
                return <div>{date}</div>;
              },
            },
            {
              accessorKey: "deleted",
              header: "Status",
              cell: ({ row }) => {
                return row.original.deleted ? (
                  <Badge className="bg-red-600">Deleted</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600">
                    Active
                  </Badge>
                );
              },
            },
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewExamples(row.original.examples)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEditIntent(row.original)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {!row.original.deleted ? (
                    // Hiển thị nút Xóa (Trash) nếu chưa bị xóa
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleAskDeleteIntent(row.original._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    // Hiển thị nút Khôi phục (Restore) nếu đã bị xóa
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => handleAskRestoreIntent(row.original._id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                  <ConfirmDeleteDialog
                    open={confirmDeleteOpen}
                    onOpenChange={setConfirmDeleteOpen}
                    onConfirm={handleConfirmDelete}
                  />
                  <ConfirmRestoreDialog
                    open={confirmRestoreOpen}
                    onOpenChange={setConfirmRestoreOpen}
                    onConfirm={handleConfirmRestore}
                  />
                </div>
              ),
            },
          ]}
          data={intentsData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelectionObject}
          setRowSelection={handleRowSelectionChange}
        />
      )}

      {/* Examples Dialog */}
      <Dialog open={!!viewExamples} onOpenChange={() => setViewExamples(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Intent Examples</DialogTitle>
            <DialogDescription>
              Training examples for this intent
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto p-2">
            {viewExamples?.map((example, index) => (
              <div key={index} className="p-3 bg-muted rounded-md">
                {example}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Intent Dialog */}
      <EditIntentDialog
        intent={selectedIntent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onIntentUpdated={refreshIntents}
      />

      <div
        className={cn(
          "absolute bottom-24 right-1/2 translate-x-1/2 translate-y-1/2 hidden",
          Object.keys(rowSelection).length > 0 && "block"
        )}
      >
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-md">
          {Object.keys(rowSelection).length} items selected
        </div>
      </div>
    </div>
  );
};
