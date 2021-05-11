START TRANSACTION;
  ALTER TABLE "users" DROP COLUMN "phone";
  ALTER TABLE "users" DROP COLUMN "gender";
  ALTER TABLE "users" DROP COLUMN "stack";
  ALTER TABLE "users" DROP COLUMN "rate";
  ALTER TABLE "users" DROP COLUMN "rating";
COMMIT;