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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDeleteDialog } from "@/components/delete-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePermissions } from "@/hooks/usePermission";
import {
  Permission,
  UpdatePermissionRequest,
  CreatePermissionRequest,
  PermissionListResponse,
} from "@/lib/types/permission-type";

const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// CreatePermissionDialog
const createPermissionSchema = z.object({
  method: z.string().min(1, { message: "Method is required" }),
  endPoint: z.string().min(1, { message: "Endpoint is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  module: z.string().min(1, { message: "Module is required" }),
  isPublic: z.boolean(),
});

interface CreatePermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPermissionCreated: () => void;
}

function CreatePermissionDialog({
  open,
  onOpenChange,
  onPermissionCreated,
}: CreatePermissionDialogProps) {
  const { t } = useTranslation();
  const { createPermission } = usePermissions();

  const form = useForm<{
    method: string;
    endPoint: string;
    desc: string;
    module: string;
    isPublic: boolean;
  }>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      method: "",
      endPoint: "",
      desc: "",
      module: "",
      isPublic: false,
    },
  });

  const onSubmit = async (data: {
    method: string;
    endPoint: string;
    desc: string;
    module: string;
    isPublic: boolean;
  }) => {
    try {
      await createPermission(data);
      onPermissionCreated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi tạo permission:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Create Permission")}</DialogTitle>
          <DialogDescription>
            {t("Enter details for the new permission.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Method")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("Select method")} />
                      </SelectTrigger>
                      <SelectContent>
                        {["GET", "POST", "PUT", "DELETE"].map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Endpoint")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter endpoint (e.g., /api/test)")}
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
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Module")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter module name")}
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
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Public")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label className="text-sm font-medium leading-none">
                        {t("Is Public")}
                      </label>
                    </div>
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

