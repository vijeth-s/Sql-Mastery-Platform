const curriculum = {
  beginner: [
    {
      section: "Introduction to Databases",
      topics: [
        "What is a Database",
        "Types of Databases",
        "Relational Databases",
        "DBMS vs RDBMS",
        "Tables, Rows, and Columns",
        "Primary Key",
        "Foreign Key",
        "NULL Values"
      ]
    },
    {
      section: "Introduction to SQL",
      topics: ["What is SQL", "SQL Syntax Rules", "SQL Data Types", "SQL Statements Overview"]
    },
    {
      section: "Retrieving Data",
      topics: ["SELECT Statement", "DISTINCT", "LIMIT / TOP", "ORDER BY", "Aliases"]
    },
    {
      section: "Filtering Data",
      topics: [
        "WHERE Clause",
        "AND, OR, NOT Operators",
        "Comparison Operators",
        "BETWEEN",
        "IN Operator",
        "LIKE Operator",
        "Wildcards",
        "IS NULL / IS NOT NULL"
      ]
    },
    {
      section: "Basic Functions",
      topics: ["COUNT()", "SUM()", "AVG()", "MIN()", "MAX()"]
    },
    {
      section: "Modifying Data",
      topics: ["INSERT INTO", "UPDATE", "DELETE", "TRUNCATE"]
    },
    {
      section: "Table Management",
      topics: ["CREATE TABLE", "ALTER TABLE", "DROP TABLE", "Constraints Basics", "PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "NOT NULL", "DEFAULT"]
    }
  ],
  intermediate: [
    {
      section: "Aggregate Operations",
      topics: ["GROUP BY", "HAVING Clause", "Aggregate Functions with GROUP BY"]
    },
    {
      section: "Joins",
      topics: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "SELF JOIN", "CROSS JOIN"]
    },
    {
      section: "Advanced Filtering",
      topics: ["Subqueries", "Nested Queries", "EXISTS", "ANY and ALL"]
    },
    {
      section: "Combining Data",
      topics: ["UNION", "UNION ALL", "INTERSECT", "EXCEPT / MINUS"]
    },
    {
      section: "Conditional Logic",
      topics: ["CASE Statement", "IFNULL / COALESCE", "NULLIF"]
    },
    {
      section: "Advanced Table Operations",
      topics: ["Views", "Temporary Tables", "Common Table Expressions (CTEs)"]
    },
    {
      section: "String Functions",
      topics: ["CONCAT", "SUBSTRING", "LENGTH", "UPPER / LOWER", "REPLACE", "TRIM"]
    },
    {
      section: "Date and Time Functions",
      topics: ["CURRENT_DATE", "NOW()", "DATE_FORMAT", "DATEDIFF", "DATE_ADD"]
    },
    {
      section: "Data Relationships",
      topics: ["One-to-One", "One-to-Many", "Many-to-Many"]
    },
    {
      section: "Indexing Basics",
      topics: ["What are Indexes", "Creating Indexes", "Unique Indexes", "Composite Indexes"]
    }
  ],
  advanced: [
    {
      section: "Advanced Querying",
      topics: ["Window Functions", "RANK()", "DENSE_RANK()", "ROW_NUMBER()", "LEAD() and LAG()", "PARTITION BY"]
    },
    {
      section: "Query Optimization",
      topics: ["Query Execution Plans", "Performance Tuning", "Optimizing JOINs", "Index Optimization", "Avoiding Slow Queries"]
    },
    {
      section: "Database Design",
      topics: ["Database Normalization", "1NF", "2NF", "3NF", "BCNF", "Denormalization", "Schema Design"]
    },
    {
      section: "Transactions & ACID",
      topics: ["Transactions", "COMMIT", "ROLLBACK", "SAVEPOINT", "ACID Properties"]
    },
    {
      section: "Stored Programs",
      topics: ["Stored Procedures", "Functions", "Triggers", "Events"]
    },
    {
      section: "Advanced Database Concepts",
      topics: ["Partitioning", "Replication", "Sharding", "Data Warehousing", "OLTP vs OLAP"]
    },
    {
      section: "Security",
      topics: ["User Management", "Roles & Permissions", "SQL Injection Prevention", "Encryption Basics"]
    },
    {
      section: "Advanced SQL Techniques",
      topics: ["Recursive CTEs", "Dynamic SQL", "Pivoting Data", "Unpivoting Data", "Materialized Views"]
    },
    {
      section: "Real-World SQL",
      topics: ["E-commerce Database Queries", "Analytics Queries", "Reporting Queries", "Dashboard Queries", "Audit Logs", "Soft Deletes"]
    },
    {
      section: "SQL for Developers",
      topics: ["SQL with APIs", "SQL in Backend Development", "ORM Basics", "Migrations", "Database Versioning"]
    },
    {
      section: "SQL Interview Preparation",
      topics: ["Common SQL Interview Questions", "Query Challenges", "Optimization Problems", "Real-world Scenarios"]
    }
  ]
};

