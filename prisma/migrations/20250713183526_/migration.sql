/*
  Warnings:

  - You are about to drop the `PowerBIReportConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PowerBIReportConfig" DROP CONSTRAINT "PowerBIReportConfig_enterpriseId_fkey";

-- DropTable
DROP TABLE "PowerBIReportConfig";

-- CreateTable
CREATE TABLE "PowerBIReportConfigs" (
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

    CONSTRAINT "PowerBIReportConfigs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PowerBIReportConfigs_enterpriseId_powerBIGroupId_powerBIRep_key" ON "PowerBIReportConfigs"("enterpriseId", "powerBIGroupId", "powerBIReportId");

-- AddForeignKey
ALTER TABLE "PowerBIReportConfigs" ADD CONSTRAINT "PowerBIReportConfigs_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
