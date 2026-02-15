import { Button } from "@/components/ui/button";
import { useInitiatePaymentQuery } from "@/redux/services/paymentApi";

interface EsewaPayProps {
  bookingId: number;
}

function EsewaPay({ bookingId }: EsewaPayProps) {
  const { data, isLoading } = useInitiatePaymentQuery(bookingId);

  const submitPayment = () => {
    if (!data || data?.amount <= 0) {
      alert("Invalid amount");
      return;
    }
    const payAmount = data?.amount;

    // Constants
    const serviceCharge = data?.product_service_charge;
    const taxAmount = 0;
    const deliveryCharge = data?.product_delivery_charge;
    const productCode = data?.product_code;

    // Derived values
    const amount = String(payAmount);
    const totalAmount = String(payAmount);
    const transactionUuid = data.transaction_uuid;

    // Signature generation
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signature = data?.signature;

    // Payload
    const payload: Record<string, string> = {
      amount,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: String(serviceCharge),
      product_delivery_charge: String(deliveryCharge),
      success_url: data?.success_url,
      failure_url: data?.failure_url,
      signed_field_names: signedFieldNames,
      signature,
      tax_amount: String(taxAmount),
    };

    // Create and submit form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    form.target = "_blank";

    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  return (
    <Button onClick={submitPayment} disabled={isLoading}>
      {isLoading ? "Loading..." : "Pay with eSewa"}
    </Button>
  );
}

export default EsewaPay;