const lessonDetails = {
  "What is a Database": {
    explanation: "A database is an organized collection of data that can be stored, searched, updated, and managed reliably.",
    syntax: "database -> tables -> rows -> columns",
    example: "SELECT name, city FROM students;",
    output: "A list of student names and cities from the sample database.",
    tips: "Databases are designed for reliable storage, fast retrieval, and consistent updates."
  },
  "Types of Databases": {
    explanation: "Common database types include relational, document, key-value, graph, time-series, and columnar databases. SQL is mainly used with relational databases.",
    syntax: "Relational: tables\nDocument: JSON-like documents\nGraph: nodes and edges",
    example: "SELECT * FROM products LIMIT 5;",
    output: "A relational table result with product rows.",
    tips: "Choose the database type based on how the application stores and queries data."
  },
  "Relational Databases": {
    explanation: "A relational database stores data in tables and connects those tables with keys.",
    syntax: "customers.id -> orders.customer_id",
    example: "SELECT customers.name, orders.status FROM customers JOIN orders ON customers.id = orders.customer_id;",
    output: "Customers matched with their orders.",
    tips: "Relationships reduce duplicated data and make joins possible."
  },
  "DBMS vs RDBMS": {
    explanation: "A DBMS manages databases in general. An RDBMS is a database management system based on relational tables, keys, and SQL.",
    syntax: "DBMS: database manager\nRDBMS: relational database manager",
    example: "SELECT name FROM sqlite_master WHERE type = 'table';",
    output: "The list of tables in the SQLite database.",
    tips: "SQLite, PostgreSQL, MySQL, SQL Server, and Oracle are relational database systems."
  },
  "Tables, Rows, and Columns": {
    explanation: "A table stores one kind of entity. Rows are individual records. Columns are fields that describe each record.",
    syntax: "table_name(column_one, column_two, column_three)",
    example: "SELECT id, name, gpa FROM students;",
    output: "Student rows with id, name, and GPA columns.",
    tips: "Good tables usually represent one clear concept, such as students, orders, or products."
  },
  "Primary Key": {
    explanation: "A primary key uniquely identifies each row in a table.",
    syntax: "id INTEGER PRIMARY KEY",
    example: "SELECT id, name FROM students ORDER BY id;",
    output: "Each student appears with a unique id.",
    tips: "Primary keys should be stable and unique."
  },
  "Foreign Key": {
    explanation: "A foreign key stores a value that points to a primary key in another table.",
    syntax: "FOREIGN KEY (customer_id) REFERENCES customers(id)",
    example: "SELECT orders.id, customers.name FROM orders JOIN customers ON customers.id = orders.customer_id;",
    output: "Orders connected to customer names.",
    tips: "Foreign keys are the foundation of relational joins."
  },
  "NULL Values": {
    explanation: "NULL means a value is missing, unknown, or not applicable.",
    syntax: "WHERE column_name IS NULL\nWHERE column_name IS NOT NULL",
    example: "SELECT name, email FROM customers WHERE email IS NOT NULL;",
    output: "Customers that have an email value.",
    tips: "Use IS NULL, not = NULL."
  },
  "What is SQL": {
    explanation: "SQL stands for Structured Query Language. It is used to query, create, update, and manage relational databases.",
    syntax: "SELECT column_name FROM table_name;",
    example: "SELECT name, city FROM students;",
    output: "Student names and cities.",
    tips: "SQL reads like a structured sentence: choose columns, choose a table, then add conditions."
  },
  "SQL Syntax Rules": {
    explanation: "SQL statements use keywords, clauses, expressions, identifiers, and optional semicolons. Keywords are often uppercase for readability.",
    syntax: "SELECT columns\nFROM table_name\nWHERE condition\nORDER BY column_name;",
    example: "SELECT name, gpa FROM students WHERE gpa >= 3.5 ORDER BY gpa DESC;",
    output: "Students with GPA 3.5 or higher, sorted by GPA.",
    tips: "Format longer queries across multiple lines so each clause is easy to scan."
  },
  "SQL Data Types": {
    explanation: "Data types define what kind of values a column stores. SQLite commonly uses INTEGER, REAL, TEXT, BLOB, and NULL.",
    syntax: "CREATE TABLE example (id INTEGER, name TEXT, price REAL);",
    example: "CREATE TABLE course_levels (id INTEGER PRIMARY KEY, title TEXT, difficulty REAL);",
    output: "A table with integer, text, and numeric columns is created.",
    tips: "Other SQL databases have more strict types such as VARCHAR, DATE, BOOLEAN, and DECIMAL."
  },
  "SQL Statements Overview": {
    explanation: "SQL statements include reading data, changing data, defining tables, and controlling transactions.",
    syntax: "SELECT ...\nINSERT ...\nUPDATE ...\nDELETE ...\nCREATE TABLE ...",
    example: "SELECT COUNT(*) AS total_students FROM students;",
    output: "One row with the total number of students.",
    tips: "Think of SQL commands as categories: query, modify, define, and control."
  },
  "SELECT Statement": {
    explanation: "SELECT retrieves data from one or more tables.",
    syntax: "SELECT column1, column2 FROM table_name;",
    example: "SELECT name, gpa FROM students;",
    output: "Student names beside GPA values.",
    tips: "Use named columns for clean results and SELECT * only for quick exploration."
  },
  DISTINCT: {
    explanation: "DISTINCT removes duplicate rows from the selected result.",
    syntax: "SELECT DISTINCT column_name FROM table_name;",
    example: "SELECT DISTINCT region FROM customers;",
    output: "One row per customer region.",
    tips: "DISTINCT applies to the whole selected row, not only the first column."
  },
  "LIMIT / TOP": {
    explanation: "LIMIT restricts row count in SQLite, PostgreSQL, and MySQL. SQL Server uses TOP for a similar purpose.",
    syntax: "SELECT * FROM table_name LIMIT 10;\nSELECT TOP 10 * FROM table_name;",
    example: "SELECT * FROM orders ORDER BY order_date DESC LIMIT 3;",
    output: "The three newest orders.",
    tips: "This playground uses SQLite, so use LIMIT here."
  },
  "ORDER BY": {
    explanation: "ORDER BY sorts query results by one or more columns.",
    syntax: "SELECT * FROM table_name ORDER BY column_name ASC;",
    example: "SELECT name, price FROM products ORDER BY price DESC;",
    output: "Products sorted from highest price to lowest price.",
    tips: "ASC sorts low to high. DESC sorts high to low."
  },
  Aliases: {
    explanation: "Aliases rename columns or tables inside a query.",
    syntax: "SELECT column_name AS alias_name FROM table_name;",
    example: "SELECT name AS student_name, gpa AS score FROM students;",
    output: "Columns labeled student_name and score.",
    tips: "Aliases make calculated columns and joins much easier to read."
  },
  "WHERE Clause": {
    explanation: "WHERE filters rows before they appear in the result.",
    syntax: "SELECT * FROM table_name WHERE condition;",
    example: "SELECT * FROM employees WHERE salary >= 100000;",
    output: "Employees earning at least 100000.",
    tips: "WHERE is used before GROUP BY and ORDER BY."
  },
  "AND, OR, NOT Operators": {
    explanation: "AND, OR, and NOT combine or reverse filtering conditions.",
    syntax: "WHERE condition_one AND condition_two\nWHERE condition_one OR condition_two\nWHERE NOT condition",
    example: "SELECT name, grade, gpa FROM students WHERE grade = 'A' AND gpa >= 3.8;",
    output: "A-grade students with GPA at least 3.8.",
    tips: "Use parentheses when mixing AND and OR."
  },
  "Comparison Operators": {
    explanation: "Comparison operators compare column values to constants or expressions.",
    syntax: "=, !=, <, <=, >, >=",
    example: "SELECT name, stock FROM products WHERE stock < 50;",
    output: "Products with fewer than 50 units in stock.",
    tips: "Text values need quotes, such as status = 'paid'."
  },
  BETWEEN: {
    explanation: "BETWEEN filters values inside an inclusive range.",
    syntax: "WHERE column_name BETWEEN low_value AND high_value",
    example: "SELECT name, price FROM products WHERE price BETWEEN 50 AND 200;",
    output: "Products priced from 50 through 200.",
    tips: "BETWEEN includes both boundary values."
  },
  "IN Operator": {
    explanation: "IN checks whether a value matches any value in a list or subquery.",
    syntax: "WHERE column_name IN (value1, value2, value3)",
    example: "SELECT name, region FROM customers WHERE region IN ('Europe', 'Asia Pacific');",
    output: "Customers from Europe or Asia Pacific.",
    tips: "IN is cleaner than many OR checks on the same column."
  },
  "LIKE Operator": {
    explanation: "LIKE matches text patterns.",
    syntax: "WHERE column_name LIKE 'A%'",
    example: "SELECT name FROM students WHERE name LIKE 'A%';",
    output: "Students whose names start with A.",
    tips: "LIKE is commonly used with wildcard characters."
  },
  Wildcards: {
    explanation: "Wildcards are pattern characters used with LIKE. In SQLite, % means any number of characters and _ means one character.",
    syntax: "LIKE '%text%'\nLIKE '_a%'",
    example: "SELECT name FROM products WHERE name LIKE '%Cloud%';",
    output: "Products with Cloud in the name.",
    tips: "A leading wildcard like '%text' can be slower on large indexed tables."
  },
  "IS NULL / IS NOT NULL": {
    explanation: "IS NULL and IS NOT NULL test whether a value is missing.",
    syntax: "WHERE column_name IS NULL\nWHERE column_name IS NOT NULL",
    example: "SELECT name, email FROM customers WHERE email IS NOT NULL;",
    output: "Customers with email addresses.",
    tips: "NULL is unknown, so normal equality comparisons do not work with it."
  },
  "COUNT()": {
    explanation: "COUNT returns how many rows or non-NULL values match a query.",
    syntax: "SELECT COUNT(*) FROM table_name;",
    example: "SELECT COUNT(*) AS total_customers FROM customers;",
    output: "One row containing the number of customers.",
    tips: "COUNT(*) counts rows. COUNT(column) counts non-NULL values."
  },
  "SUM()": {
    explanation: "SUM adds numeric values across rows.",
    syntax: "SELECT SUM(column_name) FROM table_name;",
    example: "SELECT SUM(quantity) AS total_units FROM orders;",
    output: "The total quantity ordered.",
    tips: "SUM ignores NULL values."
  },
  "AVG()": {
    explanation: "AVG calculates the average of numeric values.",
    syntax: "SELECT AVG(column_name) FROM table_name;",
    example: "SELECT ROUND(AVG(salary), 2) AS avg_salary FROM employees;",
    output: "The average employee salary.",
    tips: "ROUND is useful for formatting averages."
  },
  "MIN()": {
    explanation: "MIN returns the smallest value in a column.",
    syntax: "SELECT MIN(column_name) FROM table_name;",
    example: "SELECT MIN(price) AS cheapest_price FROM products;",
    output: "The lowest product price.",
    tips: "MIN works with numbers, text, and dates."
  },
  "MAX()": {
    explanation: "MAX returns the largest value in a column.",
    syntax: "SELECT MAX(column_name) FROM table_name;",
    example: "SELECT MAX(gpa) AS highest_gpa FROM students;",
    output: "The highest GPA in the students table.",
    tips: "MAX is often used for latest dates or top scores."
  },
  "INSERT INTO": {
    explanation: "INSERT INTO adds new rows to a table.",
    syntax: "INSERT INTO table_name (column1, column2) VALUES (value1, value2);",
    example: "INSERT INTO students (id, name, age, grade, city, gpa) VALUES (6, 'Sam Rivera', 20, 'B', 'Miami', 3.3);",
    output: "A new student row is added.",
    tips: "Always list columns explicitly so inserts stay readable."
  },
  UPDATE: {
    explanation: "UPDATE changes existing rows.",
    syntax: "UPDATE table_name SET column_name = new_value WHERE condition;",
    example: "UPDATE products SET stock = stock - 1 WHERE id = 1;",
    output: "The stock for product id 1 decreases by one.",
    tips: "Preview rows with SELECT before running UPDATE."
  },
  DELETE: {
    explanation: "DELETE removes rows from a table.",
    syntax: "DELETE FROM table_name WHERE condition;",
    example: "DELETE FROM orders WHERE status = 'cancelled';",
    output: "Cancelled orders are removed if any exist.",
    tips: "Without WHERE, DELETE removes every row in the table."
  },
  TRUNCATE: {
    explanation: "TRUNCATE quickly removes all rows from a table in many databases. SQLite does not support TRUNCATE directly.",
    syntax: "TRUNCATE TABLE table_name;\n-- SQLite alternative:\nDELETE FROM table_name;",
    example: "DELETE FROM orders;",
    output: "All rows are removed from orders in SQLite.",
    tips: "In this playground, refresh or click Reset Database to restore the sample data."
  },
  "CREATE TABLE": {
    explanation: "CREATE TABLE defines a new table and its columns.",
    syntax: "CREATE TABLE table_name (id INTEGER PRIMARY KEY, name TEXT NOT NULL);",
    example: "CREATE TABLE mentors (id INTEGER PRIMARY KEY, name TEXT NOT NULL, specialty TEXT);",
    output: "A mentors table is created.",
    tips: "Design table columns around the entity the table represents."
  },
  "ALTER TABLE": {
    explanation: "ALTER TABLE changes an existing table structure.",
    syntax: "ALTER TABLE table_name ADD COLUMN column_name TEXT;",
    example: "ALTER TABLE students ADD COLUMN mentor TEXT;",
    output: "A mentor column is added to students.",
    tips: "SQLite supports a smaller ALTER TABLE feature set than some other databases."
  },
  "DROP TABLE": {
    explanation: "DROP TABLE removes a table and its stored data.",
    syntax: "DROP TABLE table_name;",
    example: "DROP TABLE mentors;",
    output: "The mentors table is removed.",
    tips: "DROP TABLE is destructive, but this app resets the database on refresh."
  },
  "Constraints Basics": {
    explanation: "Constraints are rules that protect data quality and relationships.",
    syntax: "PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, DEFAULT, CHECK",
    example: "CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL);",
    output: "A table with uniqueness and required-name rules.",
    tips: "Use constraints to make invalid data hard to insert."
  },
  UNIQUE: {
    explanation: "UNIQUE prevents duplicate values in a column or combination of columns.",
    syntax: "email TEXT UNIQUE",
    example: "CREATE TABLE subscribers (id INTEGER PRIMARY KEY, email TEXT UNIQUE);",
    output: "A subscribers table that rejects duplicate emails.",
    tips: "A primary key is unique, but UNIQUE can be used on other columns too."
  },
  "NOT NULL": {
    explanation: "NOT NULL requires a column to have a value.",
    syntax: "column_name TEXT NOT NULL",
    example: "CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT NOT NULL);",
    output: "A courses table where title is required.",
    tips: "Use NOT NULL for fields your application always needs."
  },
  DEFAULT: {
    explanation: "DEFAULT supplies a value when an INSERT does not provide one.",
    syntax: "status TEXT DEFAULT 'active'",
    example: "CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT, status TEXT DEFAULT 'open');",
    output: "New tasks default to status open.",
    tips: "Defaults reduce repetitive insert code."
  },
  "GROUP BY": {
    explanation: "GROUP BY creates one output row per group, often with aggregate calculations.",
    syntax: "SELECT group_column, COUNT(*) FROM table_name GROUP BY group_column;",
    example: "SELECT category, COUNT(*) AS products FROM products GROUP BY category;",
    output: "Product counts by category.",
    tips: "Non-aggregated selected columns usually belong in GROUP BY."
  },
  "HAVING Clause": {
    explanation: "HAVING filters grouped results after aggregate functions are calculated.",
    syntax: "GROUP BY column_name HAVING COUNT(*) > 1",
    example: "SELECT status, COUNT(*) AS total FROM orders GROUP BY status HAVING COUNT(*) > 1;",
    output: "Order statuses that appear more than once.",
    tips: "WHERE filters rows before grouping; HAVING filters groups after grouping."
  },
  "Aggregate Functions with GROUP BY": {
    explanation: "Aggregates become much more useful when calculated per group.",
    syntax: "SELECT group_column, SUM(value) FROM table_name GROUP BY group_column;",
    example: "SELECT status, SUM(quantity) AS units FROM orders GROUP BY status;",
    output: "Total ordered units per order status.",
    tips: "This pattern powers many dashboards."
  },
  "INNER JOIN": {
    explanation: "INNER JOIN returns only rows with matches in both joined tables.",
    syntax: "SELECT * FROM a INNER JOIN b ON a.id = b.a_id;",
    example: "SELECT employees.name, departments.name AS department FROM employees INNER JOIN departments ON departments.id = employees.department_id;",
    output: "Employees matched to their department names.",
    tips: "Use keys for joins, not display text."
  },
  "LEFT JOIN": {
    explanation: "LEFT JOIN keeps every row from the left table and adds matching rows from the right table when present.",
    syntax: "SELECT * FROM a LEFT JOIN b ON a.id = b.a_id;",
    example: "SELECT departments.name, employees.name AS employee FROM departments LEFT JOIN employees ON departments.id = employees.department_id;",
    output: "All departments, including departments with no matching employee.",
    tips: "LEFT JOIN is useful for finding missing related records."
  },
  "RIGHT JOIN": {
    explanation: "RIGHT JOIN keeps every row from the right table. SQLite has limited support depending on version, so many developers reverse the table order and use LEFT JOIN.",
    syntax: "SELECT * FROM a RIGHT JOIN b ON a.id = b.a_id;",
    example: "SELECT departments.name, employees.name FROM employees RIGHT JOIN departments ON departments.id = employees.department_id;",
    output: "All departments, with matching employees when present.",
    tips: "If RIGHT JOIN is unavailable, swap the table order and use LEFT JOIN."
  },
  "FULL JOIN": {
    explanation: "FULL JOIN returns all rows from both tables, matching when possible. Some SQLite versions do not support FULL JOIN directly.",
    syntax: "SELECT * FROM a FULL OUTER JOIN b ON a.id = b.a_id;",
    example: "SELECT departments.name, employees.name FROM departments FULL OUTER JOIN employees ON departments.id = employees.department_id;",
    output: "All departments and all employees, matched where possible.",
    tips: "In SQLite, FULL JOIN can often be simulated with LEFT JOIN plus UNION."
  },
  "SELF JOIN": {
    explanation: "A self join joins a table to itself using aliases.",
    syntax: "SELECT a.column, b.column FROM table_name a JOIN table_name b ON a.key = b.key;",
    example: "SELECT a.name AS student_a, b.name AS student_b, a.city FROM students a JOIN students b ON a.city = b.city AND a.id < b.id;",
    output: "Pairs of students from the same city.",
    tips: "Aliases are required so each table copy has a name."
  },
  "CROSS JOIN": {
    explanation: "CROSS JOIN combines every row from one table with every row from another table.",
    syntax: "SELECT * FROM a CROSS JOIN b;",
    example: "SELECT students.name, products.name AS product FROM students CROSS JOIN products LIMIT 10;",
    output: "Student and product combinations.",
    tips: "CROSS JOIN can create very large result sets."
  },
  Subqueries: {
    explanation: "A subquery is a query nested inside another query.",
    syntax: "SELECT * FROM table_name WHERE column > (SELECT AVG(column) FROM table_name);",
    example: "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
    output: "Employees earning above average salary.",
    tips: "Run the inner query alone first when debugging."
  },
  "Nested Queries": {
    explanation: "Nested queries can appear inside SELECT, FROM, WHERE, and HAVING clauses.",
    syntax: "SELECT * FROM (SELECT ... ) AS derived_table;",
    example: "SELECT * FROM (SELECT name, gpa FROM students WHERE gpa >= 3.5) AS honors;",
    output: "Rows from the nested honors result.",
    tips: "Give derived tables an alias."
  },
  EXISTS: {
    explanation: "EXISTS checks whether a related subquery returns at least one row.",
    syntax: "WHERE EXISTS (SELECT 1 FROM other_table WHERE condition)",
    example: "SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);",
    output: "Customers with at least one order.",
    tips: "EXISTS is often efficient for relationship checks."
  },
  "ANY and ALL": {
    explanation: "ANY compares a value to at least one value from a subquery. ALL compares a value to every value from a subquery. SQLite support is limited, but the concept appears in many SQL systems.",
    syntax: "WHERE value > ANY (subquery)\nWHERE value > ALL (subquery)",
    example: "SELECT name, salary FROM employees WHERE salary > (SELECT MIN(salary) FROM employees);",
    output: "Employees earning more than the minimum salary.",
    tips: "In SQLite, rewrite ANY and ALL logic with MIN, MAX, EXISTS, or IN."
  },
  UNION: {
    explanation: "UNION stacks compatible result sets and removes duplicates.",
    syntax: "SELECT column FROM a UNION SELECT column FROM b;",
    example: "SELECT city AS place FROM students UNION SELECT location AS place FROM departments;",
    output: "Unique places from student cities and department locations.",
    tips: "Both queries must return the same number of columns."
  },
  "UNION ALL": {
    explanation: "UNION ALL stacks compatible result sets and keeps duplicates.",
    syntax: "SELECT column FROM a UNION ALL SELECT column FROM b;",
    example: "SELECT city AS place FROM students UNION ALL SELECT location AS place FROM departments;",
    output: "All places, including duplicates.",
    tips: "UNION ALL is usually faster than UNION because it does not remove duplicates."
  },
  INTERSECT: {
    explanation: "INTERSECT returns rows that appear in both result sets.",
    syntax: "SELECT column FROM a INTERSECT SELECT column FROM b;",
    example: "SELECT city FROM students INTERSECT SELECT location FROM departments;",
    output: "Places found in both lists.",
    tips: "INTERSECT is useful for finding overlap."
  },
  "EXCEPT / MINUS": {
    explanation: "EXCEPT returns rows from the first result set that are not in the second. Oracle uses MINUS for similar behavior.",
    syntax: "SELECT column FROM a EXCEPT SELECT column FROM b;",
    example: "SELECT city FROM students EXCEPT SELECT location FROM departments;",
    output: "Student cities that are not department locations.",
    tips: "This playground uses SQLite, so use EXCEPT."
  },
  "CASE Statement": {
    explanation: "CASE adds conditional logic to a query result.",
    syntax: "CASE WHEN condition THEN value ELSE fallback END",
    example: "SELECT name, CASE WHEN gpa >= 3.7 THEN 'honors' ELSE 'standard' END AS track FROM students;",
    output: "Students labeled by academic track.",
    tips: "CASE is excellent for buckets, labels, and report logic."
  },
  "IFNULL / COALESCE": {
    explanation: "IFNULL and COALESCE replace NULL with fallback values. COALESCE can check multiple expressions.",
    syntax: "IFNULL(value, fallback)\nCOALESCE(value1, value2, fallback)",
    example: "SELECT name, COALESCE(email, 'no email') AS contact FROM customers;",
    output: "Customer names with email or fallback text.",
    tips: "COALESCE is standard SQL and more flexible."
  },
  NULLIF: {
    explanation: "NULLIF returns NULL when two expressions are equal; otherwise it returns the first expression.",
    syntax: "NULLIF(expression1, expression2)",
    example: "SELECT NULLIF(status, 'paid') AS non_paid_status FROM orders;",
    output: "Paid statuses become NULL; other statuses remain.",
    tips: "NULLIF is useful for avoiding divide-by-zero or hiding sentinel values."
  },
  Views: {
    explanation: "A view saves a SELECT query as a reusable virtual table.",
    syntax: "CREATE VIEW view_name AS SELECT ...;",
    example: "CREATE VIEW paid_orders AS SELECT * FROM orders WHERE status = 'paid';",
    output: "A paid_orders view is created.",
    tips: "Views simplify repeated reporting queries."
  },
  "Temporary Tables": {
    explanation: "Temporary tables store intermediate data for the current session.",
    syntax: "CREATE TEMP TABLE temp_name AS SELECT ...;",
    example: "CREATE TEMP TABLE paid_order_totals AS SELECT customer_id, SUM(quantity) AS units FROM orders WHERE status = 'paid' GROUP BY customer_id;",
    output: "A temporary table with paid units by customer.",
    tips: "Temporary tables disappear when the database session ends."
  },
  "Common Table Expressions (CTEs)": {
    explanation: "A CTE creates a named temporary result inside one SQL statement.",
    syntax: "WITH cte_name AS (SELECT ...)\nSELECT * FROM cte_name;",
    example: "WITH paid AS (SELECT * FROM orders WHERE status = 'paid') SELECT COUNT(*) FROM paid;",
    output: "The number of paid orders.",
    tips: "CTEs make multi-step queries easier to read."
  },
  CONCAT: {
    explanation: "CONCAT combines text values. SQLite commonly uses the || operator instead of CONCAT().",
    syntax: "value1 || ' ' || value2",
    example: "SELECT name || ' - ' || city AS student_label FROM students;",
    output: "Combined student name and city labels.",
    tips: "Different SQL databases use different string concatenation syntax."
  },
  SUBSTRING: {
    explanation: "SUBSTRING extracts part of a text value. SQLite uses substr().",
    syntax: "substr(text_column, start, length)",
    example: "SELECT name, substr(name, 1, 3) AS short_name FROM students;",
    output: "Each student with the first three characters of their name.",
    tips: "SQLite string positions start at 1."
  },
  LENGTH: {
    explanation: "LENGTH returns the number of characters in a text value.",
    syntax: "LENGTH(text_column)",
    example: "SELECT name, LENGTH(name) AS name_length FROM students;",
    output: "Student names with character counts.",
    tips: "Use LENGTH to validate or profile text data."
  },
  "UPPER / LOWER": {
    explanation: "UPPER converts text to uppercase. LOWER converts text to lowercase.",
    syntax: "UPPER(text_column)\nLOWER(text_column)",
    example: "SELECT UPPER(name) AS loud_name, LOWER(city) AS city_key FROM students;",
    output: "Formatted student names and city values.",
    tips: "LOWER is useful for case-insensitive comparisons."
  },
  REPLACE: {
    explanation: "REPLACE swaps matching text with new text.",
    syntax: "REPLACE(text_column, old_text, new_text)",
    example: "SELECT REPLACE(category, 'Hardware', 'Devices') AS category_label FROM products;",
    output: "Hardware category labels changed to Devices in the result.",
    tips: "SELECT with REPLACE previews changes without updating stored data."
  },
  TRIM: {
    explanation: "TRIM removes extra spaces from the beginning and end of text.",
    syntax: "TRIM(text_column)",
    example: "SELECT TRIM(name) AS clean_name FROM customers;",
    output: "Customer names without leading or trailing spaces.",
    tips: "TRIM is a common data-cleaning function."
  },
  CURRENT_DATE: {
    explanation: "CURRENT_DATE returns today's date in many SQL systems. SQLite also supports CURRENT_DATE.",
    syntax: "SELECT CURRENT_DATE;",
    example: "SELECT CURRENT_DATE AS today;",
    output: "The current date from the SQL engine.",
    tips: "Date function names vary across SQL dialects."
  },
  "NOW()": {
    explanation: "NOW() returns the current date and time in many databases. SQLite uses datetime('now').",
    syntax: "SELECT datetime('now');",
    example: "SELECT datetime('now') AS current_timestamp;",
    output: "The current timestamp.",
    tips: "Use SQLite date functions in this playground."
  },
  DATE_FORMAT: {
    explanation: "DATE_FORMAT formats dates in MySQL. SQLite uses strftime().",
    syntax: "strftime('%Y-%m', date_column)",
    example: "SELECT order_date, strftime('%Y-%m', order_date) AS order_month FROM orders;",
    output: "Orders with year-month labels.",
    tips: "Learn the equivalent date functions for the database you use."
  },
  DATEDIFF: {
    explanation: "DATEDIFF returns the difference between dates in many databases. SQLite can subtract julianday() values.",
    syntax: "julianday(end_date) - julianday(start_date)",
    example: "SELECT order_date, ROUND(julianday('2024-05-01') - julianday(order_date)) AS days_old FROM orders;",
    output: "Orders with an age in days.",
    tips: "SQLite stores dates flexibly, often as text in ISO format."
  },
  DATE_ADD: {
    explanation: "DATE_ADD adds time to a date in MySQL. SQLite uses date modifiers.",
    syntax: "DATE(date_column, '+7 days')",
    example: "SELECT order_date, DATE(order_date, '+7 days') AS follow_up_date FROM orders;",
    output: "Each order with a follow-up date seven days later.",
    tips: "SQLite modifiers include '+1 day', '+1 month', and '-1 year'."
  },
  "One-to-One": {
    explanation: "A one-to-one relationship means one row in table A relates to one row in table B.",
    syntax: "users.id -> profiles.user_id UNIQUE",
    example: "CREATE TABLE profiles (id INTEGER PRIMARY KEY, student_id INTEGER UNIQUE REFERENCES students(id), bio TEXT);",
    output: "A profile table where each student can have one profile.",
    tips: "One-to-one relationships are often used for optional details."
  },
  "One-to-Many": {
    explanation: "A one-to-many relationship means one parent row relates to many child rows.",
    syntax: "customers.id -> orders.customer_id",
    example: "SELECT customers.name, COUNT(orders.id) AS orders FROM customers LEFT JOIN orders ON orders.customer_id = customers.id GROUP BY customers.name;",
    output: "Customers with order counts.",
    tips: "This is the most common relational pattern."
  },
  "Many-to-Many": {
    explanation: "A many-to-many relationship uses a junction table between two tables.",
    syntax: "students <- enrollments -> courses",
    example: "CREATE TABLE enrollments (student_id INTEGER, course_name TEXT);",
    output: "A table that can connect many students to many courses.",
    tips: "Junction tables usually contain two foreign keys."
  },
  "What are Indexes": {
    explanation: "Indexes are data structures that help the database find rows faster.",
    syntax: "CREATE INDEX index_name ON table_name(column_name);",
    example: "CREATE INDEX idx_orders_status ON orders(status);",
    output: "An index for order status lookups.",
    tips: "Indexes improve reads but add work to writes."
  },
  "Creating Indexes": {
    explanation: "CREATE INDEX adds an index to one or more columns.",
    syntax: "CREATE INDEX index_name ON table_name(column_name);",
    example: "CREATE INDEX idx_customers_region ON customers(region);",
    output: "A region index is created.",
    tips: "Index columns used often in WHERE, JOIN, and ORDER BY."
  },
  "Unique Indexes": {
    explanation: "A unique index improves lookup speed and prevents duplicate indexed values.",
    syntax: "CREATE UNIQUE INDEX index_name ON table_name(column_name);",
    example: "CREATE UNIQUE INDEX idx_customers_email ON customers(email);",
    output: "A unique email index is created.",
    tips: "Unique indexes enforce data rules and improve searches."
  },
  "Composite Indexes": {
    explanation: "A composite index covers multiple columns in a specific order.",
    syntax: "CREATE INDEX index_name ON table_name(column1, column2);",
    example: "CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);",
    output: "An index for customer and status filtering.",
    tips: "Column order matters in composite indexes."
  },
  "Window Functions": {
    explanation: "Window functions calculate values across related rows without collapsing rows like GROUP BY.",
    syntax: "function() OVER (PARTITION BY column ORDER BY column)",
    example: "SELECT status, quantity, SUM(quantity) OVER (PARTITION BY status) AS status_units FROM orders;",
    output: "Each order row plus total units for its status.",
    tips: "Window functions are essential for analytics."
  },
  "RANK()": {
    explanation: "RANK assigns ranking numbers and leaves gaps when there are ties.",
    syntax: "RANK() OVER (ORDER BY column DESC)",
    example: "SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS salary_rank FROM employees;",
    output: "Employees ranked by salary.",
    tips: "Use RANK when tied values should share the same rank."
  },
  "DENSE_RANK()": {
    explanation: "DENSE_RANK assigns tied rows the same rank without leaving gaps.",
    syntax: "DENSE_RANK() OVER (ORDER BY column DESC)",
    example: "SELECT name, gpa, DENSE_RANK() OVER (ORDER BY gpa DESC) AS gpa_rank FROM students;",
    output: "Students ranked by GPA without rank gaps.",
    tips: "Dense ranks are useful for leaderboard-style reports."
  },
  "ROW_NUMBER()": {
    explanation: "ROW_NUMBER assigns a unique sequential number to each row in the window.",
    syntax: "ROW_NUMBER() OVER (ORDER BY column)",
    example: "SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num FROM employees;",
    output: "Employees numbered from highest salary to lowest salary.",
    tips: "ROW_NUMBER is useful for pagination and top-N queries."
  },
  "LEAD() and LAG()": {
    explanation: "LEAD reads a later row and LAG reads an earlier row within a window.",
    syntax: "LAG(column) OVER (ORDER BY sort_column)\nLEAD(column) OVER (ORDER BY sort_column)",
    example: "SELECT order_date, quantity, LAG(quantity) OVER (ORDER BY order_date) AS previous_quantity FROM orders;",
    output: "Each order with the previous order quantity.",
    tips: "Use LEAD and LAG for trend comparisons."
  },
  "PARTITION BY": {
    explanation: "PARTITION BY divides rows into groups for a window function.",
    syntax: "OVER (PARTITION BY group_column ORDER BY sort_column)",
    example: "SELECT status, order_date, ROW_NUMBER() OVER (PARTITION BY status ORDER BY order_date) AS status_order FROM orders;",
    output: "Rows numbered within each status group.",
    tips: "PARTITION BY is like GROUP BY for window functions, but it does not collapse rows."
  },
  "Query Execution Plans": {
    explanation: "Execution plans show how a database intends to run a query.",
    syntax: "EXPLAIN QUERY PLAN SELECT ...;",
    example: "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE status = 'paid';",
    output: "SQLite describes its plan for the query.",
    tips: "Plans reveal scans, searches, and index usage."
  },
  "Performance Tuning": {
    explanation: "Performance tuning improves query speed by reducing unnecessary work.",
    syntax: "SELECT needed_columns FROM table_name WHERE selective_condition;",
    example: "SELECT id, customer_id, status FROM orders WHERE status = 'paid';",
    output: "Only needed columns from paid orders.",
    tips: "Filter early, select fewer columns, and index common access paths."
  },
  "Optimizing JOINs": {
    explanation: "JOIN optimization means joining on indexed keys, reducing rows early, and avoiding accidental row multiplication.",
    syntax: "SELECT ... FROM a JOIN b ON b.id = a.b_id WHERE selective_filter;",
    example: "SELECT o.id, c.name FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'paid';",
    output: "Paid orders with customer names.",
    tips: "Check join keys and expected row counts at each step."
  },
  "Index Optimization": {
    explanation: "Index optimization means choosing indexes that support frequent filters, joins, and sorting.",
    syntax: "CREATE INDEX index_name ON table_name(filter_column, sort_column);",
    example: "CREATE INDEX idx_orders_status_date ON orders(status, order_date);",
    output: "An index useful for status filters ordered by date.",
    tips: "Too many indexes can slow writes."
  },
  "Avoiding Slow Queries": {
    explanation: "Slow queries often scan too many rows, return unnecessary columns, join incorrectly, or use functions on indexed columns.",
    syntax: "WHERE indexed_column = value",
    example: "SELECT id, status FROM orders WHERE status = 'paid' LIMIT 20;",
    output: "A small targeted result set.",
    tips: "Start with the smallest correct result, then add complexity."
  },
  "Database Normalization": {
    explanation: "Normalization organizes data into related tables to reduce duplication and protect consistency.",
    syntax: "Store one entity per table and connect entities with keys.",
    example: "orders.customer_id references customers.id instead of repeating customer details in every order.",
    output: "Cleaner data with fewer repeated values.",
    tips: "Normalize first for correctness, then denormalize carefully for reporting."
  },
  "1NF": {
    explanation: "First Normal Form means each cell contains a single value and each row is unique.",
    syntax: "No repeating groups; one value per cell.",
    example: "CREATE TABLE student_skills (student_id INTEGER, skill TEXT);",
    output: "Each student skill is stored as its own row.",
    tips: "Avoid comma-separated lists inside a single column."
  },
  "2NF": {
    explanation: "Second Normal Form means every non-key column depends on the whole primary key.",
    syntax: "1NF + no partial dependency on a composite key.",
    example: "Store course_name in courses, not repeated in every enrollment row.",
    output: "Enrollment rows reference courses instead of duplicating course details.",
    tips: "2NF matters most with composite keys."
  },
  "3NF": {
    explanation: "Third Normal Form means non-key columns should not depend on other non-key columns.",
    syntax: "2NF + no transitive dependencies.",
    example: "Store department location in departments, not employees.",
    output: "Employee rows reference department data cleanly.",
    tips: "If one non-key field describes another non-key field, consider a separate table."
  },
  BCNF: {
    explanation: "Boyce-Codd Normal Form is a stricter version of 3NF where every determinant is a candidate key.",
    syntax: "Every dependency X -> Y means X should be a candidate key.",
    example: "Separate instructor-course-room rules into tables that avoid contradictory dependencies.",
    output: "A schema with fewer update anomalies.",
    tips: "BCNF is most relevant in complex schemas with overlapping candidate keys."
  },
  Denormalization: {
    explanation: "Denormalization intentionally repeats or precomputes data to make reads faster or reports simpler.",
    syntax: "CREATE VIEW report_view AS SELECT joined_columns FROM ...;",
    example: "CREATE VIEW order_report AS SELECT c.name, p.name AS product, o.quantity FROM orders o JOIN customers c ON c.id = o.customer_id JOIN products p ON p.id = o.product_id;",
    output: "A report-friendly view.",
    tips: "Denormalization trades write complexity for read speed."
  },
  "Schema Design": {
    explanation: "Schema design is the process of modeling tables, columns, keys, constraints, and relationships.",
    syntax: "entities -> tables\nattributes -> columns\nrelationships -> foreign keys",
    example: "CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT NOT NULL);",
    output: "A simple courses table as part of a schema.",
    tips: "Design around real business entities and how they relate."
  },
  Transactions: {
    explanation: "A transaction groups changes so they succeed or fail together.",
    syntax: "BEGIN TRANSACTION;\n-- changes\nCOMMIT;",
    example: "BEGIN TRANSACTION; UPDATE products SET stock = stock - 1 WHERE id = 1; COMMIT;",
    output: "The stock update is committed.",
    tips: "Transactions protect consistency when multiple changes belong together."
  },
  COMMIT: {
    explanation: "COMMIT permanently saves changes made inside a transaction.",
    syntax: "COMMIT;",
    example: "BEGIN TRANSACTION; UPDATE products SET stock = stock - 1 WHERE id = 1; COMMIT;",
    output: "The transaction changes are saved.",
    tips: "After COMMIT, use another transaction if you need a new atomic unit of work."
  },
  ROLLBACK: {
    explanation: "ROLLBACK undoes changes made in the current transaction.",
    syntax: "ROLLBACK;",
    example: "BEGIN TRANSACTION; UPDATE products SET stock = 0; ROLLBACK;",
    output: "The stock update is undone.",
    tips: "ROLLBACK is valuable when validation fails."
  },
  SAVEPOINT: {
    explanation: "SAVEPOINT marks a point inside a transaction that you can roll back to.",
    syntax: "SAVEPOINT point_name;\nROLLBACK TO point_name;\nRELEASE point_name;",
    example: "SAVEPOINT before_update; UPDATE products SET stock = stock - 1 WHERE id = 1; ROLLBACK TO before_update;",
    output: "Only changes after the savepoint are undone.",
    tips: "SAVEPOINT helps with partial rollback inside larger transactions."
  },
  "ACID Properties": {
    explanation: "ACID means Atomicity, Consistency, Isolation, and Durability. These properties describe reliable transactions.",
    syntax: "Atomicity + Consistency + Isolation + Durability",
    example: "BEGIN TRANSACTION; UPDATE products SET stock = stock - 1 WHERE id = 1; COMMIT;",
    output: "A transaction that behaves as one reliable unit.",
    tips: "ACID is why databases are trusted for critical data."
  },
  "Recursive CTEs": {
    explanation: "Recursive CTEs repeatedly build result rows until a stop condition is met.",
    syntax: "WITH RECURSIVE cte AS (base_query UNION ALL recursive_query) SELECT * FROM cte;",
    example: "WITH RECURSIVE numbers(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n < 5) SELECT n FROM numbers;",
    output: "Numbers 1 through 5.",
    tips: "Always include a stop condition."
  }
};

