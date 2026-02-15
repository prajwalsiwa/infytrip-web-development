import { rootApi } from "../root.api";

export const paymentApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.query({
      query: (id: number) => ({
        url: `esewa-payment/${id}/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useInitiatePaymentQuery } = paymentApi;
