/*
  Warnings:

  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chatId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `chatRoomID` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Chat` table. All the data in the column will be lost.
  - The `status` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The required column `id` was added to the `Chat` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `receiverType` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderType` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PATIENT', 'DOCTOR');

-- AlterTable
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_pkey",
DROP COLUMN "chatId",
DROP COLUMN "chatRoomID",
DROP COLUMN "timestamp",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "receiverType" "UserType" NOT NULL,
ADD COLUMN     "senderType" "UserType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ChatStatus" NOT NULL DEFAULT 'SENT',
ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("id");
