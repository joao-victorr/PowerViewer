/*
  Warnings:

  - The primary key for the `GroupUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `GroupUser` table. All the data in the column will be lost.
  - The primary key for the `PermissionUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `PermissionUser` table. All the data in the column will be lost.
  - The primary key for the `RoleUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `RoleUser` table. All the data in the column will be lost.
  - You are about to drop the column `enterpriseId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Dashbord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `enterpriseId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterpriseUserEnterpriseId` to the `GroupUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterpriseUserUserId` to the `GroupUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterpriseUserEnterpriseId` to the `PermissionUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterpriseUserUserId` to the `PermissionUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterpriseUserEnterpriseId` to the `RoleUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterpriseUserUserId` to the `RoleUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Dashbord" DROP CONSTRAINT "Dashbord_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "GroupDashbord" DROP CONSTRAINT "GroupDashbord_dashbordId_fkey";

-- DropForeignKey
ALTER TABLE "GroupUser" DROP CONSTRAINT "GroupUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "PermissionUser" DROP CONSTRAINT "PermissionUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoleUser" DROP CONSTRAINT "RoleUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_enterpriseId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "enterpriseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GroupUser" DROP CONSTRAINT "GroupUser_pkey",
DROP COLUMN "userId",
ADD COLUMN     "enterpriseUserEnterpriseId" TEXT NOT NULL,
ADD COLUMN     "enterpriseUserUserId" TEXT NOT NULL,
ADD CONSTRAINT "GroupUser_pkey" PRIMARY KEY ("groupId", "enterpriseUserUserId", "enterpriseUserEnterpriseId");

-- AlterTable
ALTER TABLE "PermissionUser" DROP CONSTRAINT "PermissionUser_pkey",
DROP COLUMN "userId",
ADD COLUMN     "enterpriseUserEnterpriseId" TEXT NOT NULL,
ADD COLUMN     "enterpriseUserUserId" TEXT NOT NULL,
ADD CONSTRAINT "PermissionUser_pkey" PRIMARY KEY ("permissionId", "enterpriseUserUserId", "enterpriseUserEnterpriseId");

-- AlterTable
ALTER TABLE "RoleUser" DROP CONSTRAINT "RoleUser_pkey",
DROP COLUMN "userId",
ADD COLUMN     "enterpriseUserEnterpriseId" TEXT NOT NULL,
ADD COLUMN     "enterpriseUserUserId" TEXT NOT NULL,
ADD CONSTRAINT "RoleUser_pkey" PRIMARY KEY ("roleId", "enterpriseUserUserId", "enterpriseUserEnterpriseId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "enterpriseId";

-- DropTable
DROP TABLE "Dashbord";

-- CreateTable
CREATE TABLE "EnterpriseUser" (
    "userId" TEXT NOT NULL,
    "enterpriseId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnterpriseUser_pkey" PRIMARY KEY ("userId","enterpriseId")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "DashboardStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enterpriseId" TEXT NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_externalId_key" ON "Dashboard"("externalId");

-- AddForeignKey
ALTER TABLE "EnterpriseUser" ADD CONSTRAINT "EnterpriseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterpriseUser" ADD CONSTRAINT "EnterpriseUser_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_enterpriseUserUserId_enterpriseUserEnterpriseId_fkey" FOREIGN KEY ("enterpriseUserUserId", "enterpriseUserEnterpriseId") REFERENCES "EnterpriseUser"("userId", "enterpriseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupDashbord" ADD CONSTRAINT "GroupDashbord_dashbordId_fkey" FOREIGN KEY ("dashbordId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleUser" ADD CONSTRAINT "RoleUser_enterpriseUserUserId_enterpriseUserEnterpriseId_fkey" FOREIGN KEY ("enterpriseUserUserId", "enterpriseUserEnterpriseId") REFERENCES "EnterpriseUser"("userId", "enterpriseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionUser" ADD CONSTRAINT "PermissionUser_enterpriseUserUserId_enterpriseUserEnterpri_fkey" FOREIGN KEY ("enterpriseUserUserId", "enterpriseUserEnterpriseId") REFERENCES "EnterpriseUser"("userId", "enterpriseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_enterpriseId_fkey" FOREIGN KEY ("userId", "enterpriseId") REFERENCES "EnterpriseUser"("userId", "enterpriseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_enterpriseId_fkey" FOREIGN KEY ("userId", "enterpriseId") REFERENCES "EnterpriseUser"("userId", "enterpriseId") ON DELETE RESTRICT ON UPDATE CASCADE;
