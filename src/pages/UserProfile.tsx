import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { date, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar, CalendarIcon, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/auth";

const profileSchema = z.object({
  firstName: z.string().min(1, "Tên không được để trống"),
  lastName: z.string().min(1, "Họ không được để trống"),
  phoneNumber: z.string().min(1, "Số điện thoại không được để trống"),
  dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  gender: z.string().min(1, "Giới tính không được để trống"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const UserProfileForm = () => {
  //   const {
  //     getProfile,
  //     updateProfile,
  //     updateAvatar,
  //     updatePassword,
  //   } = useUser();

  //   const user = useUserStore((state) => state.user);
  //   const setUser = useUserStore((state) => state.setUser);
  const setUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);

  const { getMe, updateMe } = useMe();

  const [isEditing, setIsEditing] = useState(false);

  // Dialog để đổi avatar
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Dialog để đổi mật khẩu
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getMe();
        if (!userProfile) return;
        setUser(userProfile);
        reset({
          firstName: userProfile.data.firstName,
          phoneNumber: userProfile.data.phoneNumber,
          gender: userProfile.data.gender,
          dateOfBirth: userProfile.data.dateOfBirth.substring(0, 10),
          address: userProfile.data.address,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updatedUser = await updateMe(data);
      if (!updatedUser) return;
      setUser(updatedUser);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  const genderValue = watch("gender", user.data.gender);

  return (
    <div className="p-4 md:p-6 max-w-4xl w-full mx-auto min-h-screen flex flex-col gap-6">
      <div className="bg-gradient-to-r from-blue-100 to-yellow-100 rounded-xl p-4 md:p-6 transition-all duration-300 ease-in-out dark:from-blue-800 dark:to-yellow-800">
        <Button
          variant="outline"
          className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200"
          onClick={() => navigate(-1)} // Quay lại trang trước đó
        >
          ← Quay lại
        </Button>
        <div className="flex items-center space-x-4 relative">
          {/* Avatar có nút sửa */}
          <div className="relative w-16 h-16">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.data.avatar} className="object-cover" />
              <AvatarFallback>{user.data.firstName?.[0] || "?"}</AvatarFallback>
            </Avatar>

            <button
              type="button"
              className="absolute bottom-0 right-0 bg-card p-1 text-card-foreground rounded-full shadow hover:scale-105 transition-all dark:bg-gray-700 dark:text-white"
              onClick={() => setOpenAvatarDialog(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-700 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
                />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </button>
          </div>

          {/* Thông tin người dùng */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              {user.data.firstName}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground dark:text-gray-300">
              {user.data.email}
            </p>
          </div>

          {/* Nút Edit/Cancel */}
          <Button
            className="ml-auto"
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) reset(user); // reset khi bấm Cancel
            }}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card text-card-foreground rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 dark:bg-gray-800 dark:text-white"
      >
        <div>
          <label className="text-sm md:text-base font-medium">Full Name</label>
          {isEditing ? (
            <Input
              {...register("name")}
              placeholder="Your First Name"
              className="text-sm mt-1 md:text-base dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <p className="mt-1">{user.name}</p>
          )}
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm md:text-base font-medium">
            Date of Birth
          </label>
          {isEditing ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full text-left mt-1 text-sm md:text-base font-normal px-2 py-1.5 border rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600",
                    !watch("dob") && "text-muted-foreground"
                  )}
                >
                  {watch("dob")
                    ? format(new Date(watch("dob")), "dd/MM/yyyy")
                    : "Chọn ngày sinh"}
                  <CalendarIcon className="ml-auto float-right h-5 w-5 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch("dob") ? new Date(watch("dob")) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Chuyển đổi sang định dạng ngày mà không bị ảnh hưởng múi giờ
                      const localDate = new Date(date);
                      localDate.setMinutes(
                        localDate.getMinutes() - localDate.getTimezoneOffset()
                      ); // Điều chỉnh theo múi giờ
                      setValue("dob", localDate.toISOString().substring(0, 10)); // Lưu ngày theo định dạng yyyy-mm-dd
                    }
                  }}
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <p className="mt-1">
              {new Date(user.dob).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm md:text-base font-medium">Gender</label>
          {isEditing ? (
            <Select
              onValueChange={(val) =>
                setValue("gender", val as "MALE" | "FEMALE")
              }
              value={genderValue}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value="FEMALE">Nữ</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="mt-1">{user.gender === "MALE" ? "Nam" : "Nữ"}</p>
          )}
        </div>

        <div>
          <label className="text-sm md:text-base font-medium">Address</label>
          {isEditing ? (
            <Input
              {...register("address")}
              placeholder="Your Address"
              className="text-sm mt-1 md:text-base dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <p className="mt-1">{user.address}</p>
          )}
        </div>

        <div>
          <label className="text-sm md:text-base font-medium">Phone</label>
          {isEditing ? (
            <Input
              {...register("phone")}
              placeholder="Your Phone"
              className="text-sm mt-1 md:text-base dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <p className="mt-1">{user.phone}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="text-sm md:text-base font-medium">
            My email Address
          </label>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">📧</span>
            <p className="mt-1">{user.email}</p>
          </div>
        </div>

        {isEditing && (
          <div className="col-span-2 flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        )}
      </form>

      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 dark:bg-gray-800 dark:text-white">
        <p className="text-sm md:text-base font-medium">Change Password</p>
        <div className="col-span-4 flex justify-start items-center gap-4">
          <Button onClick={() => setOpenPasswordDialog(true)}>
            Change Password
          </Button>
        </div>
      </div>

      {/* Dialog Change Password */}
      <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Old Password */}
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">
                Mật khẩu hiện tại
              </label>
              <Input
                type={showOldPass ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-background text-foreground"
              />
              <div
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setShowOldPass(!showOldPass)}
              >
                {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">
                Mật khẩu mới
              </label>
              <Input
                type={showNewPass ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-background text-foreground"
              />
              <div
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setShowNewPass(!showNewPass)}
              >
                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">
                Nhập lại mật khẩu mới
              </label>
              <Input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background text-foreground"
              />
              <div
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenPasswordDialog(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={async () => {
                setPasswordError("");
                if (!oldPassword || !newPassword || !confirmPassword) {
                  setPasswordError("Vui lòng nhập đầy đủ thông tin");
                  return;
                }
                if (newPassword !== confirmPassword) {
                  setPasswordError("Mật khẩu mới và nhập lại không khớp");
                  return;
                }

                try {
                  await updatePassword({
                    oldPassword,
                    newPassword,
                    newPasswordConfirm: confirmPassword,
                  });
                  toast.success("Đổi mật khẩu thành công!");
                  setOpenPasswordDialog(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                } catch (err) {
                  setPasswordError(
                    "Đổi mật khẩu không thành công, thử lại sau"
                  );
                }
              }}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openAvatarDialog} onOpenChange={setOpenAvatarDialog}>
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Đổi ảnh đại diện</DialogTitle>
          </DialogHeader>

          {selectedFile && (
            <div className="mb-4">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Avatar"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
            }}
            className="bg-background text-foreground"
          />

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenAvatarDialog(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={async () => {
                if (!selectedFile) return;
                try {
                  const userUpdated = await updateAvatar(selectedFile);
                  toast.success("Cập nhật avatar thành công!");
                  if (!userUpdated) return;
                  setUser(userUpdated);
                  setSelectedFile(null);
                  setOpenAvatarDialog(false);
                } catch (err) {
                  console.error("Lỗi khi cập nhật avatar:", err);
                }
              }}
            >
              Lưu ảnh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
