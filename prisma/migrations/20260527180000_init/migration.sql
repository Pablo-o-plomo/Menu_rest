-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'manager', 'viewer');
CREATE TYPE "PlannedChangeStatus" AS ENUM ('draft', 'approved', 'active', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'viewer',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Restaurant" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MenuItem" (
  "id" TEXT NOT NULL,
  "restaurantId" TEXT NOT NULL,
  "externalCode" TEXT,
  "article" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "groupName" TEXT,
  "priceListName" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PriceSnapshot" (
  "id" TEXT NOT NULL,
  "restaurantId" TEXT NOT NULL,
  "snapshotDate" TIMESTAMP(3) NOT NULL,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fileName" TEXT NOT NULL,
  "comment" TEXT,
  "uploadedByUserId" TEXT NOT NULL,
  CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SnapshotItem" (
  "id" TEXT NOT NULL,
  "snapshotId" TEXT NOT NULL,
  "menuItemId" TEXT NOT NULL,
  "article" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "groupName" TEXT,
  "priceListName" TEXT,
  "salePrice" DECIMAL(12,2) NOT NULL,
  "costPrice" DECIMAL(12,2) NOT NULL,
  "markupPercent" DECIMAL(7,2) NOT NULL,
  "marginPercent" DECIMAL(7,2) NOT NULL,
  "foodCostPercent" DECIMAL(7,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SnapshotItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SalesReport" (
  "id" TEXT NOT NULL,
  "restaurantId" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fileName" TEXT NOT NULL,
  "uploadedByUserId" TEXT NOT NULL,
  CONSTRAINT "SalesReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SalesReportItem" (
  "id" TEXT NOT NULL,
  "salesReportId" TEXT NOT NULL,
  "menuItemId" TEXT NOT NULL,
  "article" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "groupName" TEXT,
  "quantitySold" DECIMAL(12,3) NOT NULL,
  "totalRevenue" DECIMAL(12,2) NOT NULL,
  "averageSalePrice" DECIMAL(12,2) NOT NULL,
  "costPrice" DECIMAL(12,2) NOT NULL,
  "totalCost" DECIMAL(12,2) NOT NULL,
  "grossProfit" DECIMAL(12,2) NOT NULL,
  "actualFoodCostPercent" DECIMAL(7,2) NOT NULL,
  "actualMarginPercent" DECIMAL(7,2) NOT NULL,
  "actualMarkupPercent" DECIMAL(7,2) NOT NULL,
  CONSTRAINT "SalesReportItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlannedPriceChange" (
  "id" TEXT NOT NULL,
  "restaurantId" TEXT NOT NULL,
  "menuItemId" TEXT NOT NULL,
  "currentPrice" DECIMAL(12,2) NOT NULL,
  "plannedPrice" DECIMAL(12,2) NOT NULL,
  "currentCostPrice" DECIMAL(12,2) NOT NULL,
  "currentFoodCostPercent" DECIMAL(7,2) NOT NULL,
  "projectedFoodCostPercent" DECIMAL(7,2) NOT NULL,
  "currentMarginPercent" DECIMAL(7,2) NOT NULL,
  "projectedMarginPercent" DECIMAL(7,2) NOT NULL,
  "plannedStartDate" TIMESTAMP(3) NOT NULL,
  "reason" TEXT NOT NULL,
  "status" "PlannedChangeStatus" NOT NULL DEFAULT 'draft',
  "createdByUserId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlannedPriceChange_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "MenuItem_restaurantId_article_key" ON "MenuItem"("restaurantId","article");
CREATE INDEX "PriceSnapshot_restaurantId_snapshotDate_idx" ON "PriceSnapshot"("restaurantId","snapshotDate");
CREATE INDEX "SnapshotItem_menuItemId_idx" ON "SnapshotItem"("menuItemId");

ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SnapshotItem" ADD CONSTRAINT "SnapshotItem_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "PriceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SnapshotItem" ADD CONSTRAINT "SnapshotItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesReport" ADD CONSTRAINT "SalesReport_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SalesReport" ADD CONSTRAINT "SalesReport_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesReportItem" ADD CONSTRAINT "SalesReportItem_salesReportId_fkey" FOREIGN KEY ("salesReportId") REFERENCES "SalesReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SalesReportItem" ADD CONSTRAINT "SalesReportItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PlannedPriceChange" ADD CONSTRAINT "PlannedPriceChange_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlannedPriceChange" ADD CONSTRAINT "PlannedPriceChange_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PlannedPriceChange" ADD CONSTRAINT "PlannedPriceChange_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
