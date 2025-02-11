/*
  Warnings:

  - A unique constraint covering the columns `[customerEmail]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customers_customerEmail_key" ON "Customers"("customerEmail");
