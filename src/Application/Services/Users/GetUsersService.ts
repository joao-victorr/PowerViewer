import type { GetUsersReplyDTO } from "@DTOs/UsersDTO";
import { repo } from "@Infrastructure/Databases/PrismaClient";



export class GetUsersService {
  async execute(): Promise<GetUsersReplyDTO[]> {
    
    const user = repo.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true, 
        createdAt: true,
      }
    });


    return user;

  }
}