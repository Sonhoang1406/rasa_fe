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
import { RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

interface ConfirmRestoreDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function ConfirmRestoreDialog({
                                         open,
                                         onOpenChange,
                                         onConfirm,
                                     }: ConfirmRestoreDialogProps) {
    const handleRestore = async () => {
        try {
            await onConfirm();
            onOpenChange(false); // Đóng dialog sau khi khôi phục
        } catch (error) {
            toast.error("Khôi phục thất bại, vui lòng thử lại!");
            console.error("Khôi phục lỗi:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay className="bg-transparent" />
            <DialogContent className="max-w-sm p-6 text-center space-y-4">
                <DialogHeader className="flex flex-col items-center space-y-2">
                    <RefreshCw className="text-yellow-500 w-10 h-10" />
                    <DialogTitle className="text-lg">Xác nhận khôi phục</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Bạn có chắc chắn muốn <span className="text-green-500 font-semibold">khôi phục</span> mục này không?
                        <br />
                        Hành động này sẽ khôi phục lại dữ liệu như ban đầu.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-center gap-4 pt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleRestore}>
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
