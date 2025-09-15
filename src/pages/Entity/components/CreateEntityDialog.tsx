"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import {useEntities} from "@/hooks/useEntities.ts";

export function CreateEntitiesDialog({
  onEntitiesCreated,
}: {
  onEntitiesCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [entitiesName, setEntitiesName] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { createEntities } = useEntities();

  const handleAddExample = () => {
    setExamples([...examples, ""]);
  };

  const handleRemoveExample = (index: number) => {
    const newExamples = [...examples];
    newExamples.splice(index, 1);
    setExamples(newExamples);
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...examples];
    newExamples[index] = value;
    setExamples(newExamples);
  };

  const handleSubmit = async () => {
    const filteredExamples = examples.filter((ex) => ex.trim() !== "");

    if (entitiesName.trim() === "" || filteredExamples.length === 0) {
      setSubmitError("Entities name and at least one example are required");
      return;
    }

    const newEntities = {
      name: entitiesName.trim(),
      examples: filteredExamples,
      type: "synonyms",
      regexPattern: null,
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await createEntities(newEntities)

      if (response) {
        // Clear form và đóng dialog
        setEntitiesName("");
        setExamples([""]);
        setOpen(false);
        toast.success("Entity created successfully!");
        // Gọi lại danh sách
        if (onEntitiesCreated) {
          onEntitiesCreated();
        }
      } else {
        throw new Error(response || "Failed to create entities");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to create intent: ${errorMessage}`);
      setSubmitError(
        `Failed to create entities: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error("Error creating entities:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Entities
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Entities</DialogTitle>
          <DialogDescription>
            Add a new entity with training examples.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entities-name" className="text-right">
              Entity Name
            </Label>
            <Input
              id="entity-name"
              value={entitiesName}
              onChange={(e) => setEntitiesName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., ask_program"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Examples</Label>
            <div className="col-span-3 space-y-2">
              {examples.map((example, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={example}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    placeholder="Add an example phrase"
                    className="flex-1"
                  />
                  {examples.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExample(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
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
                Add Example
              </Button>
            </div>
          </div>
        </div>
        {submitError && (
          <div className="text-sm text-red-500 mt-2">{submitError}</div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!entitiesName.trim() || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Entities"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
