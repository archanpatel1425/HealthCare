/*
  Warnings:

  - You are about to drop the column `phone` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_no]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_no]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone_no` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_no` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "phone",
ADD COLUMN     "phone_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "phone",
ADD COLUMN     "phone_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_phone_no_key" ON "Doctor"("phone_no");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_no_key" ON "Patient"("phone_no");
