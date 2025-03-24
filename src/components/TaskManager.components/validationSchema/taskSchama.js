import { z } from "zod";

export const taskSchema = z.object({
    name: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    due_date: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)) && new Date(date) >= new Date().setHours(0, 0, 0, 0),
      { message: "Due date must be today or later" }
    ),
  });