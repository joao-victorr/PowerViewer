
import { z } from "zod";

export const GetEnterpriseReplySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.date(), // ou z.coerce.date() se você quiser transformar
  _count: z.object({
    users: z.number(),
    groups: z.number(),
    permissions: z.number(),
    roles: z.number(),
  }),
});

export type EnterpriseReplyDTO = z.infer<typeof GetEnterpriseReplySchema>;


//Schema para dados de criação de Empresas


export const CreateEnterpriseSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

export type CreateEnterpriseDTO = z.infer<typeof CreateEnterpriseSchema>;


export const GetEnterpriseByIdParamsSchema = z.object({
  id: z.string().cuid("Invalid enterprise ID format"),
})

export type GetEnterpriseByIdParamsDTO = z.infer<typeof GetEnterpriseByIdParamsSchema>;