"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { UpdateActionRequest } from "@/lib/types/action-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Action {
  _id: string;
  name: string;
  type: string;
  desc: string;
  text?: string;
  deleted: boolean;
  deletedAt: string | null;
}

interface EditActionDialogProps {
  action: Action | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionUpdated: () => void;
}

export function EditActionDialog({
  action,
  open,
  onOpenChange,
  onActionUpdated,
}: EditActionDialogProps) {
  const { t } = useTranslation();
  const { updateAction } = useAction();
  const [name, setName] = useState(action?.name || "");
  const [desc, setDesc] = useState(action?.desc || "");
  const [type, setType] = useState(action?.type || "");
  const [text, setText] = useState(action?.text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const typeAction = ["UTTER", "CUSTOM"];

  useEffect(() => {
    setName(action?.name || "");
    setDesc(action?.desc || "");
    setType(action?.type || "");
    setText(action?.text || "");
  }, [action]);

  const handleSubmit = async () => {
    if (!action) return;
    setIsSubmitting(true);
    setAlert(null);
    const data: UpdateActionRequest = {
      name: name,
      desc: desc,
      type: type,
      text: text,
    };
    try {
      await updateAction(data, action._id);
      setAlert({ type: "success", message: "Cập nhật action thành công!" });
      onActionUpdated();
      setTimeout(() => onOpenChange(false), 1000);
    } catch (error) {
      setAlert({ type: "error", message: "Không thể cập nhật action." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Edit Action")}</DialogTitle>
          <DialogDescription>
            {t("Update the action details.")}
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
          placeholder={t("Action Description")}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          disabled={isSubmitting}
        />
        {/* <Input
          placeholder={t("Action type")}
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={isSubmitting}
        /> */}

        <Select
          value={type}
          onValueChange={(val) => {
            setType(val);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("Select Type Action")}></SelectValue>
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
            placeholder={t("Action text")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSubmitting}
          />
        ) : (
          ""
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("Update")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
