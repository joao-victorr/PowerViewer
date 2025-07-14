import type { GetUsersFromEnterpriseResponseDTO } from "@DTOs/EnterpriseUserDTO";
import { repo } from "@Infrastructure/Databases/PrismaClient";


export class GetUsersFromEnterpriseServices {
  async execute({ enterpriseId }: { enterpriseId: string }): Promise<GetUsersFromEnterpriseResponseDTO[] | Error> {
    const verifiedEnterprise = await repo.enterprise.findUnique({
      where: {
        id: enterpriseId
      }
    });

    if (!verifiedEnterprise) {
      return Error("Enterprise not found");
    }

    const usersFromEnterprise = await repo.enterpriseUser.findMany({
      where: {
        enterpriseId: enterpriseId
      },
      include: {
        user: true
      }
    });

    return usersFromEnterprise.map((item) => {
      return {
        id: item.user.id,
        name: item.user.name,
        email: item.user.email,
        isOwner: item.isOwner,
        createdAt: item.user.createdAt,
        joinedAt: item.joinedAt
      }
    });
    
  }
}