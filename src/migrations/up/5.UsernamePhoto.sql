START TRANSACTION;
  ALTER TABLE "users" ADD "username" CHARACTER VARYING;
  ALTER TABLE "users" ADD CONSTRAINT user_username UNIQUE (username);
  ALTER TABLE "users" ADD "photo" CHARACTER VARYING;
COMMIT;