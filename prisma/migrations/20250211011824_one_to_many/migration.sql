/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `Customers` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customers" DROP CONSTRAINT "Customers_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Customers" DROP COLUMN "invoiceId";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "customerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
