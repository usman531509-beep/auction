import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const carSchema = z.object({
  title: z.string().min(2),
  brand: z.string().min(1),
  carModel: z.string().min(1),
  year: z.coerce.number().int().min(1900).max(2100),
  description: z.string().optional().default(""),
  images: z.array(z.string().min(1)).default([]),
  price: z.coerce.number().min(0),
  mileage: z.coerce.number().min(0).optional().default(0),
  color: z.string().optional().default(""),
  transmission: z.enum(["automatic", "manual", ""]).optional().default(""),
  fuel: z.enum(["petrol", "diesel", "hybrid", "electric", ""]).optional().default(""),
  stock: z.coerce.number().int().min(0).optional().default(1),
  featured: z.boolean().optional(),
  status: z.enum(["available", "sold", "hidden"]).optional(),
});

export const orderItemSchema = z.object({
  carId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).default(1),
});

export const orderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  contact: z.string().min(5),
  address: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  items: z.array(orderItemSchema).min(1),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "completed", "cancelled"]),
});
