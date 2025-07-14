import { repo } from "@Databases/PrismaClient";
import type { EnterpriseReplyDTO } from "@DTOs/EnterpriseDTO";



export class GetEnterprisesService {
  async execute(): Promise< EnterpriseReplyDTO[]| Error> {
    
    const enterprise = await repo.enterprise.findMany({
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

    return enterprise;
  }
}