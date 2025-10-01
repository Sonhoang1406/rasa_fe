import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="w-full">
      <Separator />
      <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-sm py-4">
        <a href="/privacy" className="hover:underline">Chính Sách Quyền Riêng Tư</a>
        <a href="/terms" className="hover:underline">Điều Khoản Sử Dụng</a>
        <a href="/refund" className="hover:underline">Bán Hàng Và Hoàn Tiền</a>
        <a href="/legal" className="hover:underline">Pháp Lý</a>
        <a href="/sitemap" className="hover:underline">Bản Đồ Trang Web</a>
      </div>
    </footer>
  );
};
