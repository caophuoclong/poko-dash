import { z } from "zod";
import type {
  PostProductsRequest,
  PatchProductsByProductIdRequest,
} from "./products.dto";

export const ProductCreateSchema = z.object({
  canonicalTitle: z
    .string()
    .min(2, "Tên sản phẩm phải có ít nhất 2 ký tự")
    .max(500, "Tên sản phẩm không được vượt quá 500 ký tự"),
  brand: z.string().optional(),
  category: z.string().min(1, "Danh mục không được để trống"),
  subCategory: z.string().optional(),
  specsKeyFacts: z.string().optional(),
  priceCurrent: z.string().optional(),
  priceSale: z.string().optional(),
  currency: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  sourceBestUrl: z.string().url("URL nguồn không hợp lệ"),
  imageCover: z.string().url("URL ảnh bìa không hợp lệ").optional(),
  imageVariants: z.string().optional(),
  videoUrl: z.string().url("URL video không hợp lệ").optional(),
  descriptionImages: z.string().optional(),
  notes: z.string().optional(),
  variants: z.string().optional(),
  availability: z.string().optional(),
  sellerName: z.string().optional(),
  dealScore: z.number().min(0).max(100),
  publishScore: z.number().min(0).max(100),
  freshUntil: z.string().optional(),
  status: z.enum(["active", "processing", "done", "failed"]),
}) satisfies z.ZodType<PostProductsRequest>;

export type ProductCreateFormData = z.infer<typeof ProductCreateSchema>;

export const ProductEditSchema = z.object({
  canonicalTitle: z
    .string()
    .min(2, "Tên sản phẩm phải có ít nhất 2 ký tự")
    .max(500, "Tên sản phẩm không được vượt quá 500 ký tự")
    .optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  specsKeyFacts: z.string().optional(),
  priceCurrent: z.string().optional(),
  priceSale: z.string().optional(),
  currency: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  sourceBestUrl: z.string().url("URL nguồn không hợp lệ").optional(),
  imageCover: z.string().url("URL ảnh bìa không hợp lệ").optional(),
  imageVariants: z.string().optional(),
  videoUrl: z.string().url("URL video không hợp lệ").optional(),
  descriptionImages: z.string().optional(),
  notes: z.string().optional(),
  variants: z.string().optional(),
  availability: z.string().optional(),
  sellerName: z.string().optional(),
  dealScore: z.number().min(0).max(100).optional(),
  publishScore: z.number().min(0).max(100).optional(),
  freshUntil: z.string().optional(),
  status: z.enum(["active", "processing", "done", "failed"]).optional(),
}) satisfies z.ZodType<PatchProductsByProductIdRequest>;

export type ProductEditFormData = z.infer<typeof ProductEditSchema>;
