"use client";

import { useEffect } from "react";
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
import { UpdateSlotRequest } from "@/lib/types/slot-type";
import { Slot } from "@/lib/types/slot-type";

const editSlotSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  values: z.string(),
  selectedEntity: z.string().min(1, { message: "Entity is required" }),
  typeMapping: z.string(),
});

interface EditSlotDialogProps {
  slot: Slot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSlotUpdated: () => void;
}

export function EditSlotDialog({
  slot,
  open,
  onOpenChange,
  onSlotUpdated,
}: EditSlotDialogProps) {
  const { t } = useTranslation();
  const { updateSlot } = useSlot();
  const {
    entities,
    isLoading: entitiesLoading,
    error: entitiesError,
  } = useEntities();

  const form = useForm<{
    name: string;
    type: string;
    desc: string;
    values: string;
    selectedEntity: string;
    typeMapping: string;
  }>({
    resolver: zodResolver(editSlotSchema),
    defaultValues: {
      name: "",
      type: "text",
      desc: "",
      values: "",
      selectedEntity: "",
      typeMapping: "from_entity",
    },
  });

  useEffect(() => {
    if (slot) {
      form.reset({
        name: slot.name || "",
        type: slot.type || "text",
        desc: slot.desc || "",
        values: slot.values?.[0] || "",
        selectedEntity: slot.mappings?.[0]?.entity || "",
        typeMapping: slot.mappings?.[0]?.type || "from_entity",
      });
    }
  }, [slot, form]);

  const onSubmit = async (data: {
    name: string;
    type: string;
    desc: string;
    values: string;
    selectedEntity: string;
    typeMapping: string;
  }) => {
    if (!slot) return;
    try {
      const slotData: UpdateSlotRequest = {
        name: data.name,
        type: data.type,
        desc: data.desc,
        values: [data.values],
        mappings: [{ type: data.typeMapping, entity: data.selectedEntity }],
      };
      await updateSlot(slotData, slot._id);
      onSlotUpdated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi cập nhật slot:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Edit Slot")}</DialogTitle>
          <DialogDescription>
            {t("Update the details of the slot.")}
          </DialogDescription>
        </DialogHeader>
        {entitiesError && (
          <div className="text-red-500 mb-4">
            {t("Failed to load entities")}
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
                    <Input
                      placeholder={t("Enter slot name")}
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Slot Type")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter slot type")}
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
              name="values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Value")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter value")}
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
              name="typeMapping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Type Mapping")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter type mapping")}
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("Select entity")} />
                      </SelectTrigger>
                      <SelectContent>
                        {entitiesLoading ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            {t("Loading...")}
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
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={entitiesLoading || !!entitiesError}
              >
                {t("Save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
