"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIntent } from "@/hooks/useIntents";
import { toast } from "react-hot-toast";

type Intent = {
  _id: string;
  name: string;
  examples: string[];
  deleted: boolean;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

interface EditIntentDialogProps {
  intent: Intent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIntentUpdated: () => void;
}

export function EditIntentDialog({
  intent,
  open,
  onOpenChange,
  onIntentUpdated,
}: EditIntentDialogProps) {
  const { t } = useTranslation();
  const [intentName, setIntentName] = useState("");
  const [examples, setExamples] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { updateIntent } = useIntent();

  // Load intent data
  useEffect(() => {
    if (intent && open) {
      setIntentName(intent.name);
      setExamples(intent.examples.length > 0 ? [...intent.examples] : [""]);
      setSubmitError(null);
    }
  }, [intent, open]);

  const handleAddExample = () => {
    setExamples([...examples, ""]);
  };

  const handleRemoveExample = (index: number) => {
    const newExamples = [...examples];
    newExamples.splice(index, 1);
    setExamples(newExamples.length > 0 ? newExamples : [""]);
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...examples];
    newExamples[index] = value;
    setExamples(newExamples);
  };

  const handleSubmit = async () => {
    if (!intent) return;

    const filteredExamples = examples.filter((ex) => ex.trim() !== "");
    if (intentName.trim() === "" || filteredExamples.length === 0) {
      setSubmitError("Intent name and at least one example are required");
      return;
    }

    function formatIntentName(name: string): string {
      return name.trim().replace(/\s+/g, "_");
    }

    const updatedIntent = {
      name: formatIntentName(intentName),
      examples: filteredExamples,
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const result = await updateIntent(intent._id, updatedIntent);

      if (result?.success) {
        toast.success("Updated Successfully!");
        onOpenChange(false);
        onIntentUpdated();
      } else {
        throw new Error(result?.message || "Failed to update intent");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Update failed, error : ${errorMessage}`);
      setSubmitError(
        `Failed to update intent: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error updating intent:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("Edit Intent")}</DialogTitle>
          <DialogDescription>
            {t("Update intent information and examples.")}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 pr-1">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="intent-name" className="text-right">
                {t("Intent Name")}
              </Label>
              <Input
                id="intent-name"
                value={intentName}
                onChange={(e) => setIntentName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., ask_program"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">{t("Examples")}</Label>
              <div className="col-span-3 space-y-2">
                {examples.map((example, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={example}
                      onChange={(e) =>
                        handleExampleChange(index, e.target.value)
                      }
                      placeholder={t("Add an example phrase")}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => handleRemoveExample(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExample}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("Add Example")}
                </Button>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="text-sm text-red-500 mt-2">{submitError}</div>
          )}
        </div>

        {/* Footer always visible */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!intentName.trim() || isSubmitting}
          >
            {isSubmitting ? t("Updating...") : t("Update Intent")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
