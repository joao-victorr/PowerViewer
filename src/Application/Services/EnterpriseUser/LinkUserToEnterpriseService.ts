import { repo } from "@Infrastructure/Databases/PrismaClient";


type UserToEnterpriseType = {
  userId: string;
  enterpriseId: string;
}


export class LinkUserToEnterpriseService {
  async execute({ userId, enterpriseId }: UserToEnterpriseType) {
    const user = await repo.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return Error("User not found");
    }


    const enterprise = await repo.enterprise.findUnique({
      where: {
        id: enterpriseId,
      },
    });
    if (!enterprise) {
      return Error("Enterprise not found");
    }


    const enterpriseUser = await repo.enterpriseUser.create({
      data: {
        userId,
        enterpriseId,
      },
    });
    if (!enterpriseUser) {
      return Error("Error linking user to enterprise");
    }

    return null;
  }
}