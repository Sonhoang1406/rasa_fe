"use client";

import * as React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  ArrowUpDown,
  Check,
  ChevronsUpDown,
  Edit,
  FileCode2,
  FileDown,
  Paperclip,
  RefreshCw,
  SearchIcon,
  SlidersHorizontal,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useAction } from "@/hooks/useAction";
import { ConfirmDeleteDialog } from "@/components/delete-dialog";
import { CreateActionDialog } from "@/pages/Action/components/CreateActionDialog";
import { EditActionDialog } from "@/pages/Action/components/EditActionDialog";
import { Action } from "@/lib/types/action-type";

interface ActionListResponse {
  success: boolean;
  data: Action[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const ActionManagement = () => {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState({});
  const [actionsData, setActionsData] = useState<Action[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { getAllAction, deleteAction } = useAction();

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchActions = async (
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

      const response: ActionListResponse = await getAllAction(`?${query}`);

      if (response.success && Array.isArray(response.data)) {
        setActionsData(response.data);
        setPagination({
          total: response.meta.total,
          page: response.meta.page,
          limit: response.meta.limit,
          totalPages: response.meta.totalPages,
        });
      } else {
        setError("Định dạng dữ liệu không hợp lệ từ API");
        setAlert({
          type: "error",
          message: "Định dạng dữ liệu không hợp lệ từ API",
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Lỗi khi lấy actions: ${errorMsg}`);
      setAlert({ type: "error", message: `Lỗi khi lấy actions: ${errorMsg}` });
      console.error("Lỗi lấy actions:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchActions(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [pagination.page, pagination.limit]);

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchActions(1, data.limit || pagination.limit, data.search, data.deleted);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleAskDeleteAction = (id: string) => {
    setActionToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (actionToDelete) {
      try {
        await deleteAction(actionToDelete);
        setAlert({ type: "success", message: "Xóa action thành công!" });
        setActionToDelete(null);
        setConfirmDeleteOpen(false);
        fetchActions(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        setAlert({ type: "error", message: "Không thể xóa action." });
      }
    }
  };

  const refreshActions = () => {
    fetchActions(
      1,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  };

  const handleEditAction = (action: Action) => {
    console.log("check action", action);
    setSelectedAction(action);
    setEditDialogOpen(true);
  };

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10,
    },
  });

  return (
    <div className="relative">
      {alert && (
        <Alert
          variant={alert.type === "error" ? "destructive" : "default"}
          className="mb-4"
        >
          <AlertTitle>
            {alert.type === "error" ? "Lỗi" : "Thành công"}
          </AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
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
                        placeholder={t("Search actions")}
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
                  <DrawerTitle>{t("Filter Actions")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter actions data.")}
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
                              id="action-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="action-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted actions")}
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
                              {t("actions / page")}
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
          <CreateActionDialog onActionCreated={refreshActions} />
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
                {t("Import Actions")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export Actions")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </form>
      </Form>

      {error ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">Lỗi khi tải actions</div>
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
                  aria-label="Chọn tất cả"
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Chọn hàng"
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
                  Name Action
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
            },
            {
              accessorKey: "type",
              header: "Type Action",
              cell: ({ row }) => {
                console.log("check row", row);
                return row.original.type;
              },
            },
            {
              accessorKey: "desc",
              header: "Description Action",
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
              accessorKey: "text",
              header: "Text Action",
              cell: ({ row }) => {
                const text = row.getValue("text") as string;
                const truncatedDesc = text
                  ? text.length > 20
                    ? `${text.substring(0, 20)}...`
                    : text
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
                            {text || t("No description")}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
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
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEditAction(row.original)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleAskDeleteAction(row.original._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={actionsData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}
      <EditActionDialog
        action={selectedAction}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onActionUpdated={refreshActions}
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
          {Object.keys(rowSelection).length} items selected
        </div>
      </div>
    </div>
  );
};
