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