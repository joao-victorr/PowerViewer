import { repo } from "@Databases/PrismaClient";
import type { EnterpriseReplyDTO } from "@DTOs/EnterpriseDTO";



export class GetEnterpriseByIdService {
  async execute(enterpriseId: string): Promise< EnterpriseReplyDTO| Error> {
    
    const enterprise = await repo.enterprise.findUnique({
      where: {
        id: enterpriseId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
            select: {
              users: true,
              groups: true,
              permissions: true,
              roles: true
            }
          }
      },
      
    })

    if (!enterprise) {
      return Error("Enterprise not found");
    }

    return enterprise;
  }
}