import { repo } from "@Infrastructure/Databases/PrismaClient";


type UserToEnterpriseType = {
  userId: string;
  enterpriseId: string;
}

export class UnlinkUserToEnterpriseService {
  async execute({ userId, enterpriseId }: UserToEnterpriseType): Promise<null | Error> {

    console.error("Unlinking user to enterprise", { userId, enterpriseId });
    const user = await repo.enterpriseUser.findUnique({
      where: {
        userId_enterpriseId: {
          userId,
          enterpriseId,
        }
      },
    });

    if (!user) {
      return Error("User not linked to this enterprise");
    }

    await repo.enterpriseUser.delete({
      where: {
        userId_enterpriseId: {
          userId,
          enterpriseId,
        }
      }
    });

    return null;
  }
}