-- CreateTable
CREATE TABLE "TruckLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "address" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WeeklySchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" TEXT NOT NULL,
    "location" TEXT,
    "time" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" TEXT,
    "category" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySchedule_day_key" ON "WeeklySchedule"("day");
