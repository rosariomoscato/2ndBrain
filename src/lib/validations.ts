/**
 * Zod validation schemas for all input validation across the application.
 *
 * These schemas are used in server actions to validate input before
 * database operations. They provide type-safe runtime validation with
 * helpful error messages.
 */

import { z } from "zod";

/**
 * Schema for creating a new note.
 */
export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title too long (max 500 characters)"),
  content: z.string().max(100000, "Content too long (max 100,000 characters)").optional(),
  tags: z.array(z.string()).max(20, "Too many tags (max 20)").default([]),
  importance: z
    .number()
    .int()
    .min(1, "Importance must be at least 1")
    .max(5, "Importance must be at most 5")
    .optional()
    .default(1),
});

/**
 * Schema for updating an existing note.
 * All fields are optional - only provided fields are updated.
 */
export const updateNoteSchema = z.object({
  id: z.string().uuid("Invalid note ID format"),
  title: z.string().min(1).max(500).optional(),
  content: z.string().max(100000).optional(),
  tags: z.array(z.string()).max(20, "Too many tags (max 20)").optional(),
  importance: z.number().int().min(1).max(5).optional(),
});

/**
 * Schema for deleting a note.
 */
export const deleteNoteSchema = z.object({
  id: z.string().uuid("Invalid note ID format"),
});

/**
 * Schema for creating a new tag.
 */
export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name too long (max 50 characters)")
    .trim()
    .refine((val) => val.length > 0, "Tag name cannot be empty or whitespace only"),
  color: z.enum(["purple", "cyan", "blue", "pink", "green", "orange"]),
});

/**
 * Schema for updating an existing tag.
 * All fields are optional - only provided fields are updated.
 */
export const updateTagSchema = z.object({
  id: z.string().uuid("Invalid tag ID format"),
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name too long (max 50 characters)")
    .trim()
    .refine((val) => val.length > 0, "Tag name cannot be empty or whitespace only")
    .optional(),
  color: z.enum(["purple", "cyan", "blue", "pink", "green", "orange"]).optional(),
});

/**
 * Schema for deleting a tag.
 */
export const deleteTagSchema = z.object({
  id: z.string().uuid("Invalid tag ID format"),
});

/**
 * Schema for AI query input.
 */
export const aiQuerySchema = z.object({
  query: z
    .string()
    .min(1, "Query cannot be empty")
    .max(2000, "Query too long (max 2000 characters)")
    .trim()
    .refine((val) => val.length > 0, "Query cannot be empty or whitespace only"),
});

/**
 * Schema for updating user settings.
 * All sections are optional - only provided sections are updated.
 */
export const updateSettingsSchema = z.object({
  theme: z
    .object({
      neonIntensity: z
        .number()
        .int()
        .min(0)
        .max(100, "Neon intensity must be between 0 and 100")
        .optional(),
      gridVisibility: z
        .number()
        .int()
        .min(0)
        .max(100, "Grid visibility must be between 0 and 100")
        .optional(),
      particleDensity: z
        .number()
        .int()
        .min(0)
        .max(100, "Particle density must be between 0 and 100")
        .optional(),
      scanLineSpeed: z
        .number()
        .int()
        .min(0)
        .max(100, "Scan line speed must be between 0 and 100")
        .optional(),
      preset: z.enum(["minimal", "balanced", "cyberpunk"]).optional(),
    })
    .optional(),
  system: z
    .object({
      glassmorphism: z.boolean().optional(),
      animations: z.boolean().optional(),
      notifications: z.boolean().optional(),
      soundEffects: z.boolean().optional(),
    })
    .optional(),
  ai: z
    .object({
      model: z.string().min(1, "AI model cannot be empty").optional(),
      embeddingModel: z.string().min(1, "Embedding model cannot be empty").optional(),
      openrouterApiKey: z.string().optional(),
      streamResponses: z.boolean().optional(),
      includeCitations: z.boolean().optional(),
      desktopNotifications: z.boolean().optional(),
    })
    .optional(),
});

// Export inferred types for use in server actions
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type DeleteTagInput = z.infer<typeof deleteTagSchema>;
export type AIQueryInput = z.infer<typeof aiQuerySchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
