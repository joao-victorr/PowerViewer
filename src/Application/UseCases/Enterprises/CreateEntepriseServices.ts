import { repo } from "@Databases/PrismaClient";




export class CreateEnterpriseServices {
  async excute({name}: { name: string }): Promise<string | Error> {

    console.log("Creating enterprise with name:", name);
    
    const verifyEnterpriseExists = await repo.enterprise.findFirst({
      where: {
        name: name,
      },
    })
    if (verifyEnterpriseExists) {
      return Error("Enterprise already exists");
    }

    const enterprise = await repo.enterprise.create({
      data: {
        name,
      },
    });

    return enterprise.id;

  }
}