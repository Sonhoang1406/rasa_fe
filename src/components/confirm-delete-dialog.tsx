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
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await onConfirm();
      toast.success("Deleted Successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Delete failed, please try again!");
      console.error("Delete error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Updated DialogOverlay to have light gray matted effect */}
      <DialogOverlay className="bg-gray-800/50" />{" "}
      {/* Use gray overlay with 50% opacity */}
      <DialogContent className="max-w-sm p-6 text-center space-y-4">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <AlertTriangle className="text-red-500 w-10 h-10" />
          <DialogTitle className="text-lg">Confirm Deletion</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Are you sure you want to{" "}
            <span className="text-red-500 font-semibold">delete</span> this
            item?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-4 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmSoftDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await onConfirm();
      toast.success("Moved to trash");
      onOpenChange(false);
    } catch (error) {
      toast.error("Move to trash failed, please try again!");
      console.error("Soft delete error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-gray-800/50" />
      <DialogContent className="max-w-sm p-6 text-center space-y-4">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <AlertTriangle className="text-orange-500 w-10 h-10" />
          <DialogTitle className="text-lg">Confirm Move to Trash</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Are you sure you want to move this item to trash? You can restore it later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-4 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Move to Trash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmHardDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await onConfirm();
      toast.success("Deleted permanently");
      onOpenChange(false);
    } catch (error) {
      toast.error("Delete failed, please try again!");
      console.error("Hard delete error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-gray-800/50" />
      <DialogContent className="max-w-sm p-6 text-center space-y-4">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <AlertTriangle className="text-red-500 w-10 h-10" />
          <DialogTitle className="text-lg">Confirm Permanent Deletion</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            This action will permanently delete the item and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-4 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
