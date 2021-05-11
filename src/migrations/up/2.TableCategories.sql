START TRANSACTION;
        CREATE TABLE categories
    (
        id serial PRIMARY KEY,
        name varchar(255) DEFAULT 'Junior'
    );

    INSERT INTO categories (name) VALUES  ('Junior')
    INSERT INTO categories (name) VALUES  ('Middle')
    INSERT INTO categories (name) VALUES  ('Senior')
    INSERT INTO categories (name) VALUES  ('Company manager')
    INSERT INTO categories (name) VALUES  ('JS creator')

    ALTER TABLE "users" ADD COLUMN  "categoryId" int DEFAULT 1;
    ALTER TABLE "users" ADD CONSTRAINT fk_category FOREIGN KEY ("categoryId") REFERENCES categories (id);
COMMIT;