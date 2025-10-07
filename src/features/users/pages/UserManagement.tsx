import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/hooks/useUser";
import { IUser } from "@/interfaces/user.interface";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import {
  ArrowUpDown,
  Ban,
  Check,
  ChevronsUpDown,
  Command,
  Eye,
  FileCode2,
  FileDown,
  Paperclip,
  SearchIcon,
  SlidersHorizontal,
  Smartphone,
  Unlock,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { UserDetailDialog } from "./UserDetailsDialog";
import { User } from "../api/dto/User";

const filterSchema = z.object({
  search: z.string().optional(),
  deleted: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [showDeviceDialog, setShowDeviceDialog] = useState(false);
  const [confirmBanOpen, setConfirmBanOpen] = useState(false);
  const [confirmUnbanOpen, setConfirmUnbanOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [userToUnban, setUserToUnban] = useState<string | null>(null);

  const { getAllUsers } = useUser();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      deleted: false,
      page: 1,
      limit: 10, // Đồng bộ với API
    },
  });
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      //   const query = new URLSearchParams({
      //     page: page.toString(),
      //     limit: limit.toString(),
      //     ...(search && { search }),
      //     ...(deleted !== undefined && { deleted: deleted.toString() }),
      //   }).toString();

      const response = await getAllUsers();
      console.log("check user", response);

      if (response && Array.isArray(response)) {
        setUsers(response);
        setPagination({
          total: response.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(response.length / 10),
        });
      } else {
        setError("Invalid data format received from API");
      }
    } catch (err) {
      setError(
        `Failed to fetch users: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  // Xử lý submit form (tìm kiếm, lọc)
  //   const onSubmit = (data: z.infer<typeof filterSchema>) => {
  //     fetchUsers(1, data.limit || data.limit, data.search, data.deleted);
  //   };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
    // API sẽ được gọi trong useEffect do page thay đổi
  };

  //   const handleAskBanUser = (id: string) => {
  //     setUserToBan(id);
  //     setConfirmBanOpen(true);
  //   };

  //   const handleConfirmBan = async () => {
  //     if (userToBan) {
  //       try {
  //         await banUser(userToBan);
  //         toast.success("Ban user successfully");
  //       } catch (err) {
  //         console.error(err);
  //         const errorMessage = err instanceof Error ? err.message : String(err);
  //         toast.error(`Failed to ban user: ${errorMessage}`);
  //       } finally {
  //         setUserToBan(null);
  //         setConfirmBanOpen(false);
  //         fetchUsers(
  //           pagination.page,
  //           pagination.limit,
  //           form.getValues("search"),
  //           form.getValues("deleted")
  //         );
  //       }
  //     }
  //   };

  //   const handleAskUnbanUser = (id: string) => {
  //     setUserToUnban(id);
  //     setConfirmUnbanOpen(true);
  //   };

  //   const handleUnbanUser = async () => {
  //     if (userToUnban) {
  //       try {
  //         await unbanUser(userToUnban);
  //         toast.success("Unban user successfully");
  //       } catch (err) {
  //         console.error(err);
  //         const errorMessage = err instanceof Error ? err.message : String(err);
  //         toast.error(`Failed to unban user: ${errorMessage}`);
  //       } finally {
  //         setUserToUnban(null);
  //         setConfirmUnbanOpen(false);
  //         fetchUsers(
  //           pagination.page,
  //           pagination.limit,
  //           form.getValues("search"),
  //           form.getValues("deleted")
  //         );
  //       }
  //     }
  //   };

  const refreshUsers = () => {
    fetchUsers();
  };

  //   const handleEditUser = (user: User) => {
  //     setSelectedUser(user);
  //     console.log("check selected user", user);

  //     setEditDialogOpen(true);
  //   };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  //   const handleViewDevice = (user: User) => {
  //     setSelectedUser(user);
  //     setShowDeviceDialog(true);
  //   };

  return (
    <div className="relative">
      <Form {...form}>
        <form
          className="table-controller py-4 flex gap-4"
          //   onSubmit={form.handleSubmit(onSubmit)}
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
                        placeholder={t("Search username")}
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
                  <DrawerTitle>{t("Filter user")}</DrawerTitle>
                  <DrawerDescription>
                    {t("Choose options to filter users data.")}
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
                              id="user-filter-deleted"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="user-filter-deleted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("Show banned users")}
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
                                            // form.handleSubmit(onSubmit)(); // Tự động submit khi chọn limit
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
                              {t("users / page")}
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
                {t("Import Users")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="mr-2 h-4 w-4" />
                {t("Export Users")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </form>
      </Form>

      {error ? (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">Error loading users</div>
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
              accessorKey: "firstName",
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
            },
            { accessorKey: "email", header: "Email" },
            { accessorKey: "phoneNumber", header: "Phone" },
            {
              accessorKey: "dateOfBirth",
              header: "Birthday",
              cell: ({ row }) =>
                new Date(row.original.dateOfBirth).toLocaleDateString(),
            },
            { accessorKey: "gender", header: "Gender" },
            {
              accessorKey: "isVerified",
              header: "Verified",
              cell: ({ row }) =>
                row.original.is2FAEnabled ? (
                  <Badge className="bg-green-600">Yes</Badge>
                ) : (
                  <Badge className="bg-red-600">No</Badge>
                ),
            },
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleViewUser(row.original)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {/* <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEditUser(row.original)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-yellow-600 text-white hover:bg-yellow-700"
                    // onClick={() => handleViewDevice(row.original)}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  {/* <Button
                    size="sm"
                    className={
                      row.original.deleted
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                    onClick={() =>
                      row.original.deleted
                        ? handleAskUnbanUser(row.original._id)
                        : handleAskBanUser(row.original._id)
                    }
                  >
                    {row.original.deleted ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                  </Button> */}

                  {/* <ConfirmBanUserDialog
                    open={confirmBanOpen}
                    onOpenChange={setConfirmBanOpen}
                    onConfirm={handleConfirmBan}
                  /> */}
                  {/* <ConfirmUnbanUserDialog
                    open={confirmUnbanOpen}
                    onOpenChange={setConfirmUnbanOpen}
                    onConfirm={handleUnbanUser}
                  /> */}
                </div>
              ),
            },
          ]}
          data={users}
          meta={pagination}
          onChangePage={handlePageChange}
          isLoading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      {/* Edit User Dialog */}
      {/* <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      /> */}
      <UserDetailDialog
        user={selectedUser}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
      {/* <ShowDevicesDialog
        user={selectedUser}
        open={showDeviceDialog}
        onOpenChange={setShowDeviceDialog}
      /> */}
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
