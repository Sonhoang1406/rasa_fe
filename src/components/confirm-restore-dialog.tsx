import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

interface ConfirmRestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmRestoreDialog({ open, onOpenChange, onConfirm }: ConfirmRestoreDialogProps) {
  const handleRestore = async () => {
    try {
      await onConfirm();
      toast.success("Restored successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Restore failed, please try again!");
      console.error("Restore error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-gray-800/50" />
      <DialogContent className="max-w-sm p-6 text-center space-y-4">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <ArrowUpRight className="text-green-500 w-10 h-10" />
          <DialogTitle className="text-lg">Confirm Restore</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Do you want to restore this item from trash?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-4 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRestore}>
            Restore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
