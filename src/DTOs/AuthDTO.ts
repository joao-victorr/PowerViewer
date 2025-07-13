import z from "zod";

export const AuthenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
export type AuthenticateUserDTO = z.infer<typeof AuthenticateUserSchema>;

export const AuthenticateUserResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string().cuid(),
    name: z.string(),
    email: z.string().email()
  })
});
export type AuthenticateUserResponseDTO = z.infer<typeof AuthenticateUserResponseSchema>;