// EditPermissionDialog
const editPermissionSchema = z.object({
  method: z.string().min(1, { message: "Method is required" }),
  endPoint: z.string().min(1, { message: "Endpoint is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  module: z.string().min(1, { message: "Module is required" }),
  isPublic: z.boolean(),
});

interface EditPermissionDialogProps {
  permission: Permission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPermissionUpdated: () => void;
}

function EditPermissionDialog({
  permission,
  open,
  onOpenChange,
  onPermissionUpdated,
}: EditPermissionDialogProps) {
  const { t } = useTranslation();
  const { updatePermission } = usePermissions();

  const form = useForm<{
    method: string;
    endPoint: string;
    desc: string;
    module: string;
    isPublic: boolean;
  }>({
    resolver: zodResolver(editPermissionSchema),
    defaultValues: {
      method: "",
      endPoint: "",
      desc: "",
      module: "",
      isPublic: false,
    },
  });

  useEffect(() => {
    if (permission) {
      form.reset({
        method: permission.method || "",
        endPoint: permission.endPoint || "",
        desc: permission.desc || "",
        module: permission.module || "",
        isPublic: permission.isPublic || false,
      });
    }
  }, [permission, form]);

  const onSubmit = async (data: {
    method: string;
    endPoint: string;
    desc: string;
    module: string;
    isPublic: boolean;
  }) => {
    if (!permission) return;
    try {
      await updatePermission(permission._id, data);
      onPermissionUpdated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi cập nhật permission:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Edit Permission")}</DialogTitle>
          <DialogDescription>
            {t("Update details for the permission.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Method")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("Select method")} />
                      </SelectTrigger>
                      <SelectContent>
                        {["GET", "POST", "PUT", "DELETE"].map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Endpoint")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter endpoint (e.g., /api/test)")}
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
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Module")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter module name")}
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
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Public")}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label className="text-sm font-medium leading-none">
                        {t("Is Public")}
                      </label>
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

// PermissionDetailsDialog
interface PermissionDetailsDialogProps {
  permission: Permission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PermissionDetailsDialog({
  permission,
  open,
  onOpenChange,
}: PermissionDetailsDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Permission Details")}</DialogTitle>
          <DialogDescription>
            {t("Details for permission")} {permission?.endPoint}
          </DialogDescription>
        </DialogHeader>
        {permission ? (
          <div className="space-y-4">
            <div>
              <strong>{t("Method")}:</strong> {permission.method}
            </div>
            <div>
              <strong>{t("Endpoint")}:</strong> {permission.endPoint}
            </div>
            <div>
              <strong>{t("Description")}:</strong>{" "}
              {permission.desc || t("No description")}
            </div>
            <div>
              <strong>{t("Module")}:</strong> {permission.module}
            </div>
            <div>
              <strong>{t("Public")}:</strong>{" "}
              {permission.isPublic ? t("Yes") : t("No")}
            </div>
            <div>
              <strong>{t("Created At")}:</strong>{" "}
              {new Date(permission.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Updated At")}:</strong>{" "}
              {new Date(permission.updatedAt).toLocaleString()}
            </div>
            <div>
              <strong>{t("Deleted")}:</strong>{" "}
              {permission.deleted ? t("Yes") : t("No")}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {t("No permission selected")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Main PermissionManagement Component
export function PermissionManagement() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [permissionsData, setPermissionsData] = useState<Permission[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(
    null
  );
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const {
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    isLoading,
    error: permissionsError,
  } = usePermissions();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10,
    },
  });

  const fetchPermissionsData = async (
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

      const response: PermissionListResponse = await fetchPermissions(
        `?${query}`
      );
      if (response.success && Array.isArray(response.data)) {
        setPermissionsData(response.data);
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
        `Failed to fetch permissions: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching permissions:", err);
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
    fetchPermissionsData(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [pagination.page, pagination.limit]);

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchPermissionsData(
      1,
      data.limit || pagination.limit,
      data.search,
      data.deleted
    );
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleAskDeletePermission = (id: string) => {
    setPermissionToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (permissionToDelete) {
      try {
        await deletePermission(permissionToDelete);
        setPermissionToDelete(null);
        setConfirmDeleteOpen(false);
        fetchPermissionsData(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        console.error("Lỗi xóa permission:", error);
      }
    }
  };

  const handleViewDetails = (permission: Permission) => {
    setSelectedPermission(permission);
    setDetailsDialogOpen(true);
  };

  const refreshPermissions = () => {
    fetchPermissionsData(
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
                        placeholder={t("Search permissions")}
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
                  <DrawerTitle>{t("Filter Permissions")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter permissions data.")}
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
                              id="permission-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="permission-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted permissions")}
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
                              {t("permissions / page")}
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
            {t("Create Permission")}
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
                {t("Import Permissions")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export Permissions")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </form>
      </Form>

      {error || permissionsError ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">
            {t("Error loading permissions")}
          </div>
          <div className="text-sm text-muted-foreground">
            {error || permissionsError}
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
              accessorKey: "method",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Method")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }) => (
                <div className="text-sm">{row.getValue("method")}</div>
              ),
            },
            {
              accessorKey: "endPoint",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Endpoint")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }) => (
                <Button
                  variant="link"
                  onClick={() => handleViewDetails(row.original)}
                  className="p-0"
                >
                  {row.getValue("endPoint")}
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
              cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                  {row.getValue("desc") || t("No description")}
                </div>
              ),
            },
            {
              accessorKey: "module",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Module")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }) => (
                <div className="text-sm">{row.getValue("module")}</div>
              ),
            },
            {
              accessorKey: "isPublic",
              header: t("Public"),
              cell: ({ row }) => (
                <div className="text-sm">
                  {row.getValue("isPublic") ? t("Yes") : t("No")}
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
                    onClick={() => handleEditPermission(row.original)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleAskDeletePermission(row.original._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={permissionsData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      <CreatePermissionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onPermissionCreated={refreshPermissions}
      />

      <EditPermissionDialog
        permission={selectedPermission}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onPermissionUpdated={refreshPermissions}
      />

      <PermissionDetailsDialog
        permission={selectedPermission}
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
