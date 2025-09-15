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
import { useResponse } from "@/hooks/useResponses";

type Response = {
  _id: string;
  name: string;
  examples: string[];
  deleted: boolean;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

interface EditResponseDialogProps {
  response: Response | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResponseUpdated: () => void;
}

export function EditResponseDialog({
  response,
  open,
  onOpenChange,
  onResponseUpdated,
}: EditResponseDialogProps) {
  const { t } = useTranslation();
  const [responseName, setResponseName] = useState("");
  const [examples, setExamples] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { updateResponse } = useResponse();

  // Load response data
  useEffect(() => {
    if (response && open) {
      setResponseName(response.name);
      setExamples(response.examples.length > 0 ? [...response.examples] : [""]);
      setSubmitError(null);
    }
  }, [response, open]);

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
    if (!response) return;

    const filteredExamples = examples.filter((ex) => ex.trim() !== "");
    if (responseName.trim() === "" || filteredExamples.length === 0) {
      setSubmitError("Response name and at least one example are required");
      return;
    }

    const updatedResponse = {
      name: responseName,
      examples: filteredExamples,
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const result = await updateResponse(response._id, updatedResponse);

      if (result?.success) {
        onOpenChange(false);
        onResponseUpdated();
      } else {
        throw new Error(result?.message || "Failed to update response");
      }
    } catch (err) {
      setSubmitError(
        `Failed to update response: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error updating response:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("Edit Response")}</DialogTitle>
          <DialogDescription>
            {t("Update response information and examples.")}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 pr-1">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="response-name" className="text-right">
                {t("Response Name")}
              </Label>
              <Input
                id="response-name"
                value={responseName}
                onChange={(e) => setResponseName(e.target.value)}
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
            disabled={!responseName.trim() || isSubmitting}
          >
            {isSubmitting ? t("Updating...") : t("Update Response")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
