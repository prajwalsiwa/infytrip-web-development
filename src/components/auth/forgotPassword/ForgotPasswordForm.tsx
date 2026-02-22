import Input from "@/components/ui/FormUI/Input";
import infytripLogo from "@/assets/Images/infytripLogo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/redux/services/authApi";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "./schema";

interface ForgetFormProps {
  isLogo?: boolean;
}

type FormValues = {
  email: string;
};

function ForgetPasswordForm({ isLogo }: ForgetFormProps) {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormValues) => {
    const response = await forgotPassword({ email: data.email });

    if (response?.data) {
      navigate("/set-password", {
        state: { token: response?.data?.token },
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
          <span className="text-[2rem]">Forget Password</span>
          <span>Enter your email address, We’ll send you OTP</span>
        </div>
      </div>

      <form
        className="form flex flex-col w-full gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="h-full w-full gap-3 flex flex-col">
          <div className="email flex flex-col gap-1">
            <Input
              type="email"
              id="email"
              placeholder="Email"
              label="Email"
              className="border rounded !bg-white hover:!border-primary"
              required
              {...register("email")}
            />

            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        <Button
          className="rounded p-7 hover:bg-sky-600"
          type="submit"
          disabled={isLoading}
        >
          Continue
          {isLoading && <Loader2 className="animate-spin ml-2" />}
        </Button>
      </form>

      <div className="flex gap-2 w-full justify-start">
        <span
          className="cursor-pointer hover:text-sky-600 text-primary"
          onClick={() => navigate("/abc")}
        >
          Send code again
        </span>
      </div>
    </div>
  );
}

export default ForgetPasswordForm;