function genericLesson(topic, section, level) {
  return {
    title: topic,
    section,
    explanation: `${topic} is an important ${level} SQL concept in the ${section} section. This lesson explains what it is, when to use it, and how it appears in real database work.`,
    syntax: syntaxFor(topic),
    example: exampleFor(topic),
    output: outputFor(topic),
    tips: tipsFor(topic)
  };
}

function syntaxFor(topic) {
  if (topic.includes("Procedure")) return "CREATE PROCEDURE procedure_name AS ...;";
  if (topic.includes("Trigger")) return "CREATE TRIGGER trigger_name AFTER INSERT ON table_name BEGIN ... END;";
  if (topic.includes("Function")) return "CREATE FUNCTION function_name(...) RETURNS ...;";
  if (topic.includes("Materialized")) return "CREATE MATERIALIZED VIEW view_name AS SELECT ...;";
  if (topic.includes("Pivot")) return "SUM(CASE WHEN category = 'value' THEN amount ELSE 0 END)";
  if (topic.includes("API") || topic.includes("Backend") || topic.includes("ORM")) return "Application code -> parameterized SQL query -> database";
  if (topic.includes("Migration") || topic.includes("Versioning")) return "001_create_tables.sql\n002_add_indexes.sql";
  if (topic.includes("Security") || topic.includes("Injection")) return "Use parameterized queries instead of string concatenation.";
  if (topic.includes("Partition") || topic.includes("Shard") || topic.includes("Replication")) return "Large database architecture pattern; syntax depends on the database engine.";
  return "SELECT columns FROM table_name WHERE condition;";
}

