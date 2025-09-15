"use client";

import { useState, useEffect, useMemo } from "react";
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
  Edit,
  FileCode2,
  FileDown,
  Paperclip,
  SearchIcon,
  SlidersHorizontal,
  Trash2,
  Plus,
  AlertTriangle,
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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteDialog } from "@/components/delete-dialog";
import { useSlot } from "@/hooks/useSlot";
import { useEntities } from "@/hooks/useEntities";
import { CreateSlotDialog } from "@/pages/Slot/components/CreateSlotDialog";
import { EditSlotDialog } from "./components/EditSlotDialog";
import { Slot } from "@/lib/types/slot-type";

// Schema lọc
const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Component chính
export function SlotManagement() {
  const { t } = useTranslation();
  const [slotsData, setSlotsData] = useState<Slot[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { getAllSlot, deleteSlot } = useSlot();
  const { entities } = useEntities();
  const [rowSelection, setRowSelection] = useState<string[]>([]);

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10,
    },
  });

  const fetchSlots = async (
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

      const response = await getAllSlot(`?${query}`);

      if (response.success && Array.isArray(response.data)) {
        setSlotsData(response.data);
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
        `Failed to fetch slots: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching slots:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [pagination.page, pagination.limit]);

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchSlots(1, data.limit || pagination.limit, data.search, data.deleted);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleAskDeleteSlot = (id: string) => {
    setSlotToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (slotToDelete) {
      try {
        await deleteSlot(slotToDelete);
        setSlotToDelete(null);
        setConfirmDeleteOpen(false);
        fetchSlots(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        console.error("Lỗi xóa slot:", error);
      }
    }
  };

  const refreshSlots = () => {
    fetchSlots(
      1,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  };

  const handleEditSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setEditDialogOpen(true);
  };
  // Convert rowSelection (array of IDs) to the format expected by DataTable (object with indices)
  const rowSelectionObject = useMemo(() => {
    const selection: { [key: number]: boolean } = {};
    slotsData.forEach((model, index) => {
      if (rowSelection.includes(model._id)) {
        selection[index] = true;
      }
    });
    return selection;
  }, [rowSelection, slotsData]);

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
      .map((index) => slotsData[Number(index)]._id);

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
                        placeholder={t("Search slots")}
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
                  <DrawerTitle>{t("Filter Slots")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter slots data.")}
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
                              id="slot-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="slot-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted slots")}
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
                              {t("slots / page")}
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
            {t("Create Slot")}
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
                {t("Import Slots")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export Slots")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </form>
      </Form>

      {error ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">{t("Error loading slots")}</div>
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
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  {t("Slot Name")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
            },
            {
              accessorKey: "type",
              header: "Type",
              cell: ({ row }) => <div>{row.getValue("type")}</div>,
            },
            {
              accessorKey: "mappings",
              header: "Mappings",
              cell: ({ row }) => {
                const mappings = row.original.mappings || [];
                return (
                  <Badge variant="outline">
                    {mappings.length} {t("mappings")}
                  </Badge>
                );
              },
            },
            {
              accessorKey: "deleted",
              header: "Status",
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
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEditSlot(row.original)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleAskDeleteSlot(row.original._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ConfirmDeleteDialog
                    open={confirmDeleteOpen}
                    onOpenChange={setConfirmDeleteOpen}
                    onConfirm={handleConfirmDelete}
                  />
                </div>
              ),
            },
          ]}
          data={slotsData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelectionObject}
          setRowSelection={handleRowSelectionChange}
        />
      )}

      <CreateSlotDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSlotCreated={refreshSlots}
      />

      <EditSlotDialog
        slot={selectedSlot}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSlotUpdated={refreshSlots}
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
