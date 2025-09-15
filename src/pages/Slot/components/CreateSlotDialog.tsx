"use client";

import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSlot } from "@/hooks/useSlot";
import { useEntities } from "@/hooks/useEntities";
import { CreateSlotRequest } from "@/lib/types/slot-type";
import { useEffect } from "react";

const createSlotSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  typeMapping: z.string(),
  selectedEntity: z.string().min(1, { message: "Entity is required" }),
  values: z.string(),
});

interface CreateSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSlotCreated: () => void;
}

export function CreateSlotDialog({
  open,
  onOpenChange,
  onSlotCreated,
}: CreateSlotDialogProps) {
  const { t } = useTranslation();
  const { createSlot } = useSlot();
  const {
    entities,
    isLoading: entitiesLoading,
    error: entitiesError,
    getEntities,
  } = useEntities();

  const form = useForm<{
    name: string;
    type: string;
    desc: string;
    values: string;
    selectedEntity: string;
    typeMapping: string;
  }>({
    resolver: zodResolver(createSlotSchema),
    defaultValues: {
      name: "",
      type: "text",
      desc: "",
      selectedEntity: "",
      typeMapping: "from_entity",
      values: "",
    },
  });

  useEffect(() => {
    if (open) {
      getEntities("?page=1&limit=100");
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (data: {
    name: string;
    type: string;
    desc: string;
    values: string;
    selectedEntity: string;
  }) => {
    try {
      const slotData: CreateSlotRequest = {
        name: data.name,
        type: data.type,
        desc: data.desc || "",
        values: [data.values],
        mappings: [{ type: "from_entity", entity: data.selectedEntity }],
      };
      await createSlot(slotData);
      onSlotCreated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi tạo slot:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("Create Slot")}</DialogTitle>
          <DialogDescription>
            {t("Enter details for the new slot.")}
          </DialogDescription>
        </DialogHeader>
        {entitiesError && (
          <div className="text-red-500 mb-4 flex items-center justify-between">
            <span>{t("Failed to load entities: " + entitiesError)}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => getEntities("?page=1&limit=100")} // Retry fetching entities
            >
              {t("Retry")}
            </Button>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Slot Name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter slot name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Slot Type")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter slot type")} {...field} />
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
                    <Input placeholder={t("Enter description")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Value")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter Value")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeMapping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Type Mapping")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter type to mapping")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectedEntity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Entity")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={entitiesLoading || !!entitiesError}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select entity")} />
                      </SelectTrigger>
                      <SelectContent>
                        {entitiesLoading ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            {t("Loading entities...")}
                          </div>
                        ) : entities.length > 0 ? (
                          entities.map((entity) => (
                            <SelectItem key={entity._id} value={entity._id}>
                              {entity.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">
                            {t("No entities available")}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={entitiesLoading || !!entitiesError}
              >
                {t("Create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
