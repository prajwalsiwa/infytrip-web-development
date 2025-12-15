import { Button } from "@/components/ui/button";
import CryptoJS from "crypto-js";

interface EsewaPayProps {
  payingAmount?: number;
}

function EsewaPay({ payingAmount = 0 }: EsewaPayProps) {
  const submitPayment = () => {
    if (payingAmount <= 0) {
      alert("Invalid amount");
      return;
    }

    // Constants
    const serviceCharge = 0;
    const taxAmount = 0;
    const deliveryCharge = 0;
    const productCode = "EPAYTEST";
    const secretKey = "8gBm/:&EnhH.1/q";
    const successUrl = "http://localhost:5173/booking-confirmed";
    const failureUrl = "http://localhost:5173/payment-failed";

    // Derived values
    const amount = String(payingAmount);
    const totalAmount = String(
      payingAmount + serviceCharge + taxAmount + deliveryCharge
    );
    const transactionUuid = `TXN_${Date.now()}`;

    // Signature generation
    const signedFieldNames =
      "amount,total_amount,transaction_uuid,product_code";
    const message = `amount=${amount},total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hash = CryptoJS.HmacSHA256(message, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    // Payload
    const payload: Record<string, string> = {
      amount,
      tax_amount: String(taxAmount),
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: String(serviceCharge),
      product_delivery_charge: String(deliveryCharge),
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: signedFieldNames,
      signature,
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
    form.remove(); // ✅ cleanup after submit
  };

  return <Button onClick={submitPayment}>Pay with eSewa</Button>;
}

export default EsewaPay;
