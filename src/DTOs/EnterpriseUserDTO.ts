import z from "zod";


export const LinkEnterpriseUserSchema = z.object({
  userId: z.string().cuid(),
  enterpriseId: z.string().cuid(),
});

export type LinkEnterpriseUserDTO = z.infer<typeof LinkEnterpriseUserSchema>;



export const LinkEnterpriseUserResponseSchema = z.object({
  userId: z.string().cuid(),
  enterpriseId: z.string().cuid(),
});

export type LinkEnterpriseUserResponseDTO = z.infer<typeof LinkEnterpriseUserResponseSchema>;


export const GetEnterpriseFromUserResponseSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  isOwner: z.boolean(),
  createdAt: z.date(),
  joinedAt: z.date(),
});

export type GetEnterpriseFromUserResponseDTO = z.infer<typeof GetEnterpriseFromUserResponseSchema>;


export const GetUsersFromEnterpriseResponseSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
  isOwner: z.boolean(),
  createdAt: z.date(),
  joinedAt: z.date(),
});

export type GetUsersFromEnterpriseResponseDTO = z.infer<typeof GetUsersFromEnterpriseResponseSchema>;