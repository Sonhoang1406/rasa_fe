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

export function CreatePermissionDialog({
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
