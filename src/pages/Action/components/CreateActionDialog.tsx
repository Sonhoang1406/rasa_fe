"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { CreateActionRequest } from "@/lib/types/action-type";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

interface CreateActionDialogProps {
  onActionCreated: () => void;
}

export function CreateActionDialog({
  onActionCreated,
}: CreateActionDialogProps) {
  const { t } = useTranslation();
  const { createAction } = useAction();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("UTTER");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const typeAction = ["UTTER", "CUSTOM"];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setAlert(null);
    const data: CreateActionRequest = {
      name: name,
      desc: desc,
      type: type,
      text: text,
    };
    try {
      await createAction(data);
      setAlert({ type: "success", message: "Tạo action thành công!" });
      setName("");
      setDesc("");
      setText("");
      onActionCreated();
      setTimeout(() => setOpen(false), 1000);
    } catch (error) {
      setAlert({ type: "error", message: "Không thể tạo action." });
    } finally {
      setIsSubmitting(false);
      setAlert(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          {t("Create Action")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Create Action")}</DialogTitle>
          <DialogDescription>
            {t("Enter details for the new action.")}
          </DialogDescription>
        </DialogHeader>
        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        <Input
          placeholder={t("Action name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
        <Input
          placeholder={t("Description")}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          disabled={isSubmitting}
        />
        {/* <Input
          placeholder={t("Type")}
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={isSubmitting}
        /> */}
        <Select
          onValueChange={(val) => {
            setType(val);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("Select type action")}></SelectValue>
          </SelectTrigger>
          <SelectContent>
            {typeAction.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {type === "UTTER" ? (
          <Input
            placeholder={t("Text")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSubmitting}
          />
        ) : (
          <div></div>
        )}
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("Create")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
