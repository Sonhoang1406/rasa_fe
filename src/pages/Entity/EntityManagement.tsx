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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  ArrowUpDown,
  Check,
  ChevronsUpDown,
  Edit,
  Eye,
  FileCode2,
  FileDown,
  Paperclip,
  RefreshCw,
  SearchIcon,
  SlidersHorizontal,
  Trash2,
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateEntitiesDialog } from "@/pages/Entity/components/CreateEntityDialog";
import { ConfirmDeleteDialog } from "@/components/delete-dialog";
import { EditEntitiesDialog } from "@/pages/Entity/components/EditEntityDialog";
import { useEntities } from "@/hooks/useEntities";
import { Entity } from "@/lib/types/entities-type";
import { toast } from "react-hot-toast";
import { ConfirmRestoreDialog } from "@/components/restore-dialog.tsx";

// Schema lọc
const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const EntitiesManagement = () => {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [viewExamples, setViewExamples] = useState<string[] | null>(null);
  const [entitiesData, setEntitiesData] = useState<Entity[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // For delete dialog
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [entitiesToDelete, setEntitiesToDelete] = useState<string | null>(null);

  // Restore entity
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [entitiesToRestore, setEntitiesToRestore] = useState<string | null>(
    null
  );

  // For edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const {
    getEntities,
    deleteEntities,
    restoreEntities,
    error: entitiesError,
  } = useEntities();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10,
    },
  });

  const fetchEntities = async (
    page: number,
    limit: number,
    search?: string,
    deleted?: boolean
  ) => {
    try {
      setIsDataLoading(true);

      // Tạo query string từ các tham số, đảm bảo tất cả đều được truyền vào đúng cách
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }), // Thêm 'search' nếu có
        ...(deleted !== undefined && { deleted: deleted.toString() }), // Thêm 'deleted' nếu có
      }).toString();

      // Gọi API với đầy đủ tham số query
      const response = await getEntities(`?${query}`);

      if (response) {
        setEntitiesData(response.data);
        setPagination({
          total: response.meta.total,
          page: response.meta.page,
          limit: response.meta.limit,
          totalPages: response.meta.totalPages,
        });
      } else {
        setError("Invalid data format received from API");
      }
    } catch (err) {
      setError(
        `Failed to fetch entities: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching entities:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Gọi API khi mount và khi page/limit thay đổi
  useEffect(() => {
    fetchEntities(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [pagination.page, pagination.limit]);

  // Xử lý submit form (tìm kiếm, lọc)
  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchEntities(1, data.limit || pagination.limit, data.search, data.deleted);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  // Xử lý xóa entity
  const handleAskDeleteEntities = (id: string) => {
    setEntitiesToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (entitiesToDelete) {
      try {
        await deleteEntities(entitiesToDelete);
        setEntitiesToDelete(null);
        setConfirmDeleteOpen(false);
        fetchEntities(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        console.error("Lỗi xóa entity:", error);
        setError(
          `Failed to delete entity: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  };

  const handleAskRestoreEntity = (id: string) => {
    setEntitiesToRestore(id);
    setConfirmRestoreOpen(true);
  };

  const handleConfirmRestoreEntity = async () => {
    if (entitiesToRestore) {
      try {
        await restoreEntities(entitiesToRestore);
        toast.success("Entity restored successfully");

        fetchEntities(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        toast.error("Failed to restore entity");
      } finally {
        setEntitiesToRestore(null);
        setConfirmRestoreOpen(false);
      }
    }
  };

  // Làm mới dữ liệu
  const refreshEntities = () => {
    fetchEntities(
      1,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  };

  // Xử lý chỉnh sửa entity
  const handleEditEntities = (entity: Entity) => {
    setSelectedEntity(entity);
    setEditDialogOpen(true);
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
                        placeholder={t("Search entities")}
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
                  <DrawerTitle>{t("Filter Entities")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter entities data.")}
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
                              id="entities-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="entities-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted entities")}
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
                              {t("entities / page")}
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
          <CreateEntitiesDialog onEntitiesCreated={refreshEntities} />
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
                {t("Import Entities")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export Entities")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </form>
      </Form>

      {error || entitiesError ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">{t("Error loading entities")}</div>
          <div className="text-sm text-muted-foreground">
            {error || entitiesError}
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
                  {t("Entity Name")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
            },
            {
              accessorKey: "examples",
              header: t("Examples"),
              cell: ({ row }) => {
                const examples = row.original.examples || [];
                return (
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setViewExamples(examples)}
                    >
                      {examples.length} {t("examples")}
                    </Badge>
                  </div>
                );
              },
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
                <div>
                  {row.original.createdAt
                    ? new Date(row.original.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
              ),
            },
            {
              accessorKey: "updatedAt",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Updated At")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }) => (
                <div>
                  {row.original.updatedAt
                    ? new Date(row.original.updatedAt).toLocaleDateString()
                    : "N/A"}
                </div>
              ),
            },
            {
              accessorKey: "deleted",
              header: t("Status"),
              cell: ({ row }) =>
                row.original.deleted ? (
                  <Badge className="bg-red-600">{t("Deleted")}</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600">
                    {t("Active")}
                  </Badge>
                ),
            },
            {
              id: "actions",
              header: t("Actions"),
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setViewExamples(row.original.examples)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEditEntities(row.original)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!row.original.deleted ? (
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleAskDeleteEntities(row.original._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => handleAskRestoreEntity(row.original._id)}
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
                    onConfirm={handleConfirmRestoreEntity}
                  />
                </div>
              ),
            },
          ]}
          data={entitiesData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      {/* Examples Dialog */}
      <Dialog open={!!viewExamples} onOpenChange={() => setViewExamples(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Entity Examples")}</DialogTitle>
            <DialogDescription>
              {t("Training examples for this entity")}
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

      {/* Edit Entity Dialog */}
      <EditEntitiesDialog
        entity={selectedEntity}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEntitiesUpdated={refreshEntities}
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
};
