/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `EnterpriseUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EnterpriseUser" DROP COLUMN "isAdmin",
ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT false;
