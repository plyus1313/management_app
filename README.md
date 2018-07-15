# Back-end

- Clone this repo
- Run npm install
- Run npm start

Database setup has to be structured.

Use following SQL Statements :

- CREATE USER “postgres”;
- CREATE PASSWORD “pass123”;
- CREATE DATABASE “management” ;
- CREATE TABLE “person”;
- CREATE colums name, money, currency and expense.

To run unit tests, you should do the following:

- Mocha framework and chai library for node were used;
- In back-end in cmd wite a command: mocha tests/tsuite.js;
- To get data in file with name, for example logs.dat, write next command: mocha tests/tsuite.js > logs.dat


** Make sure you use postgreSQL  for this code base.
