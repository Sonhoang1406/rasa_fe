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
import { useRule } from "@/hooks/useRule";
import { useIntent } from "@/hooks/useIntents";
import { useAction } from "@/hooks/useAction";
import {
  Rule,
  RuleListResponse,
  CreateRuleRequest,
  UpdateRuleRequest,
} from "@/lib/types/rule-type";
import { Intent } from "@/lib/types/intent-type";
import { CreateRuleDialog } from "./components/CreateRuleDialog";
import { EditRuleDialog } from "./components/EditRuleDialog";
import { RuleDetailsDialog } from "./components/RuleDetailsDialog";
import { OnChangeFn, RowSelectionState, Updater } from "@tanstack/react-table";

const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// RuleManagement Component
export function RuleManagement() {
  const { t } = useTranslation();
  const [rowSelection, setRowSelection] = useState<string[]>([]); // Track selected rule IDs
  const [rulesData, setRulesData] = useState<Rule[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const {
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    isLoading,
    error: rulesError,
  } = useRule();
  const { intents } = useIntent();
  const { getAllAction } = useAction();
  const [intentsList, setIntentsList] = useState<Intent[]>([]);
  const [actionsList, setActionsList] = useState<any[]>([]);
  const [isDataLoadingIntentsActions, setIsDataLoadingIntentsActions] =
    useState(false);

  useEffect(() => {
    setIsDataLoadingIntentsActions(true);

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
      setIsDataLoadingIntentsActions(false)
    );
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

  const fetchRulesData = async (
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

      const response: RuleListResponse = await fetchRules(`?${query}`);
      if (response.success && Array.isArray(response.data)) {
        setRulesData(response.data);

        // Reset selections to only include rules that are still in the current page's data
        const currentRuleIds = response.data.map((rule) => rule._id);
        setRowSelection((prev) =>
          prev.filter((id) => currentRuleIds.includes(id))
        );

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
        `Failed to fetch rules: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching rules:", err);
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
    fetchRulesData(
      pagination.page,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  }, [
    pagination.page,
    pagination.limit,
    form.watch("deleted"),
    form.watch("search"),
  ]);

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    fetchRulesData(
      1,
      data.limit || pagination.limit,
      data.search,
      data.deleted
    );
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleAskDeleteRule = (id: string) => {
    setRuleToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleEditRule = (rule: Rule) => {
    setSelectedRule(rule);
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (ruleToDelete) {
      try {
        await deleteRule(ruleToDelete);
        setRuleToDelete(null);
        setConfirmDeleteOpen(false);
        fetchRulesData(
          pagination.page,
          pagination.limit,
          form.getValues("search"),
          form.getValues("deleted")
        );
      } catch (error) {
        console.error("Lỗi xóa rule:", error);
      }
    }
  };

  const handleViewDetails = (rule: Rule) => {
    setSelectedRule(rule);
    setDetailsDialogOpen(true);
  };

  const refreshRules = () => {
    fetchRulesData(
      1,
      pagination.limit,
      form.getValues("search"),
      form.getValues("deleted")
    );
  };

  // Convert rowSelection (array of IDs) to the format expected by DataTable (object with indices)
  const rowSelectionObject = useMemo(() => {
    const selection: { [key: number]: boolean } = {};
    rulesData.forEach((rule, index) => {
      if (rowSelection.includes(rule._id)) {
        selection[index] = true;
      }
    });
    return selection;
  }, [rowSelection, rulesData]);

  // Handle row selection changes
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (
    updaterOrValue
  ) => {
    const newRowSelection =
      typeof updaterOrValue === "function"
        ? updaterOrValue(rowSelectionObject)
        : updaterOrValue;

    const selectedRuleIds = Object.keys(newRowSelection)
      .filter((index) => newRowSelection[Number(index)])
      .map((index) => rulesData[Number(index)]._id);

    setRowSelection(selectedRuleIds);
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
                        placeholder={t("Search rules")}
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
                  <DrawerTitle>{t("Filter Rules")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter rules data.")}
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
                              id="rule-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="rule-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show deleted rules")}
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
                              {t("rules / page")}
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
            {t("Create Rule")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FileCode2 className="mr-2 h-4 w-4" />
                <span>{t("Features")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Paperclip className="mr-2 h-4 w-4" />
                {t("Import Rules")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export Rules")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </form>
      </Form>

      {error || rulesError ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">{t("Error loading rules")}</div>
          <div className="text-sm text-muted-foreground">
            {error || rulesError}
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
                  {t("Rule Name")}
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
              accessorKey: "steps",
              header: t("Steps"),
              cell: ({ row }) => (
                <div className="text-sm">
                  {isDataLoadingIntentsActions ? (
                    t("Loading...")
                  ) : (
                      row.getValue("steps") as {
                        intent?: string;
                        action?: string;
                      }[]
                    ).length > 0 ? (
                    <span>
                      {(
                        row.getValue("steps") as {
                          intent?: string;
                          action?: string;
                        }[]
                      )[0]?.intent
                        ? `${t("Intent")}: ${
                            intentsList.find(
                              (i) =>
                                i._id ===
                                (
                                  row.getValue("steps") as {
                                    intent?: string;
                                    action?: string;
                                  }[]
                                )[0].intent
                            )?.name ||
                            (
                              row.getValue("steps") as {
                                intent?: string;
                                action?: string;
                              }[]
                            )[0].intent
                          }`
                        : `${t("Action")}: ${
                            actionsList.find(
                              (a) =>
                                a._id ===
                                (
                                  row.getValue("steps") as {
                                    intent?: string;
                                    action?: string;
                                  }[]
                                )[0].action
                            )?.name ||
                            (
                              row.getValue("steps") as {
                                intent?: string;
                                action?: string;
                              }[]
                            )[0].action
                          }`}
                    </span>
                  ) : (
                    t("No steps")
                  )}
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
                    onClick={() => handleEditRule(row.original)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleAskDeleteRule(row.original._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={rulesData}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isDataLoading}
          rowSelection={rowSelectionObject}
          setRowSelection={handleRowSelectionChange}
        />
      )}

      <CreateRuleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onRuleCreated={refreshRules}
      />

      <EditRuleDialog
        rule={selectedRule}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onRuleUpdated={refreshRules}
      />

      <RuleDetailsDialog
        rule={selectedRule}
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
          {rowSelection.length} {t("items selected")}
        </div>
      </div>
    </div>
  );
}
