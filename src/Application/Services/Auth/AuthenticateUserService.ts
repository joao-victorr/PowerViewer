import type { AuthenticateUserDTO } from "@DTOs/AuthDTO";
import { signToken } from "@Infrastructure/Auth/JWT";
import { repo } from "@Infrastructure/Databases/PrismaClient";
import { comparePassword } from "@Infrastructure/Security/EncryptionUtils";

export class AuthenticateUserService {
  async execute({ email, password }: AuthenticateUserDTO) {
    const user = await repo.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = signToken({ sub: user.id });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
}
