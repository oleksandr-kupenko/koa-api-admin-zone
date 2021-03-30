START TRANSACTION;

    CREATE TABLE "users" (
        id serial PRIMARY KEY,
        fname varchar(255) NOT NULL,
        lname varchar(255) NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        country varchar(255) DEFAULT 'Ukraine',
        "isRequested" boolean NOT NULL

    );

COMMIT;