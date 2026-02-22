import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});