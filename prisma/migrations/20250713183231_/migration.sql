-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "pbAccessToken" TEXT,
ADD COLUMN     "pbAccessTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "pbClientId" TEXT,
ADD COLUMN     "pbClientSecretEncrypted" TEXT,
ADD COLUMN     "pbMasterEmail" TEXT,
ADD COLUMN     "pbMasterPasswordEncrypted" TEXT,
ADD COLUMN     "pbTenantId" TEXT;

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
