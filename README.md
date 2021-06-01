# Charters - via Lambda Functionality

## Postgres in Development Mode

For development and local testing, it may be advantageous to run a local Postgres database in a container.

```
docker run --name localdevdb -p 5432:5432 -e POSTGRES_PASSWORD={some_password} -d postgres
```

To access the database via psql:

```
psql -h localhost -p 5432 -U postgres -W
```
Provide the password at the prompt.

## Interim Schema - With Data

```
CREATE TABLE charters (
    id serial primary key,
    name varchar(64),
    descr varchar(255)
);

INSERT INTO charters (name, descr) values ('Sunset Cruise', 'A delightful evening cruise with a sunset into the Gulf of Mexico.');
INSERT INTO charters (name, descr) values ('Dolphin Cruise', 'A daytime review of locations often frequented by dolphins.');
```

## Sample Charters Query

```
select * from charters;
```