"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";

import Input from "@/components/ui/FormUI/Input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icon";
import infytripLogo from "@/assets/Images/infytripLogo.png";
import { useSetPasswordMutation } from "@/redux/services/authApi";
import { useToast } from "@/hooks/use-toast";
import setPasswordSchema from "./schema";

interface SetPasswordFormProps {
  isLogo?: boolean;
}

type FormValues = {
  password: string;
  confirm_password: string;
};

function SetPasswordForm({ isLogo }: SetPasswordFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token;

  const { toast } = useToast();
  const [setPasswordMutation, { isLoading }] = useSetPasswordMutation();

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(setPasswordSchema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast({
        variant: "destructive",
        description: "Invalid or expired reset link",
      });
      return;
    }

    try {
      await setPasswordMutation({
        token,
        password: data.password,
        confirm_password: data.confirm_password,
      }).unwrap();

      toast({
        title: "Password Set Successfully",
        description: "You can now login with your new password.",
        variant: "success",
      });

      navigate("/login");
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: err?.data?.detail || "Failed to set password",
      });
    }
  };

  return (
    <div className="px-20 flex flex-col items-center justify-center h-full w-full gap-7">
      {/* Logo */}
      {isLogo && (
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <img src={infytripLogo} alt="logo" />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1 w-full">
        <span className="text-[2rem] font-semibold">Set Password</span>
        <span className="text-gray-500">Enter your new password below</span>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        {/* Password */}
        <div className="relative flex flex-col gap-1">
          <Input
            type={isPasswordVisible ? "text" : "password"}
            label="Password"
            placeholder="Password"
            className="border rounded !bg-white hover:!border-primary pr-10"
            required
            {...register("password")}
          />
          <Icon
            name={isPasswordVisible ? "visibility" : "visibility_off"}
            onClick={() => setPasswordVisible((p) => !p)}
            className="absolute right-3 top-9 cursor-pointer"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative flex flex-col gap-1">
          <Input
            type={isConfirmPasswordVisible ? "text" : "password"}
            label="Retype Password"
            placeholder="Retype Password"
            className="border rounded !bg-white hover:!border-primary pr-10"
            required
            {...register("confirm_password")}
          />
          <Icon
            name={isConfirmPasswordVisible ? "visibility" : "visibility_off"}
            onClick={() => setConfirmPasswordVisible((p) => !p)}
            className="absolute right-3 top-9 cursor-pointer"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="rounded p-7 hover:bg-sky-600"
          disabled={isLoading}
        >
          Set Password
          {isLoading && <Loader2 className="ml-2 animate-spin" />}
        </Button>
      </form>
    </div>
  );
}

export default SetPasswordForm;
