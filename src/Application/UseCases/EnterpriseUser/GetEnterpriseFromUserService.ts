import type { GetEnterpriseFromUserResponseDTO } from "@DTOs/EnterpriseUserDTO";
import { repo } from "@Infrastructure/Databases/PrismaClient";



export class GetEnterpriseFromUserService {
  async execute({ userId }: { userId: string }): Promise<GetEnterpriseFromUserResponseDTO[] | Error> {
    
    const varifiedUserId = await repo.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!varifiedUserId) {
      return Error("User not found");
    }


    const enterprisesFromUser = await repo.enterpriseUser.findMany({
      where: {
        userId: userId
      },
      include: {
        enterprise: true
      }
    })

    return enterprisesFromUser.map((item) => {
      return {
        id: item.enterprise.id,
        name: item.enterprise.name,
        isOwner: item.isOwner,
        createdAt: item.enterprise.createdAt,
        joinedAt: item.joinedAt
      }
    });

  }
}