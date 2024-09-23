-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "contributionC_id" TEXT;

-- CreateTable
CREATE TABLE "Contribution" (
    "c_id" TEXT NOT NULL,
    "contributor" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("c_id")
);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_contributionC_id_fkey" FOREIGN KEY ("contributionC_id") REFERENCES "Contribution"("c_id") ON DELETE SET NULL ON UPDATE CASCADE;
