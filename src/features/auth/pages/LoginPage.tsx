import { Button } from "@/components/ui/button";
import { authService } from "../api/service";

export const LoginPage = () => {
  return <div>
    <Button onClick={
      () => {
        authService.login({
          email: 'duongdaoq@gmail.com',
          password: 'Duck130603@'
        })
      }
    }></Button>
  </div>;
};
