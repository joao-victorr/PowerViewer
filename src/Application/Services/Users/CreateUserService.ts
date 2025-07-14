import { repo } from "@Databases/PrismaClient";
import type { GetUserByIdParamsDTO } from "@DTOs/UsersDTO";
import { hashPassword } from "@Infrastructure/Security/EncryptionUtils";



type userCreateData = {
  name: string;
  email: string;
  password: string;
}


export class CreateUserService {
  async execute({ name, email, password }: userCreateData): Promise<GetUserByIdParamsDTO | Error> {

    const verifyEmailExists = await repo.user.findFirst({
      where: {
        email: email,
      },
    })

    if (verifyEmailExists) {
      return Error("Email already exists");
    }
    
    const passwordHash = await hashPassword(password);

    const user = await repo.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    return { id: user.id };
    
  }
}