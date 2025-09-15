"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
}

export function ErrorDialog({
  open,
  onOpenChange,
  title,
  message,
}: ErrorDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-transparent" />
      <DialogContent className="max-w-sm p-6 text-center space-y-4">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <AlertTriangle className="text-red-500 w-10 h-10" />
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-4 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("Close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
