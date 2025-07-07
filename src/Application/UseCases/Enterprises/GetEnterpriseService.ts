import { repo } from "@Databases/PrismaClient";
import type { EnterpriseReply } from "@DTOs/EnterpriseDTO";



export class GetEnterpriseService {
  async execute(_enterpriseId: string): Promise< EnterpriseReply[]| Error> {
    
    const enterprise = await repo.enterprise.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
            select: {
              users: true,
              dashboards: true,
              groups: true,
              permissions: true,
              roles: true
            }
          }
      },
    })

    return enterprise;
  }
}