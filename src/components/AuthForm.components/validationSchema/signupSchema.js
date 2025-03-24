import * as z from "zod";

export const signupSchemas = [
    z.object({
      email: z.string().email("Provide a valid email"),
    }),
    z.object({
      password: z.string().min(6, "Password must be at least 6 characters"),
    }),
    z.object({
      confirmPassword: z.string(),
    }),
  ];