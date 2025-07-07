import { repo } from "@Databases/PrismaClient";
import type { GetUserByIdParamsDTO } from "@DTOs/UsersDTO";
import bcrypt from "bcrypt";



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
    
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await repo.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    return { id: user.id };
    
  }
}