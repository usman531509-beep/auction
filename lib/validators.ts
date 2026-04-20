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

export const auctionSchema = z.object({
  title: z.string().min(2),
  brand: z.string().min(1),
  carModel: z.string().min(1),
  year: z.coerce.number().int().min(1900).max(2100),
  description: z.string().optional().default(""),
  images: z.array(z.string().min(1)).default([]),
  startingPrice: z.coerce.number().min(0),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  featured: z.boolean().optional(),
});

export const bidSchema = z.object({
  amount: z.coerce.number().positive(),
});