function exampleFor(topic) {
  if (topic.includes("Dashboard")) return "SELECT status, COUNT(*) AS orders, SUM(quantity) AS units FROM orders GROUP BY status;";
  if (topic.includes("Analytics") || topic.includes("Reporting")) return "SELECT c.region, p.category, SUM(o.quantity) AS units FROM orders o JOIN customers c ON c.id = o.customer_id JOIN products p ON p.id = o.product_id GROUP BY c.region, p.category;";
  if (topic.includes("E-commerce")) return "SELECT c.name, p.name AS product, o.quantity FROM orders o JOIN customers c ON c.id = o.customer_id JOIN products p ON p.id = o.product_id;";
  if (topic.includes("Audit")) return "CREATE TABLE audit_logs (id INTEGER PRIMARY KEY, action TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);";
  if (topic.includes("Soft Deletes")) return "ALTER TABLE products ADD COLUMN deleted_at TEXT;";
  if (topic.includes("Interview") || topic.includes("Challenge")) return "SELECT department_id, MAX(salary) AS top_salary FROM employees GROUP BY department_id;";
  return "SELECT * FROM orders LIMIT 5;";
}

function outputFor(topic) {
  if (topic.includes("CREATE") || topic.includes("ALTER")) return "The database object or structure is created or changed.";
  if (topic.includes("Security") || topic.includes("Injection")) return "Safer database access that avoids malicious SQL being executed.";
  if (topic.includes("Optimization") || topic.includes("Performance")) return "A query that does less work and returns results faster.";
  return `A result set that demonstrates ${topic}.`;
}

