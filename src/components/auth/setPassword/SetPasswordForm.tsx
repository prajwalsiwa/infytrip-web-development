import { SetStateAction, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "@/components/ui/FormUI/Input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icon";
import infytripLogo from "@/assets/Images/infytripLogo.png";
import { useSetPasswordMutation } from "@/redux/services/authApi";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetPasswordFormProps {
  isLogo?: boolean;
}

function SetPasswordForm({ isLogo }: SetPasswordFormProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = location.state?.token; // ✅ token from forgot-password

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isRetypePasswordVisible, setRetypePasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const [setPasswordMutation, { isLoading }] = useSetPasswordMutation();
  const { toast } = useToast();

  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordMatchError(retypePassword !== "" && value !== retypePassword);
  };

  const handleRetypePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    const value = e.target.value;
    setRetypePassword(value);
    setPasswordMatchError(password !== "" && value !== password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        variant: "destructive",
        description: "Invalid or expired reset link",
      });
      return;
    }

    if (password !== retypePassword) {
      setPasswordMatchError(true);
      return;
    }

    try {
      await setPasswordMutation({
        token,
        password,
        confirm_password: retypePassword,
      }).unwrap();

      toast({
        title: "Password Set Successfully",
        description: "You can now login with your new password.",
        variant: "success",
      });

      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Set Password Failed",
        description: err?.data?.detail || "Failed to set password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-20 flex items-center flex-col gap-7 w-full h-full justify-center">
      <div className="gap-7 flex flex-col w-full">
        {isLogo && (
          <div className="logo cursor-pointer" onClick={() => navigate("/")}>
            <img src={infytripLogo} alt="" />
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-[2rem]">Set Password</span>
          <span>Enter your new password below</span>
        </div>
      </div>

      <form className="form flex flex-col w-full gap-4" onSubmit={handleSubmit}>
        <div className="h-full w-full gap-3 flex flex-col">
          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <Input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="border rounded !bg-white hover:!border-primary pr-10"
            />
            <Icon
              name={isPasswordVisible ? "visibility" : "visibility_off"}
              onClick={() => setPasswordVisible((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1 relative">
            <Input
              type={isRetypePasswordVisible ? "text" : "password"}
              placeholder="Retype Password"
              value={retypePassword}
              onChange={handleRetypePasswordChange}
              className="border rounded !bg-white hover:!border-primary pr-10"
            />
            <Icon
              name={isRetypePasswordVisible ? "visibility" : "visibility_off"}
              onClick={() => setRetypePasswordVisible((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            />
            {passwordMatchError && (
              <span className="text-red-500 text-sm">
                Passwords do not match
              </span>
            )}
          </div>
        </div>

        <Button
          className="rounded p-7 hover:bg-sky-600"
          type="submit"
          disabled={isLoading}
        >
          Set Password
          {isLoading && <Loader2 className="animate-spin ml-2" />}
        </Button>
      </form>
    </div>
  );
}

export default SetPasswordForm;
