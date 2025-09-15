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
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
import { useRoles } from "@/hooks/useRole";
import { usePermissions } from "@/hooks/usePermission";
import { useChatBot } from "@/hooks/useChatBot";
import type { Permission } from "@/lib/types/permission-type";
import type { ChatBot } from "@/lib/types/chat-bot-type";
import type { Role, RoleListResponse } from "@/lib/types/role-type";
import { Switch } from "@/components/ui/switch";
// CreateRoleDialog
const createRoleSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  permissions: z.array(z.string()),
  chatbots: z.array(z.string()),
});

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleCreated: () => void;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onRoleCreated,
}: CreateRoleDialogProps) {
  const { t } = useTranslation();
  const { createRole } = useRoles();
  const { fetchPermissions } = usePermissions();
  const { fetchChatBots } = useChatBot();
  const [permissionsList, setPermissionsList] = useState<Permission[]>([]);
  const [chatbotsList, setChatbotsList] = useState<ChatBot[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<{
    [key: string]: Permission[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);

      const fetchData = async () => {
        try {
          const permissionQuery = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const permissionResponse = await fetchPermissions(
            `?${permissionQuery}`
          );
          const permissions = permissionResponse.data;
          setPermissionsList(permissions);

          // Group permissions by module
          const grouped = permissions.reduce(
            (acc: { [key: string]: Permission[] }, perm: Permission) => {
              const module = perm.module || "Other";
              if (!acc[module]) {
                acc[module] = [];
              }
              acc[module].push(perm);
              return acc;
            },
            {}
          );
          setGroupedPermissions(grouped);

          const chatbotQuery = new URLSearchParams({
            page: "1",
            limit: "100",
          }).toString();
          const chatbotResponse = await fetchChatBots(`?${chatbotQuery}`);
          setChatbotsList(chatbotResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [open]);

  const form = useForm<{
    name: string;
    desc: string;
    permissions: string[];
    chatbots: string[];
  }>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      desc: "",
      permissions: [],
      chatbots: [],
    },
  });

  const onSubmit = async (data: {
    name: string;
    desc: string;
    permissions: string[];
    chatbots: string[];
  }) => {
    try {
      await createRole(data);
      onRoleCreated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi tạo role:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[800px] max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Create Role")}</DialogTitle>
          <DialogDescription>
            {t("Enter details for the new role.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Role Name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Enter role name")}
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
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">{t("Permissions")}:</h3>
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        {isLoading ? (
                          <div className="text-sm text-muted-foreground">
                            {t("Loading...")}
                          </div>
                        ) : Object.keys(groupedPermissions).length > 0 ? (
                          <Accordion
                            type="multiple"
                            className="w-full border rounded-lg"
                          >
                            {Object.entries(groupedPermissions).map(
                              ([module, perms]) => (
                                <AccordionItem
                                  value={module}
                                  key={module}
                                  className="border-b last:border-b-0"
                                >
                                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                                    <div className="flex items-center justify-between w-full pr-4">
                                      <div className="font-medium">
                                        {t("Module")}: {module}
                                      </div>
                                      <div
                                        className="flex items-center gap-2"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <span className="text-xs text-muted-foreground">
                                          {
                                            field.value.filter((id) =>
                                              perms.some((p) => p._id === id)
                                            ).length
                                          }
                                          /{perms.length}
                                        </span>
                                        <Switch
                                          checked={perms.every((perm) =>
                                            field.value.includes(perm._id)
                                          )}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              // Add all permissions from this module that aren't already included
                                              const permIdsToAdd = perms
                                                .filter(
                                                  (perm) =>
                                                    !field.value.includes(
                                                      perm._id
                                                    )
                                                )
                                                .map((perm) => perm._id);
                                              field.onChange([
                                                ...field.value,
                                                ...permIdsToAdd,
                                              ]);
                                            } else {
                                              // Remove all permissions from this module
                                              field.onChange(
                                                field.value.filter(
                                                  (id) =>
                                                    !perms.some(
                                                      (perm) => perm._id === id
                                                    )
                                                )
                                              );
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="px-4 pb-3">
                                    <div className="space-y-2">
                                      {perms.map((perm) => (
                                        <div
                                          key={perm._id}
                                          className="flex items-center justify-between py-2 border-b last:border-b-0"
                                        >
                                          <div className="flex flex-col">
                                            <div className="font-medium">
                                              {perm.endPoint}
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                              <span
                                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                  perm.method === "GET"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : perm.method === "POST"
                                                    ? "bg-green-100 text-green-700"
                                                    : perm.method === "PUT"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : perm.method === "DELETE"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                              >
                                                {perm.method}
                                              </span>
                                              <span>{perm.endPoint}</span>
                                            </div>
                                          </div>
                                          <div className="flex items-center">
                                            <Switch
                                              checked={field.value.includes(
                                                perm._id
                                              )}
                                              onCheckedChange={(checked) => {
                                                if (checked) {
                                                  field.onChange([
                                                    ...field.value,
                                                    perm._id,
                                                  ]);
                                                } else {
                                                  field.onChange(
                                                    field.value.filter(
                                                      (id) => id !== perm._id
                                                    )
                                                  );
                                                }
                                              }}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )
                            )}
                          </Accordion>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {t("No permissions available")}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chatbots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Chatbots")}</FormLabel>
                  <FormControl>
                    <div>
                      <Select
                        onValueChange={(value) => {
                          if (!field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                          }
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("Select chatbots")} />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("Loading...")}
                            </div>
                          ) : chatbotsList.length > 0 ? (
                            chatbotsList.map((chatbot) => (
                              <SelectItem key={chatbot._id} value={chatbot._id}>
                                {chatbot.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              {t("No chatbots available")}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((chatbotId, index) => (
                          <div
                            key={chatbotId}
                            className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
                          >
                            {chatbotsList.find((c) => c._id === chatbotId)
                              ?.name || chatbotId}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value.filter((id) => id !== chatbotId)
                                );
                              }}
                              className="ml-2"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {t("Create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
