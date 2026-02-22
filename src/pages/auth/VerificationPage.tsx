import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import registerbanner from "@/assets/Images/loginbanner.png";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "@/redux/services/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface VerificationCodeProps {
  onResend?: () => void;
  codeLength?: number;
}

const EmailVerification: React.FC<VerificationCodeProps> = ({
  onResend,
  codeLength = 6,
}) => {
  const [code, setCode] = useState<string[]>(() => Array(codeLength).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const location = useLocation();

  const emailFromState =
    (location.state as { email?: string })?.email ?? "your email";

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d$/.test(value)) return;

    setCode((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    setError("");
    inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, codeLength);

    if (!pasted) return;

    setCode((prev) => {
      const next = [...prev];
      pasted.split("").forEach((d, i) => (next[i] = d));
      return next;
    });

    inputRefs.current[Math.min(pasted.length, codeLength - 1)]?.focus();
  };

  const handleVerify = async () => {
    const otp = code.join("");

    if (otp.length !== codeLength) {
      setError(`Please enter all ${codeLength} digits`);
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await verifyEmail({ email: emailFromState, otp }).unwrap();
      setIsVerified(true);
      toast({
        title: "Email Verified Successfully",
        description: "You can now login with your email.",
        variant: "success",
      });
    } catch (err: any) {
      setError("Invalid or expired verification code");
      toast({
        title: "Email Verification Failed",
        description: err?.data?.detail || "Failed to verify email",
        variant: "destructive",
      });
      setCode(Array(codeLength).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const [resendOtp] = useResendOtpMutation();

  const handleResend = () => {
    setCode(Array(codeLength).fill(""));
    setError("");
    setIsVerified(false);
    inputRefs.current[0]?.focus();
    onResend?.();
    resendOtp({ email: emailFromState });
  };

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Banner */}
      <div className="hidden lg:block lg:w-1/2 h-screen overflow-hidden">
        <img
          src={registerbanner}
          alt="Login Banner"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {!isVerified ? (
            <>
              <h2 className="text-2xl font-bold mb-2">
                Enter Verification Code
              </h2>

              <p className="text-gray-600 mb-6">
                Code sent to {emailFromState}
              </p>

              <div className="flex gap-2 justify-between mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    value={digit}
                    maxLength={1}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isVerifying}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-blue-600 outline-none"
                  />
                ))}
              </div>

              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={isVerifying || code.some((d) => !d)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:bg-gray-300"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
                {!isVerifying && <ArrowRight className="w-5 h-5" />}
              </button>

              <p className="text-center text-sm mt-4">
                Didn’t get the code?{" "}
                <button
                  onClick={handleResend}
                  className="text-blue-600 font-semibold"
                >
                  Resend
                </button>
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Email Verified!</h3>
              <p className="text-gray-600 mb-6">
                Your account has been verified
              </p>
              <button
                onClick={handleContinue}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
