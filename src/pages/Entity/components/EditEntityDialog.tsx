import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";

// UI Components từ thư viện shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Custom hook để thao tác với entities (bạn cần có useEntities)
import { useEntities } from "@/hooks/useEntities";

// Kiểu dữ liệu Entity (nếu bạn định nghĩa trong models hoặc types riêng)
import type { Entity } from "@/lib/types/entities-type";
interface EditEntitiesDialogProps {
  entity: Entity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEntitiesUpdated: () => void;
}

export function EditEntitiesDialog({
  entity,
  open,
  onOpenChange,
  onEntitiesUpdated,
}: EditEntitiesDialogProps) {
  const { t } = useTranslation();
  const [entitiesName, setEntitiesName] = useState("");
  const [examples, setExamples] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { updateEntities } = useEntities();

  // Load Entities data
  useEffect(() => {
    if (entity && open) {
      setEntitiesName(entity.name);
      setExamples(entity.examples.length > 0 ? [...entity.examples] : [""]);
      setSubmitError(null);
    }
  }, [entity, open]);

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
    if (!entity) return;

    const filteredExamples = examples.filter((ex) => ex.trim() !== "");
    if (entitiesName.trim() === "" || filteredExamples.length === 0) {
      setSubmitError("Entity name and at least one example are required");
      return;
    }

    const updatedEntities = {
      name: entitiesName,
      examples: filteredExamples,
      type: "synonyms",
      regexPattern: null,
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const result = await updateEntities(entity._id, updatedEntities);

      if (result) {
        onOpenChange(false);
        onEntitiesUpdated();
      } else {
        throw new Error(result || "Failed to update entity");
      }
    } catch (err) {
      setSubmitError(
        `Failed to update entity: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error updating entity:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("Edit Entity")}</DialogTitle>
          <DialogDescription>
            {t("Update entity information and examples.")}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 pr-1">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entity-name" className="text-right">
                {t("Entity Name")}
              </Label>
              <Input
                id="entities-name"
                value={entitiesName}
                onChange={(e) => setEntitiesName(e.target.value)}
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
            disabled={!entitiesName.trim() || isSubmitting}
          >
            {isSubmitting ? t("Updating...") : t("Update Entity")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
