import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { authService } from "../api/service";
import { FcGoogle } from "react-icons/fc";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await authService.login({ email, password });
      // TODO: setAuth ở store sau khi login thành công
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-[400px] shadow-xl rounded-3xl border border-gray-200">
        
        <CardTitle className="text-center text-2xl font-bold mb-2">
          Đăng nhập Chatbot
        </CardTitle>
        <p className="text-center text-sm text-gray-500 mb-4">
          Đăng nhập bằng tài khoản google hoặc email của bạn
        </p>
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto w-24 h-auto" />
        </div>
        <CardContent className="flex flex-col gap-4">
          {/* Nút tiếp tục với dịch vụ */}
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full justify-center">
              Tiếp tục với Google
            </Button>
          </div>

          <div className="flex items-center gap-2 my-2">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400">hoặc</span>
            <Separator className="flex-1" />
          </div>

          {/* Form email / password */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-left">
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl" onClick={handleLogin}>
              Đăng nhập
            </Button>
          </div>

          {/* Link sang đăng ký */}
          <p className="text-sm text-center text-gray-500">
            Chưa có tài khoản?{" "}
            <a href="/auth/register" className="underline">
              Đăng ký
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
// import { Button } from "./ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Input } from "./ui/input";
// import { Separator } from "./ui/separator";
// import { ImageWithFallback } from "./figma/ImageWithFallback";
// import { useState } from "react";

// export const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       // Mock login functionality
//       console.log("Login attempt with:", { email, password });
//       // TODO: Implement actual login logic
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleGoogleLogin = () => {
//     // Mock Google login
//     console.log("Google login clicked");
//   };

//   return (
//     <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
//       <Card className="w-full shadow-xl rounded-3xl border-0 bg-gradient-to-b from-white to-gray-50/50">
//         <CardHeader className="space-y-4 pt-8 pb-4">
//           <div className="text-center space-y-3">
//             <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
//               <ImageWithFallback 
//                 src="https://images.unsplash.com/photo-1588869715773-c6641407939b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGF0Ym90JTIwcm9ib3QlMjBsb2dvJTIwc2ltcGxlfGVufDF8fHx8MTc1ODk5MTc4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
//                 alt="Chatbot Logo" 
//                 className="w-12 h-12 rounded-xl object-cover"
//               />
//             </div>
//             <CardTitle className="text-center text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//               Đăng nhập vào Chatbot
//             </CardTitle>
//             <p className="text-center text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
//               Điền email của bạn hay tên người dùng để đăng nhập
//             </p>
//           </div>
//         </CardHeader>
        
//         <CardContent className="flex flex-col gap-6 px-8 pb-8">
//           {/* Google Login Button */}
//           <div className="flex flex-col gap-4">
//             <Button 
//               variant="outline" 
//               className="w-full justify-center h-12 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200 hover:border-gray-300"
//               onClick={handleGoogleLogin}
//             >
//               <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Tiếp tục với Google
//             </Button>
//           </div>

//           <div className="flex items-center gap-4">
//             <Separator className="flex-1 bg-gray-200" />
//             <span className="text-sm text-gray-400 px-2">hoặc</span>
//             <Separator className="flex-1 bg-gray-200" />
//           </div>

//           {/* Email/Password Form */}
//           <div className="flex flex-col gap-4">
//             <div className="space-y-2">
//               <Input
//                 type="email"
//                 placeholder="Địa chỉ email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="h-12 rounded-xl border-2 bg-gray-50/50 border-gray-200 focus:border-blue-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
//               />
//             </div>
//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 placeholder="Mật khẩu"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="h-12 rounded-xl border-2 bg-gray-50/50 border-gray-200 focus:border-blue-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
//               />
//             </div>
//             <Button 
//               className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
//               onClick={handleLogin}
//             >
//               Đăng nhập
//             </Button>
//           </div>

//           {/* Signup Link */}
//           <div className="text-center">
//             <p className="text-sm text-gray-500">
//               Chưa có tài khoản?{" "}
//               <a 
//                 href="/auth/register" 
//                 className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors duration-200"
//               >
//                 Đăng ký
//               </a>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };