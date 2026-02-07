import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCompleteBookingMutation } from "@/redux/services/staysApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Icon from "@/components/ui/Icon";

interface HotelPayProps {
  prePayAmount?: number;
}

function HotelPay({ prePayAmount }: HotelPayProps) {
  const bookId = localStorage.getItem("bookId");
  const [searchParams] = useSearchParams();
  const currency = searchParams.get("currency") || "NPR";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [completeBooking] = useCompleteBookingMutation();
  const userInfo = useSelector((state: RootState) => state.stays.userInfo);

  const { toast } = useToast();

  const handlePay = async () => {
    try {
      setIsLoading(true);
      await completeBooking({
        bookingId: bookId,
        payment_method: "pay-at-hotel",
        paying_amount: prePayAmount,
        promo_code: null,
        coupon_code: null,
        referral_earn_point: null,
        user_info: userInfo,
      }).unwrap();
      toast({
        title: "Booking Confirmed",
        description: "Your booking has been successfully confirmed.",
        variant: "success",
      });
      setIsLoading(false);
      navigate(`../${bookId}/booking-confirmed?currency=${currency}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Error", error);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 pr-20">
        <span className="font-medium text-lg">Pay directly at the hotel</span>
        <span className="text-gray-dark">
          We will confirm your booking without any charge, Pay directly at the
          hotel during your stay.
        </span>
      </div>
      <Button
        className="text-gray-dark bg-white border-gray border w-[13.25rem] !py-5 disabled:opacity-70"
        onClick={handlePay}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Icon name="hourglass_top" className="animate-spin text-sm" />
            <span>Processing...</span>
          </div>
        ) : (
          "Pay directly at hotel"
        )}
      </Button>
    </div>
  );
}

export default HotelPay;
