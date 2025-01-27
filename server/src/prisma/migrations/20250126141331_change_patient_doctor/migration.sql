/*
  Warnings:

  - You are about to drop the column `address` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "address",
DROP COLUMN "dob";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "address",
DROP COLUMN "dob";
