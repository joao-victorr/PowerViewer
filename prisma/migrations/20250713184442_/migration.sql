/*
  Warnings:

  - You are about to drop the `Dashboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupDashbord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dashboard" DROP CONSTRAINT "Dashboard_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "GroupDashbord" DROP CONSTRAINT "GroupDashbord_dashbordId_fkey";

-- DropForeignKey
ALTER TABLE "GroupDashbord" DROP CONSTRAINT "GroupDashbord_groupId_fkey";

-- DropTable
DROP TABLE "Dashboard";

-- DropTable
DROP TABLE "GroupDashbord";
