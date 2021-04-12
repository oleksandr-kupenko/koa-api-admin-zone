START TRANSACTION;
    ALTER TABLE "users" DROP CONSTRAINT fk_category;
    ALTER TABLE "users" DROP "categoryId";
    DROP TABLE categories;
COMMIT;