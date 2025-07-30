import { bool, object, ref, string } from "yup";

export const registerSchema = object().shape({
  username: string().required("username is required"),
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  acceptTerms: bool().oneOf([true], "You must accept Terms & Conditions"),
});
