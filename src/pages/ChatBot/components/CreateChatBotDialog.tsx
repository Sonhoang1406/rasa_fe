"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useChatBot } from "@/hooks/useChatBot";
// CreateChatBotDialog
const createChatBotSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  desc: z.string().min(1, { message: "Description is required" }),
  url: z.string().url({ message: "Invalid URL" }),
});

interface CreateChatBotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChatBotCreated: () => void;
}

export function CreateChatBotDialog({
  open,
  onOpenChange,
  onChatBotCreated,
}: CreateChatBotDialogProps) {
  const { t } = useTranslation();
  const { createChatBot } = useChatBot();

  const form = useForm<{
    name: string;
    desc: string;
    url: string;
  }>({
    resolver: zodResolver(createChatBotSchema),
    defaultValues: {
      name: "",
      desc: "",
      url: "",
    },
  });

  const onSubmit = async (data: {
    name: string;
    desc: string;
    url: string;
  }) => {
    try {
      await createChatBot(data);
      onChatBotCreated();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Lỗi tạo chatbot:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{t("Create ChatBot")}</DialogTitle>
          <DialogDescription>
            {t("Enter details for the new chatbot.")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ChatBot Name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter chatbot name")}
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
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("URL")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Enter URL (e.g., http://localhost:5005)")}
                      {...field}
                      className="w-full"
                    />
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