function tipsFor(topic) {
  if (topic.includes("SQLite")) return "SQLite syntax can differ from MySQL, PostgreSQL, and SQL Server.";
  if (topic.includes("JOIN")) return "Always confirm join keys and expected row counts.";
  if (topic.includes("Index")) return "Index columns used often in WHERE, JOIN, and ORDER BY.";
  if (topic.includes("Security") || topic.includes("Injection")) return "Never build SQL by directly concatenating untrusted user input.";
  return "Practice the query in the playground, then change one clause at a time to understand the effect.";
}

function createLesson(topic, section, level) {
  return {
    ...genericLesson(topic, section, level),
    ...(lessonDetails[topic] || {}),
    title: topic,
    section
  };
}

function buildLessons(level) {
  return curriculum[level].flatMap((group) => group.topics.map((topic) => createLesson(topic, group.section, level)));
}

export const lessonsData = {
  beginner: buildLessons("beginner"),
  intermediate: buildLessons("intermediate"),
  advanced: buildLessons("advanced")
};

export const cheatSheetSections = [
  {
    title: "Querying Data in SQL",
    items: [
      ["SELECT", "SELECT * FROM employees;"],
      ["DISTINCT", "SELECT DISTINCT region FROM customers;"],
      ["WHERE", "SELECT * FROM employees WHERE salary > 55000;"],
      ["LIMIT", "SELECT * FROM employees LIMIT 3;"],
      ["FETCH", "SELECT * FROM employees FETCH FIRST 3 ROWS ONLY;"]
    ]
  },
  {
    title: "Filtering Data in SQL",
    items: [
      ["WHERE", "SELECT * FROM employees WHERE department_id = 1;"],
      ["LIKE", "SELECT * FROM employees WHERE name LIKE 'J%';"],
      ["IN", "SELECT * FROM customers WHERE region IN ('Europe', 'Asia Pacific');"],
      ["BETWEEN", "SELECT * FROM products WHERE price BETWEEN 50 AND 200;"],
      ["IS NULL", "SELECT * FROM customers WHERE email IS NULL;"]
    ]
  },
  {
    title: "SQL Operator",
    items: [
      ["AND", "SELECT * FROM employees WHERE department_id = 1 AND salary > 120000;"],
      ["OR", "SELECT * FROM customers WHERE region = 'Europe' OR region = 'Asia Pacific';"],
      ["NOT", "SELECT * FROM orders WHERE NOT status = 'paid';"],
      ["ORDER BY", "SELECT * FROM employees ORDER BY salary DESC;"],
      ["GROUP BY", "SELECT departments.name, COUNT(employees.id) AS employee_count FROM departments LEFT JOIN employees ON employees.department_id = departments.id GROUP BY departments.name;"]
    ]
  },
  {
    title: "Aggregation Data in SQL",
    items: [
      ["COUNT", "SELECT COUNT(*) FROM employees;"],
      ["SUM", "SELECT SUM(quantity) FROM orders;"],
      ["AVG", "SELECT AVG(salary) FROM employees;"],
      ["MIN", "SELECT MIN(price) FROM products;"],
      ["MAX", "SELECT MAX(stock) FROM products;"]
    ]
  },
  {
    title: "Joins in SQL",
    items: [
      ["INNER JOIN", "SELECT employees.name, departments.name FROM employees INNER JOIN departments ON employees.department_id = departments.id;"],
      ["LEFT JOIN", "SELECT departments.name, employees.name FROM departments LEFT JOIN employees ON employees.department_id = departments.id;"],
      ["CROSS JOIN", "SELECT employees.name, departments.name FROM employees CROSS JOIN departments;"],
      ["UNION", "SELECT name FROM students UNION SELECT name FROM customers;"],
      ["EXCEPT", "SELECT name FROM students EXCEPT SELECT name FROM customers;"]
    ]
  },
  {
    title: "Indexes & Transactions in SQL",
    items: [
      ["CREATE INDEX", "CREATE INDEX idx_department_id ON employees (department_id);"],
      ["DROP INDEX", "DROP INDEX IF EXISTS idx_department_id;"],
      ["BEGIN TRANSACTION", "BEGIN TRANSACTION;"],
      ["COMMIT", "COMMIT;"],
      ["ROLLBACK", "ROLLBACK;"]
    ]
  }
];

export const lessonCategories = [
  { id: "beginner", label: "Beginner Lessons" },
  { id: "intermediate", label: "Intermediate Lessons" },
  { id: "advanced", label: "Advanced Lessons" }
];
