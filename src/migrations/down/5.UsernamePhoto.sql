START TRANSACTION;
  ALTER TABLE "users" DROP CONSTRAINT user_username;
  ALTER TABLE "users" DROP COLUMN "username";
  ALTER TABLE "users" DROP COLUMN "photo";
COMMIT;