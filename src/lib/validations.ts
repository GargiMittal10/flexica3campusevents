import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .nonempty({ message: "Full name is required" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name must be less than 100 characters" })
      .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
    email: z
      .string()
      .trim()
      .nonempty({ message: "Email is required" })
      .email({ message: "Invalid email format" })
      .max(255, { message: "Email must be less than 255 characters" }),
    studentId: z
      .string()
      .trim()
      .nonempty({ message: "Student/Faculty ID is required" })
      .min(2, { message: "ID must be at least 2 characters" })
      .max(50, { message: "ID must be less than 50 characters" })
      .regex(/^[a-zA-Z0-9]+$/, { message: "ID can only contain letters and numbers" }),
    role: z.enum(["STUDENT", "FACULTY"], {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password must be less than 100 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
