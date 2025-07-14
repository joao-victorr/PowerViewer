/*
  Warnings:

  - You are about to drop the `PowerBIReportConfigs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PowerBIReportConfigs" DROP CONSTRAINT "PowerBIReportConfigs_enterpriseId_fkey";

-- DropTable
DROP TABLE "PowerBIReportConfigs";

-- CreateTable
CREATE TABLE "PowerBIReportConfig" (
    "id" TEXT NOT NULL,
    "enterpriseId" TEXT NOT NULL,
    "powerBIGroupId" TEXT NOT NULL,
    "powerBIGroupName" TEXT,
    "powerBIReportId" TEXT NOT NULL,
    "powerBIReportName" TEXT,
    "pbEmbedToken" TEXT,
    "pbEmbedTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PowerBIReportConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PowerBIReportConfig_enterpriseId_powerBIGroupId_powerBIRepo_key" ON "PowerBIReportConfig"("enterpriseId", "powerBIGroupId", "powerBIReportId");

-- AddForeignKey
ALTER TABLE "PowerBIReportConfig" ADD CONSTRAINT "PowerBIReportConfig_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
