import { z } from "zod";


export const CreateUsersSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long")
})

export type CreateUsersDTO = z.infer<typeof CreateUsersSchema>;


export const CreateUserReplySchema = z.object({
  userId: z.string(),
})

export type CreateUserReplyDTO = z.infer<typeof CreateUserReplySchema>;



export const GetUserByIdParamsSchema = z.object({
  id: z.string().cuid("Invalid user ID format"),
})

export type GetUserByIdParamsDTO = z.infer<typeof GetUserByIdParamsSchema>;


// const user: Prisma.PrismaPromise<{
//     id: string;
//     name: string;
//     email: string;
//     isActive: boolean;
//     createdAt: Date;
// }[]>

export const GetUsersReplySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  isActive: z.boolean(),
})

export type GetUsersReplyDTO = z.infer<typeof GetUsersReplySchema>